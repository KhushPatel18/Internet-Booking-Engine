import { TextField, Button, Checkbox } from "@mui/material";
import "./PaymentInformation.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import isValid from "card-validator";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppSelector } from "../../redux/store";
import { BASE_URL, PROPERTY_ID } from "../../Util/API";
import { SnackbarComponent } from "../SnackbarComponent/SnackbarComponent";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { TermsAndConditions } from "../TermsAndCond/TermsAndCond";
import { Loading } from "react-loading-dot";

interface Props {
   activeSection: string;
   handleEditBillingInfo: () => void;
}

const PaymentInformation: React.FC<Props> = ({
   activeSection,
   handleEditBillingInfo,
}) => {
   const paymentSchema = Yup.object().shape({
      cardNumber: Yup.string()
         .required("Card number is required")
         .test("is-valid-card", "Invalid card number", function (value) {
            return isValid.number(value).isValid;
         }),
      expiryMonth: Yup.string()
         .required("Expiration month is required")
         .test("is-valid-month", "Invalid month", function (value) {
            const { expiryYear } = this.parent;
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            return (
               parseInt(value, 10) >= 1 &&
               parseInt(value, 10) <= 12 &&
               (parseInt(expiryYear, 10) > currentYear ||
                  parseInt(expiryYear, 10) < currentYear ||
                  (parseInt(expiryYear, 10) === currentYear &&
                     parseInt(value, 10) >= currentMonth))
            );
         }),
      expiryYear: Yup.string()
         .required("Expiration year is required")
         .test("is-valid-year", "Invalid year", function (value) {
            const currentYear = new Date().getFullYear();
            return (
               parseInt(value, 10) >= currentYear &&
               parseInt(value, 10) >= 2023 &&
               parseInt(value, 10) <= 2050
            );
         }),
      cvvCode: Yup.string()
         .required("CVV code is required")
         .matches(/^\d{3,4}$/, "Invalid CVV code"),
   });
   const [error, setError] = useState("");
   const [snackbar, setSnackbar] = useState(false);
   const [positiveSnackbar, setPositiveSnackbar] = useState(false);
   const [roomConfirmationSnack, setRoomConfirmationSnack] = useState(false);
   const [loading, setLoading] = useState(false);
   const {
      register: registerPayment,
      handleSubmit: handleSubmitPayment,
      formState: { errors: paymentErrors },
   } = useForm<FormValuesPayment>({
      resolver: yupResolver(paymentSchema),
   });
   const travellerInfo = useSelector((state: RootState) => state.travellerInfo);
   const billingInfo = useSelector((state: RootState) => state.billingInfo);
   const iternaryInfo = useAppSelector(
      (state) => state.ItinerarySlice.itineraryDetails
   );
   const startDate = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.filterStates.startDate
   );
   const endDate = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.filterStates.endDate
   );
   const selectedGuests = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.filterStates.selectedGuests
   );
   const { vat, dueNow, occupancyTax, resortFee } = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.currentConfig
   );
   const [displayCardNumber, setDisplayCardNumber] = useState("");
   const [agreedToTerms, setAgreedToTerms] = useState(false);
   const [sendPromotions, setSendPromotions] = useState(false);
   const bookTheRooms = async (
      rooms: number[],
      formData: FormValuesPayment
   ) => {
      const bookingData = {
         travellerInfo,
         billingInfo,
         paymentInfo: {
            cardNumber: formData.cardNumber,
            expiryMonth: parseInt(formData.expiryMonth),
            expiryYear: parseInt(formData.expiryYear),
         },
         iternaryInfo: {
            checkInDate: startDate.toISOString(),
            checkOutDate: endDate.toISOString(),
            adultCount: selectedGuests["Adults"] ?? 1,
            childCount: selectedGuests["Kids"] ?? 0,
            amountAtResort:
               iternaryInfo.subtotal *
               (vat + occupancyTax + resortFee) *
               (1 - dueNow),
            guestName: travellerInfo.firstName + " " + travellerInfo.lastName,
            propertyId: PROPERTY_ID,
            availabilities: rooms,
            promoName: iternaryInfo.specialPromoName,
            promoDescription: iternaryInfo.specialPromoDescription,
            roomName: iternaryInfo.roomName,
            roomImage: iternaryInfo.roomImage,
            guestString: iternaryInfo.guestString,
            nightlyRate: iternaryInfo.avgPrice * iternaryInfo.noOfRooms,
            subtotal: iternaryInfo.subtotal,
            taxes: Math.ceil(
               iternaryInfo.subtotal * (occupancyTax + resortFee)
            ),
            vat: Math.ceil(iternaryInfo.subtotal * vat),
            totalCost:
               iternaryInfo.subtotal +
               Math.ceil(iternaryInfo.subtotal * (occupancyTax + resortFee)) +
               Math.ceil(iternaryInfo.subtotal * vat),
         },
      };
      console.log(bookingData);
      try {
         const response = await fetch(`${BASE_URL}/api/v1/booking`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(bookingData),
         });
         const data = await response.json();
         return { data: data, status: response.status };
      } catch (error) {
         return { data: error, status: 500 };
      }
   };

   const sendAPI = async (formData: FormValuesPayment) => {
      const { billingPhone, billingEmail } = billingInfo;

      const subscriberData = {
         email: billingEmail,
         phone: billingPhone,
      };

      setLoading(true);

      if (sendPromotions) {
         try {
            const response = await fetch(`${BASE_URL}/api/v1/subscribers/add`, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(subscriberData),
            });
            if (!response.ok) {
               throw new Error("Failed to add subscriber");
            }
         } catch (error) {
            console.error("Error adding subscriber:", error);
         }
      }

      // two step process

      const preBookingRequestBody = {
         roomsRequired: iternaryInfo.noOfRooms,
         roomTypeId: iternaryInfo.roomTypeId,
         propertyId: PROPERTY_ID,
         email: billingEmail,
         startDate: startDate.toISOString().substring(0, 10),
         endDate: endDate.toISOString().substring(0, 10),
      };

      // pre Booking API to make pre booking without mutation ---> handles concurrency
      try {
         const response = await fetch(`${BASE_URL}/api/v1/prebooking`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(preBookingRequestBody),
         });
         const data = await response.json();
         if (response.status !== 200) {
            setError(data.msg);
            setSnackbar(true);
            setTimeout(() => {
               window.location.href = "/rooms";
            }, 1000);
         } else {
            setRoomConfirmationSnack(true);
            // gives success send user data for mutation
            const res = await bookTheRooms(data, formData);
            if (res.status !== 200) {
               setError(res.data.msg ?? res.data);
               setSnackbar(true);
            } else {
               const { bookingId, bookingEmail } = res.data;
               setPositiveSnackbar(true);
               setTimeout(() => {
                  console.log(
                     `/confirmation?bookingId=${bookingId}&email=${bookingEmail}`
                  );
                  window.location.href = `/confirmation?bookingId=${bookingId}&email=${bookingEmail}`;
               }, 1000);
            }
         }
      } catch (error) {
         setLoading(false);
         setSnackbar(true);
         setError("Something went wrong");
      }
   };
   const onSubmitPayment: SubmitHandler<FormValuesPayment> = async (data) => {
      console.log(
         data.expiryMonth,
         data.expiryYear,
         data.cardNumber,
         data.cardNumber.split("-").join("")
      );
      await sendAPI(data);
   };
   const subtotal = useAppSelector(
      (state) => state.ItinerarySlice.itineraryDetails.subtotal
   );
   const handlePromotionsChange = () => {
      setSendPromotions(!sendPromotions);
   };
   const specialModalRef = useRef<HTMLDialogElement | null>(null);
   const closeSpecialModal = () => {
      if (specialModalRef.current) {
         specialModalRef.current.close();
      }
   };
   const handleAgreementChange = () => {
      if (specialModalRef.current) {
         specialModalRef.current.showModal();
      }
      setAgreedToTerms(!agreedToTerms);
   };
   const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = e.target.value
         .replace(/\D/g, "")
         .replace(/(\d{4})(?=\d)/g, "$1-")
         .substring(0, 19);

      setDisplayCardNumber(formattedValue);
   };

   const exchangeRate = useAppSelector(
      (state) => state.LanguageReducer.exchangeRate
   );
   const selectedCurrency = useAppSelector(
      (state) => state.LanguageReducer.selectedCurrency
   );

   return (
      <form onSubmit={handleSubmitPayment(onSubmitPayment)} noValidate>
         <div className="payment-info">
            <div className="payment-title">
               <FormattedMessage
                  id="payment-heading"
                  defaultMessage="3. Payment Info"
                  description=""
               />
            </div>
            <div
               className={` ${
                  activeSection === "payment-info-visible"
                     ? "payment-info-visible"
                     : "expanded"
               }`}>
               <div className="card">
                  <div className="card-name">
                     <div className="title">
                        <FormattedMessage
                           id="payment-Card"
                           defaultMessage=""
                           description=""
                        />
                     </div>
                     <div className="content">
                        <TextField
                           id="card-number"
                           variant="outlined"
                           {...registerPayment("cardNumber")}
                           error={!!paymentErrors.cardNumber}
                           sx={{
                              width: "90%",
                              "@media (max-width: 1023px)": {
                                 width: "100%",
                              },
                           }}
                           // type="number"
                           value={displayCardNumber}
                           onChange={handleCardNumberChange}
                           helperText={paymentErrors.cardNumber?.message}
                        />
                     </div>
                  </div>
                  <div className="expiry">
                     <div className="expiry-month">
                        <div className="title">
                           <FormattedMessage
                              id="payment-ExpMonth"
                              defaultMessage=""
                              description=""
                           />
                        </div>
                        <div className="content">
                           <TextField
                              id="expiry-month"
                              variant="outlined"
                              {...registerPayment("expiryMonth")}
                              error={!!paymentErrors.expiryMonth}
                              helperText={paymentErrors.expiryMonth?.message}
                              sx={{ width: "100%" }}
                              type="number"
                           />
                        </div>
                     </div>
                     <div className="expiry-year">
                        <div className="title">
                           <FormattedMessage
                              id="payment-ExpYear"
                              defaultMessage=""
                              description=""
                           />
                        </div>
                        <div className="content">
                           <TextField
                              id="expiry-year"
                              variant="outlined"
                              {...registerPayment("expiryYear")}
                              error={!!paymentErrors.expiryYear}
                              helperText={paymentErrors.expiryYear?.message}
                              sx={{ width: "100%" }}
                              type="number"
                           />
                        </div>
                     </div>
                  </div>
               </div>
               <div className="cvv-code">
                  <div className="title">
                     <FormattedMessage
                        id="payment-CVV"
                        defaultMessage=""
                        description=""
                     />
                  </div>
                  <div className="content">
                     <TextField
                        id="cvv-code"
                        variant="outlined"
                        {...registerPayment("cvvCode")}
                        sx={{
                           width: "90%",
                           "@media (max-width: 1023px)": {
                              width: "100%",
                           },
                        }}
                        type="password"
                        error={!!paymentErrors.cvvCode}
                        helperText={paymentErrors.cvvCode?.message}
                     />
                  </div>
               </div>
               <div className="offers">
                  <div className="checkbox">
                     <Checkbox
                        checked={sendPromotions}
                        onChange={handlePromotionsChange}
                     />
                  </div>
                  <div className="special-offers">
                     <FormattedMessage
                        id="payment-special offers"
                        defaultMessage=""
                        description=""
                     />
                  </div>
               </div>
               <div className="offers">
                  <div className="checkbox">
                     <Checkbox
                        checked={agreedToTerms}
                        onChange={handleAgreementChange}
                     />
                  </div>
                  <div className="special-offers">
                     <FormattedMessage
                        id="payment-terms-1"
                        defaultMessage="I agree to the"
                        description=""
                     />{" "}
                     <b className="terms-and-policies">
                        <FormattedMessage
                           id="payment-terms-2"
                           defaultMessage="Terms and Policies"
                           description=""
                        />
                     </b>{" "}
                     <FormattedMessage
                        id="payment-terms-3"
                        defaultMessage="of Travel"
                        description=""
                     />
                  </div>
               </div>
               <div className="total-amount">
                  <div className="total-due">
                     <FormattedMessage
                        id="Total Due"
                        defaultMessage="Total Due"
                        description=""
                     />
                  </div>
                  <div className="price">
                     <FormattedNumber
                        style="currency"
                        value={
                           Math.ceil(
                              (subtotal +
                                 subtotal * (vat + occupancyTax + resortFee)) *
                                 dueNow
                           ) * exchangeRate[selectedCurrency]
                        }
                        currency={selectedCurrency}
                        maximumFractionDigits={0}
                     />
                  </div>
               </div>
               <div className="next">
                  <Button
                     variant="text"
                     onClick={handleEditBillingInfo}
                     sx={{
                        color: "#26266D",
                        fontWeight: "400",
                        marginRight: "20px",
                     }}>
                     <FormattedMessage
                        id="payment-editbilling"
                        defaultMessage="Edit Billing Info."
                        description=""
                     />
                  </Button>
                  <Button
                     variant="contained"
                     type="submit"
                     disabled={!agreedToTerms}
                     sx={{
                        backgroundColor: "#26266D",
                        borderRadius: "4px",
                        padding: "12px, 20px, 12px, 20px",
                        width: "fit-content",
                        heigth: "50%",
                     }}>
                     {loading ? (
                        <Loading background="#26266D" />
                     ) : (
                        <FormattedMessage
                           id="payment-submit"
                           defaultMessage="PURCHASE"
                           description=""
                        />
                     )}
                  </Button>
               </div>
            </div>
            {snackbar && <SnackbarComponent content={error} type="error" />}
            {positiveSnackbar && (
               <SnackbarComponent
                  content={
                     "Rooms Booked Successfully redirecting to confirmation page"
                  }
                  type="success"
               />
            )}
            {roomConfirmationSnack && (
               <SnackbarComponent
                  content={
                     "Booking Found successfully sending your data for confirmation"
                  }
                  type="success"
               />
            )}

            <dialog
               data-modal
               ref={specialModalRef}
               className="terms-modal-dialog"
               style={{ margin: "auto", border: "none" }}>
               <TermsAndConditions onClose={closeSpecialModal} />
            </dialog>
         </div>
      </form>
   );
};

export default PaymentInformation;
