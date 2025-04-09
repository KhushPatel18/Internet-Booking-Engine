import { useEffect, useRef, useState } from "react";
import { Header } from "../../Components/Header/Header";
import UpDownArrowPair from "../../Components/UpDownArrowPair/UpDownArrowPair";
import "./ConfirmationPage.scss";
import CancelRoomModal from "../../Components/CancelRoomModal/CancelRoomModal";
import { Footer } from "../../Components/Footer/Footer";
import CancelConfirmationModal from "../../Components/CancelConfirmationModal/CancelConfirmationModal";
import {
   AuthenticatedTemplate,
   UnauthenticatedTemplate,
   useIsAuthenticated,
} from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import {
   formatDate,
   initialBookingInfo,
   maskCardNumber,
   validateParams,
} from "../../Util/bookingUtil";
import { BASE_URL, urlEndpoint } from "../../Util/API";
import { BookingInfo } from "../../Types/Confirmation";
import { SnackbarComponent } from "../../Components/SnackbarComponent/SnackbarComponent";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { useAppSelector } from "../../redux/store";
import { IKImage } from "imagekitio-react";
export function ConfirmationPage() {
   const isAuthenticated = useIsAuthenticated();
   const [showSnackbar, setShowSnackbar] = useState(false);
   const [showEmailSnackbar, setShowEmailSnackbar] = useState(false);
   const [showErrorSnack, setShowErrorSnack] = useState(false);
   const [error, setError] = useState("");
   const [cancel, setCancel] = useState(false);
   const navigate = useNavigate();
   const [bookingInfo, setBookingInfo] =
      useState<BookingInfo>(initialBookingInfo);
   const [loading, setLoading] = useState(false);
   const searchParams = new URLSearchParams(window.location.search);
   const bookingId = searchParams.get("bookingId");
   useEffect(() => {
      const email = searchParams.get("email");
      console.log(bookingId, email);
      if (bookingId && email) {
         if (!validateParams(bookingId, email)) {
            console.log("wrong booking id and email");
            // not valid booking go to not found page
            navigate("/notfound");
         } else {
            fetchBookingDetails(parseInt(bookingId), email);
         }
      } else {
         navigate("/notfound");
      }
   }, [cancel]);

   const exchangeRate = useAppSelector(
      (state) => state.LanguageReducer.exchangeRate
   );
   const selectedCurrency = useAppSelector(
      (state) => state.LanguageReducer.selectedCurrency
   );

   const fetchBookingDetails = async (bookingId: number, email: string) => {
      setLoading(true);
      try {
         const res = await fetch(
            `${BASE_URL}/api/v1/booking?bookingId=${bookingId}&email=${email}`
         );
         const data = await res.json();
         console.log(res.status);
         if (res.status !== 200) {
            navigate("/notfound");
         }
         setBookingInfo(data);
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
   };

   // no way to go back from confirmation page
   window.onpopstate = () => {
      window.location.href = "/";
   };

   const sendOtpEmail = async (
      email: string,
      customerName: string,
      companyName: string,
      bId: number
   ) => {
      try {
         const reqBody = {
            email: email,
            type: "Booking Cancelation OTP",
            customerName: customerName,
            companyName: companyName,
            bookingId: bId,
         };

         const response = await fetch(`${BASE_URL}/api/v1/emails/otp`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
         });
         console.log(response.body);
         const data = await response.json();
         console.log(data);
         if (data === "SUCCESSFULLY_COMPLETED") {
            setShowSnackbar(true);
         }
      } catch (error) {
         setLoading(false);
      }
   };

   const {
      checkInDate,
      checkOutDate,
      packageName,
      packageDescription,
      roomName,
      guestString,
      nightlyRate,
      subtotal,
      taxes,
      vat,
      total,
      roomImage,
   } = bookingInfo.iternaryInfo;
   const {
      billingFirstName,
      billingLastName,
      billingAddress1,
      billingAddress2,
      billingCountry,
      billingCity,
      billingState,
      billingZip,
      billingPhone,
      billingEmail,
   } = bookingInfo.billingInfo;
   const { cardNumber, expiryMonth, expiryYear, booking } =
      bookingInfo.paymentInfo;
   const { firstName, lastName, phone, email } = bookingInfo.travellerInfo;

   const [roomTotalOpen, setRoomTotalOpen] = useState(true);
   const [guestsOpen, setGuestsOpen] = useState(false);
   const [billingOpen, setBillingOpen] = useState(false);
   const [paymentOpen, setPaymentOpen] = useState(false);

   const cancelRoomModal = useRef<HTMLDialogElement | null>(null);
   const closeCancelRoomModal = () => {
      if (cancelRoomModal.current) {
         cancelRoomModal.current.close();
      }
   };

   const handleOpenModal = () => {
      if (cancelRoomModal.current) {
         cancelRoomModal.current.showModal();
      }
   };
   const cancelViaOtp: (otp: number) => Promise<{
      content: string;
      type: "error" | "success";
   }> = async (otp: number) => {
      const reqBody = {
         bookingId: bookingId,
         otp: otp,
         availabilities: booking.availabilities,
         checkInDate: checkInDate,
         checkOutDate: checkOutDate,
      };
      try {
         const res = await fetch(`${BASE_URL}/api/v1/booking/cancel`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
         });
         const data = await res.json();
         console.log(data);
         if (res.status === 200) {
            setCancel(true);
            return { content: data.msg, type: "success" };
         } else {
            setError(data.msg);
            setShowErrorSnack(true);
            return { content: data.msg, type: "error" };
         }
      } catch (error) {
         setError("Unable to cancel booking try again");
         setShowErrorSnack(true);
         console.log(error);
         return { content: "something went wrong", type: "error" };
      }
   };
   const emailForCancel = useAppSelector(
      (state) => state.AuthSliceReducer.email
   );
   const cancelWithOutOTP: () => Promise<{
      content: string;
      type: "error" | "success";
   }> = async () => {
      const reqBody = {
         bookingId: bookingId,
         availabilities: booking.availabilities,
         email: emailForCancel,
         checkInDate: checkInDate,
         checkOutDate: checkOutDate,
      };
      try {
         setLoading(true);
         const res = await fetch(`${BASE_URL}/api/v1/booking/cancel`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
         });
         const data = await res.json();
         console.log(data);
         if (res.status === 200) {
            return { content: data.msg, type: "success" };
         } else {
            return { content: data.msg, type: "error" };
         }
      } catch (error) {
         console.log(error);
         return { content: "something went wrong", type: "error" };
      } finally {
         setLoading(false);
      }
   };

   const sendConfirmationEmail = async () => {
      setLoading(true);
      const reqBody = {
         email: email,
         type: "Booking Confirmation",
         customerName: firstName + " " + lastName,
         companyName: "Team 12 Hotels",
         bookingId: parseInt(bookingId!),
      };
      try {
         const res = await fetch(
            `${BASE_URL}/api/v1/emails/booking-confirmation`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(reqBody),
            }
         );
         console.log(res.body, res.statusText);
         setLoading(false);
         setShowEmailSnackbar(true);
      } catch (error) {
         console.log(error);
      }
   };

   const handlePrintButtonClick = () => {
      setRoomTotalOpen(true);
      setGuestsOpen(true);
      setBillingOpen(true);
      setPaymentOpen(true);
      setTimeout(() => {
         window.print();
         setRoomTotalOpen(false);
         setGuestsOpen(false);
         setBillingOpen(false);
         setPaymentOpen(false);
      }, 100);
   };

   return (
      <div className="confirmation-container">
         <div className="confirmation-header">
            <Header />
         </div>
         <main id="divToPrint" className="confirmation-main-container width-77">
            <div className="confirmation-main-header">
               {booking.canceled ? (
                  <h1 style={{ color: "#888" }}>
                     <FormattedMessage
                        id="Canceled Booking"
                        defaultMessage="Canceled Booking"
                        description=""
                     />{" "}
                     #{bookingId}
                  </h1>
               ) : (
                  <h1>
                     <FormattedMessage
                        id="Upcoming reservation"
                        defaultMessage="Upcoming reservation"
                        description=""
                     />{" "}
                     #{bookingId}
                  </h1>
               )}
               <div className="buttons">
                  <button
                     className="print-btn"
                     onClick={handlePrintButtonClick}>
                     <FormattedMessage
                        id="Print"
                        defaultMessage="Print"
                        description=""
                     />
                  </button>
                  <button
                     disabled={booking.canceled}
                     style={
                        booking.canceled ? { opacity: "0.5" } : { opacity: "1" }
                     }
                     className="email-btn"
                     onClick={sendConfirmationEmail}>
                     <FormattedMessage
                        id="Email"
                        defaultMessage="Email"
                        description=""
                     />
                  </button>
               </div>
            </div>
            <div className="confirmation-main-top-container">
               <div className="confirmation-main-top-header">
                  <div className="confirmation-main-top-header-room-details-wrapper">
                     <h2 className="room-name">
                        <FormattedMessage
                           id="Room 1"
                           defaultMessage="Room 1"
                           description=""
                        />
                        :{" "}
                        <FormattedMessage
                           id={roomName}
                           defaultMessage={roomName.replace("_", " ")}
                           description=""
                        />
                     </h2>
                     <div className="guests-wrapper">
                        <svg
                           width="14"
                           height="14"
                           viewBox="0 0 14 14"
                           fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                           <path
                              d="M9.47333 7.47374C10.1269 6.95951 10.604 6.25436 10.8382 5.45637C11.0723 4.65838 11.0519 3.80725 10.7799 3.02139C10.5078 2.23552 9.9975 1.554 9.32005 1.07165C8.64259 0.589288 7.83163 0.330078 7 0.330078C6.16836 0.330078 5.35741 0.589288 4.67995 1.07165C4.0025 1.554 3.49223 2.23552 3.22014 3.02139C2.94805 3.80725 2.92767 4.65838 3.16184 5.45637C3.396 6.25436 3.87307 6.95951 4.52666 7.47374C3.40672 7.92244 2.42952 8.66664 1.69926 9.62702C0.968996 10.5874 0.51304 11.7279 0.379998 12.9271C0.370368 13.0146 0.378075 13.1032 0.402681 13.1878C0.427287 13.2723 0.468309 13.3512 0.523405 13.42C0.634677 13.5587 0.79652 13.6476 0.973331 13.6671C1.15014 13.6865 1.32744 13.6349 1.46621 13.5237C1.60499 13.4124 1.69388 13.2506 1.71333 13.0737C1.85972 11.7705 2.48112 10.5669 3.45881 9.69294C4.4365 8.81892 5.70193 8.33576 7.01333 8.33576C8.32473 8.33576 9.59016 8.81892 10.5679 9.69294C11.5455 10.5669 12.1669 11.7705 12.3133 13.0737C12.3315 13.2376 12.4096 13.3888 12.5327 13.4984C12.6559 13.608 12.8152 13.6681 12.98 13.6671H13.0533C13.2281 13.647 13.3878 13.5586 13.4977 13.4212C13.6076 13.2839 13.6587 13.1086 13.64 12.9337C13.5063 11.7312 13.0479 10.5877 12.3139 9.62588C11.5799 8.66402 10.5979 7.92006 9.47333 7.47374ZM7 7.00041C6.47258 7.00041 5.95701 6.84401 5.51848 6.55099C5.07995 6.25798 4.73815 5.8415 4.53632 5.35423C4.33449 4.86696 4.28168 4.33078 4.38457 3.8135C4.48746 3.29622 4.74144 2.82106 5.11438 2.44812C5.48732 2.07518 5.96247 1.82121 6.47976 1.71831C6.99704 1.61542 7.53322 1.66823 8.02049 1.87006C8.50776 2.0719 8.92423 2.41369 9.21725 2.85222C9.51027 3.29075 9.66667 3.80633 9.66667 4.33374C9.66667 5.04099 9.38571 5.71926 8.88562 6.21936C8.38552 6.71946 7.70724 7.00041 7 7.00041Z"
                              fill="#858685"
                           />
                        </svg>
                        <div className="guests-details">{guestString}</div>
                     </div>
                  </div>
                  {!booking.canceled && (
                     <button
                        className="cancel-room"
                        disabled={loading}
                        onClick={handleOpenModal}>
                        <FormattedMessage
                           id="Cancel Room"
                           defaultMessage="Cancel Room"
                           description=""
                        />
                     </button>
                  )}
               </div>
               <div className="confirmation-main-top-middle">
                  <div className="room-image">
                     <IKImage
                        urlEndpoint={urlEndpoint}
                        path={roomImage || "room-defualt.jpg"}
                        transformation={[
                           {
                              height: "300",
                              width: "400",
                           },
                        ]}
                     />
                  </div>
                  <div className="confirmation-main-top-middle-details-wrapper">
                     <div className="dates-wrapper">
                        <div className="check-in-date date-box">
                           <div className="name">
                              <FormattedMessage
                                 id="Check In"
                                 defaultMessage="Check In"
                                 description=""
                              />
                           </div>
                           <div className="date-value">
                              {formatDate(checkInDate).split(" ")[0]}
                           </div>
                           <div className="month-year-value">
                              {formatDate(checkInDate).split(" ")[1] +
                                 " " +
                                 formatDate(checkInDate).split(" ")[2]}
                           </div>
                        </div>
                        <div className="check-out-date date-box">
                           <div className="name">
                              {" "}
                              <FormattedMessage
                                 id="Check Out"
                                 defaultMessage="Check Out"
                                 description=""
                              />
                           </div>
                           <div className="date-value">
                              {formatDate(checkOutDate).split(" ")[0]}
                           </div>
                           <div className="month-year-value">
                              {formatDate(checkOutDate).split(" ")[1] +
                                 " " +
                                 formatDate(checkOutDate).split(" ")[2]}
                           </div>
                        </div>
                     </div>
                     <div className="package-details-wrapper">
                        <h3 className="package-heading">
                           {" "}
                           <FormattedMessage
                              id={packageName}
                              defaultMessage={packageName}
                              description=""
                           />
                        </h3>
                        <p className="package-description">
                           <FormattedMessage
                              id={packageDescription}
                              defaultMessage={packageDescription}
                              description=""
                           />
                        </p>
                     </div>
                     <div className="instruction-total-wrapper">
                        <p className="instruction">
                           <FormattedMessage
                              id="Copy explaining the cancellation policy, if applicable"
                              defaultMessage="Copy explaining the cancellation policy, if
                                 applicable"
                              description=""
                           />
                        </p>
                        <div className="total">
                           <FormattedNumber
                              style="currency"
                              value={
                                 nightlyRate * exchangeRate[selectedCurrency]
                              }
                              currency={selectedCurrency}
                              maximumFractionDigits={2}
                           />
                           /{" "}
                           <FormattedMessage
                              id="night total"
                              defaultMessage="night total"
                              description=""
                           />
                        </div>
                     </div>
                  </div>
               </div>
               <div className="summary-dropdowns">
                  <div className="room-total-details-dropdown">
                     <button className="room-total-details-button">
                        <UpDownArrowPair
                           open={roomTotalOpen}
                           setOpen={setRoomTotalOpen}
                        />
                        <FormattedMessage
                           id="Room total summary"
                           defaultMessage="Room total summary"
                           description=""
                        />
                     </button>
                     {roomTotalOpen && (
                        <div className="room-total-details-values">
                           <div className="room-total-details-value">
                              <div className="tag">
                                 {" "}
                                 <FormattedMessage
                                    id="Nightly rate"
                                    defaultMessage="Nightly rate"
                                    description=""
                                 />
                              </div>
                              <div className="value">
                                 <span className="big-value">
                                    <FormattedNumber
                                       style="currency"
                                       value={
                                          nightlyRate *
                                          exchangeRate[selectedCurrency]
                                       }
                                       currency={selectedCurrency}
                                       maximumFractionDigits={2}
                                    />
                                 </span>
                              </div>
                           </div>
                           <div className="room-total-details-value">
                              <div className="tag">
                                 {" "}
                                 <FormattedMessage
                                    id="Subtotal"
                                    defaultMessage="Subtotal"
                                    description=""
                                 />
                              </div>
                              <div className="value">
                                 <span className="big-value">
                                    <FormattedNumber
                                       style="currency"
                                       value={
                                          subtotal *
                                          exchangeRate[selectedCurrency]
                                       }
                                       currency={selectedCurrency}
                                       maximumFractionDigits={2}
                                    />
                                 </span>
                              </div>
                           </div>
                           <div className="room-total-details-value">
                              <div className="tag">
                                 {" "}
                                 <FormattedMessage
                                    id="Taxes"
                                    defaultMessage="Taxes"
                                    description=""
                                 />
                                 ,{" "}
                                 <FormattedMessage
                                    id="Surcharges"
                                    defaultMessage="Surcharges"
                                    description=""
                                 />
                                 ,{" "}
                                 <FormattedMessage
                                    id="Fees"
                                    defaultMessage="Fees"
                                    description=""
                                 />
                              </div>
                              <div className="value">
                                 <span className="big-value">
                                    <FormattedNumber
                                       style="currency"
                                       value={
                                          taxes * exchangeRate[selectedCurrency]
                                       }
                                       currency={selectedCurrency}
                                       maximumFractionDigits={2}
                                    />
                                 </span>
                              </div>
                           </div>
                           <div className="room-total-details-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="VAT"
                                    defaultMessage="VAT"
                                    description=""
                                 />
                              </div>
                              <div className="value">
                                 <span className="big-value">
                                    <FormattedNumber
                                       style="currency"
                                       value={
                                          vat * exchangeRate[selectedCurrency]
                                       }
                                       currency={selectedCurrency}
                                       maximumFractionDigits={2}
                                    />
                                 </span>
                              </div>
                           </div>
                           <div className="room-total-details-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="Total for stay"
                                    defaultMessage="Total for stay"
                                    description=""
                                 />
                              </div>
                              <div className="value">
                                 <span className="big-value">
                                    <FormattedNumber
                                       style="currency"
                                       value={
                                          total * exchangeRate[selectedCurrency]
                                       }
                                       currency={selectedCurrency}
                                       maximumFractionDigits={2}
                                    />
                                 </span>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
                  <div className="guest-information-dropdown">
                     <button className="guest-information-button">
                        <UpDownArrowPair
                           open={guestsOpen}
                           setOpen={setGuestsOpen}
                        />

                        <FormattedMessage
                           id="Guest Information"
                           defaultMessage="Guest Information"
                           description=""
                        />
                     </button>
                     {guestsOpen && (
                        <div className="guest-information-values">
                           <div className="guest-information-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="First Name"
                                    defaultMessage="First Name"
                                    description=""
                                 />
                              </div>
                              <div className="value">{firstName}</div>
                           </div>
                           <div className="guest-information-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="Last Name"
                                    defaultMessage="Last Name"
                                    description=""
                                 />
                              </div>
                              <div className="value">{lastName}</div>
                           </div>
                           <div className="guest-information-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="Phone"
                                    defaultMessage="Phone"
                                    description=""
                                 />
                              </div>
                              <div className="value">{phone ?? "--"}</div>
                           </div>
                           <div className="guest-information-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="Alternate Phone"
                                    defaultMessage="Alternate Phone"
                                    description=""
                                 />
                              </div>
                              <div className="value">{phone ?? "--"}</div>
                           </div>
                           <div className="guest-information-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="Email"
                                    defaultMessage="Email"
                                    description=""
                                 />
                              </div>
                              <div className="value">{email}</div>
                           </div>
                           <div className="guest-information-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="Alternate Email"
                                    defaultMessage="Alternate Email"
                                    description=""
                                 />
                              </div>
                              <div className="value">--</div>
                           </div>
                        </div>
                     )}
                  </div>
                  <div className="billing-address-dropdown">
                     <button className="billing-address-button">
                        <UpDownArrowPair
                           open={billingOpen}
                           setOpen={setBillingOpen}
                        />
                        <FormattedMessage
                           id="Billing Address"
                           defaultMessage="Billing Address"
                           description=""
                        />
                     </button>
                     {billingOpen && (
                        <div className="billing-address-values">
                           <div className="guest-information-value">
                              <div className="tag">
                                 {" "}
                                 <FormattedMessage
                                    id="First Name"
                                    defaultMessage="First Name"
                                    description=""
                                 />
                              </div>
                              <div className="value">{billingFirstName}</div>
                           </div>
                           <div className="guest-information-value">
                              <div className="tag">
                                 {" "}
                                 <FormattedMessage
                                    id="Last Name"
                                    defaultMessage="Last Name"
                                    description=""
                                 />
                              </div>
                              <div className="value">{billingLastName}</div>
                           </div>
                           <div className="guest-information-value">
                              <div className="tag">
                                 {" "}
                                 <FormattedMessage
                                    id="Mailing Address"
                                    defaultMessage="Mailing Address"
                                    description=""
                                 />
                              </div>
                              <div className="value">{billingAddress1}</div>
                           </div>
                           <div className="guest-information-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="Alternate Mailing Address"
                                    defaultMessage="Alternate Mailing Address"
                                    description=""
                                 />
                              </div>
                              <div className="value">
                                 {billingAddress2 ?? "--"}
                              </div>
                           </div>
                           <div className="guest-information-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="Country"
                                    defaultMessage="Country"
                                    description=""
                                 />
                              </div>
                              <div className="value">
                                 {billingCountry ?? "--"}
                              </div>
                           </div>
                           <div className="guest-information-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="State"
                                    defaultMessage="State"
                                    description=""
                                 />
                              </div>
                              <div className="value">
                                 {billingState ?? "--"}
                              </div>
                           </div>
                           <div className="guest-information-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="City"
                                    defaultMessage="City"
                                    description=""
                                 />
                              </div>
                              <div className="value">{billingCity ?? "--"}</div>
                           </div>
                           <div className="guest-information-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="Zip"
                                    defaultMessage="Zip"
                                    description=""
                                 />
                              </div>
                              <div className="value">{billingZip}</div>
                           </div>
                           <div className="guest-information-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="Phone"
                                    defaultMessage="Phone"
                                    description=""
                                 />
                              </div>
                              <div className="value">{billingPhone}</div>
                           </div>
                           <div className="guest-information-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="Alternate Phone"
                                    defaultMessage="Alternate Phone"
                                    description=""
                                 />
                              </div>
                              <div className="value">
                                 {billingPhone ?? "--"}
                              </div>
                           </div>
                           <div className="guest-information-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="Email"
                                    defaultMessage="Email"
                                    description=""
                                 />
                              </div>
                              <div className="value">
                                 {billingEmail ?? "--"}
                              </div>
                           </div>
                           <div className="guest-information-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="Alternate Email"
                                    defaultMessage="Alternate Email"
                                    description=""
                                 />
                              </div>
                              <div className="value">--</div>
                           </div>
                        </div>
                     )}
                  </div>
                  <div className="payment-information-dropdown">
                     <button className="payment-information-button">
                        <UpDownArrowPair
                           open={paymentOpen}
                           setOpen={setPaymentOpen}
                        />
                        <FormattedMessage
                           id="Payment Information"
                           defaultMessage="Payment Information"
                           description=""
                        />
                     </button>
                     {paymentOpen && (
                        <div className="payment-information-values">
                           <div className="guest-information-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="Card Number"
                                    defaultMessage="Card Number"
                                    description=""
                                 />
                              </div>
                              <div className="value">
                                 {maskCardNumber(cardNumber)}
                              </div>
                           </div>
                           <div className="guest-information-value">
                              <div className="tag">
                                 {" "}
                                 <FormattedMessage
                                    id="Expiry Month"
                                    defaultMessage="Expiry Month"
                                    description=""
                                 />
                              </div>
                              <div className="value">{expiryMonth}</div>
                           </div>
                           <div className="guest-information-value">
                              <div className="tag">
                                 <FormattedMessage
                                    id="Expiry Year"
                                    defaultMessage="Expiry Year"
                                    description=""
                                 />
                              </div>
                              <div className="value">{expiryYear}</div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
            <AuthenticatedTemplate>
               <dialog
                  data-modal
                  ref={cancelRoomModal}
                  className="special-room-modal-dialog"
                  style={{ margin: "auto", border: "none" }}>
                  <CancelConfirmationModal
                     onClose={closeCancelRoomModal}
                     onCancel={cancelWithOutOTP}
                  />
               </dialog>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
               <dialog
                  data-modal
                  ref={cancelRoomModal}
                  className="special-room-modal-dialog"
                  style={{ margin: "auto", border: "none" }}>
                  <CancelRoomModal
                     onClose={closeCancelRoomModal}
                     onCancel={cancelViaOtp}
                     handleSendOtp={async () => {
                        if (!isAuthenticated) {
                           await sendOtpEmail(
                              billingEmail,
                              firstName + " " + lastName,
                              "Team 12 Hotels",
                              parseInt(bookingId!)
                           );
                        }
                     }}
                  />
               </dialog>
            </UnauthenticatedTemplate>
            {showSnackbar && (
               <SnackbarComponent
                  content={"OTP SEND SUCCESSFULLY To " + billingEmail}
                  type="success"
               />
            )}
            {showEmailSnackbar && (
               <SnackbarComponent
                  content={"Confirmation email sent on " + billingEmail}
                  type="success"
               />
            )}
             {showErrorSnack && error && (
               <SnackbarComponent content={error} type="error" />
            )}
         </main>
         <div className="footer">
            <Footer />
         </div>
      </div>
   );
}
