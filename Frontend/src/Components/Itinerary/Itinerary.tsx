import { Link } from "react-router-dom";
import "./itinerary.scss";
import { useEffect, useRef, useState } from "react";
import { SpecialDealModal } from "../SpecialDealModal/SpecialDealModal";
import { TaxBreakDownModal } from "../TaxeBreakDownModal/TaxeBreakDownModal";
import { useMediaQuery } from "usehooks-ts";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
   setShowItinerary,
   setTimeLeft,
} from "../../redux/ItinerarySlice/ItinerarySlice";
import { FormattedNumber } from "react-intl";
import { changeToSpanish } from "../../Util/LanguageUtil";
import { FormattedMessage } from "react-intl";
export function Itinerary() {
   const specialModalRef = useRef<HTMLDialogElement | null>(null);
   const closeSpecialModal = () => {
      if (specialModalRef.current) {
         specialModalRef.current.close();
      }
   };
   const taxesModalRef = useRef<HTMLDialogElement | null>(null);
   const closeTexesModal = () => {
      if (taxesModalRef.current) {
         taxesModalRef.current.close();
      }
   };
   const exchangeRate = useAppSelector(
      (state) => state.LanguageReducer.exchangeRate
   );
   const selectedCurrency = useAppSelector(
      (state) => state.LanguageReducer.selectedCurrency
   );
   const isMobail = useMediaQuery("(max-width :  768px)");
   const itirnaryDetails = useAppSelector(
      (state) => state.ItinerarySlice.itineraryDetails
   );
   console.log(itirnaryDetails);
   const buttonType = useAppSelector(
      (state) => state.ItinerarySlice.buttonType
   );
   const { vat, dueNow, occupancyTax, resortFee } = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.currentConfig
   );
   const dispatch = useAppDispatch();
   const [open, setOpen] = useState(!isMobail);
   const queryString = window.localStorage.getItem("prevSearch");

   const timeLeft = useAppSelector((state) => state.ItinerarySlice.timeLeft);
   const timeLeftRef = useRef<number>(timeLeft);

   useEffect(() => {
      const timerId = setInterval(() => {
         if (timeLeftRef.current == 0) {
            window.location.href = "/";
         } else {
            timeLeftRef.current -= 1;
            dispatch(setTimeLeft(timeLeftRef.current));
         }
      }, 1000);
      return () => clearInterval(timerId);
   }, []);
   const selectedLanguage = useAppSelector(
      (state) => state.LanguageReducer.selectedLanguage
   );
   return (
      <div className="itinerary-container">
         <h2
            className="itinerary-title"
            style={open ? { marginBottom: "14px" } : { marginBottom: "0" }}>
            <FormattedMessage
               id="itinary-heading"
               defaultMessage=""
               description="Your Trip Itinary"
            />
         </h2>
         <div className="dropdown-buttons">
            {isMobail && !open && (
               <svg
                  onClick={() => setOpen(true)}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M6 9L12 15L18 9"
                     stroke="#5D5D5D"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
            )}
            {isMobail && open && (
               <svg
                  onClick={() => setOpen(false)}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M18 15L12 9L6 15"
                     stroke="#5D5D5D"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
            )}
         </div>
         {open && (
            <>
               <div className="resort-name-remove">
                  <div className="itinerary-resort-name">
                     {changeToSpanish(
                        selectedLanguage.value,
                        itirnaryDetails.propertyName
                     )}
                  </div>
                  <button
                     className="itinerary-remove-btn"
                     onClick={() => {
                        dispatch(
                           setShowItinerary({
                              show: false,
                              type: "Checkout",
                           })
                        );
                        window.location.href = `/rooms${queryString}`;
                     }}>
                     <FormattedMessage
                        id="itinary-remove"
                        defaultMessage=""
                        description=""
                     />
                  </button>
               </div>
               <div className="itinerary-date-guest-itirnaryDetails">
                  {`${itirnaryDetails.stayString} | ${itirnaryDetails.guestString}`}
               </div>
               <div className="itinerary-room-itirnaryDetails">
                  <div className="itinerary-room-type">
                     {" "}
                     <FormattedMessage
                        id={itirnaryDetails.roomName.replace("_", " ")}
                        defaultMessage=""
                        description=""
                     />
                  </div>
                  <div className="itinerary-room-no">
                     {" "}
                     {itirnaryDetails.noOfRooms}{" "}
                     <FormattedMessage
                        id="itinary-room"
                        defaultMessage=""
                        description=""
                     />
                  </div>
               </div>
               {Object.keys(itirnaryDetails.dateWisePrices).map((key) => {
                  const date = new Date(key);
                  if (isNaN(date.getTime())) {
                     return null; // Skip rendering for invalid dates
                  }
                  const formattedDate = (
                     <FormattedMessage
                        id="formatted-date"
                        defaultMessage="{day}, {month} {date}"
                        values={{
                           day: new Intl.DateTimeFormat(
                              selectedLanguage.value,
                              {
                                 weekday: "long",
                              }
                           ).format(date),
                           month: new Intl.DateTimeFormat(
                              selectedLanguage.value,
                              {
                                 month: "long",
                              }
                           ).format(date),
                           date: new Intl.DateTimeFormat(
                              selectedLanguage.value,
                              {
                                 day: "numeric",
                              }
                           ).format(date),
                        }}
                     />
                  );

                  return (
                     <div className="itinerary-date-price-wrapper" key={key}>
                        <div className="itinerary-date">{formattedDate}</div>
                        <div className="itinerary-price">
                           <FormattedNumber
                              style="currency"
                              value={
                                 itirnaryDetails.dateWisePrices[key] *
                                 exchangeRate[selectedCurrency]
                              }
                              currency={selectedCurrency}
                              maximumFractionDigits={0}
                           />
                        </div>
                     </div>
                  );
               })}
               <div className="special-promotions-price-wrapper">
                  <div className="special-promotions-info">
                     <div className="itinerary-special-promotions-name">
                        <FormattedMessage
                           id={itirnaryDetails.specialPromoName}
                           defaultMessage={itirnaryDetails.specialPromoName}
                           description=""
                        />
                     </div>
                     <svg
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                           if (specialModalRef.current) {
                              specialModalRef.current.showModal();
                           }
                        }}
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                           d="M7.00017 6.33301C6.82336 6.33301 6.65379 6.40325 6.52876 6.52827C6.40374 6.65329 6.3335 6.82286 6.3335 6.99967V9.66634C6.3335 9.84315 6.40374 10.0127 6.52876 10.1377C6.65379 10.2628 6.82336 10.333 7.00017 10.333C7.17698 10.333 7.34655 10.2628 7.47157 10.1377C7.59659 10.0127 7.66683 9.84315 7.66683 9.66634V6.99967C7.66683 6.82286 7.59659 6.65329 7.47157 6.52827C7.34655 6.40325 7.17698 6.33301 7.00017 6.33301ZM7.2535 3.71967C7.09119 3.653 6.90914 3.653 6.74683 3.71967C6.665 3.7514 6.59024 3.79898 6.52683 3.85967C6.46795 3.92448 6.42059 3.99888 6.38683 4.07967C6.34951 4.15879 6.33125 4.24556 6.3335 4.33301C6.33299 4.42075 6.34981 4.50772 6.38299 4.58895C6.41616 4.67017 6.46504 4.74405 6.52683 4.80634C6.59163 4.86523 6.66604 4.91258 6.74683 4.94634C6.84783 4.98783 6.95748 5.00389 7.06613 4.99308C7.17479 4.98228 7.27912 4.94496 7.36997 4.88439C7.46083 4.82382 7.53541 4.74186 7.58717 4.64572C7.63893 4.54958 7.66629 4.4422 7.66683 4.33301C7.66438 4.1565 7.59532 3.98743 7.4735 3.85967C7.4101 3.79898 7.33533 3.7514 7.2535 3.71967ZM7.00017 0.333008C5.68162 0.333008 4.39269 0.724001 3.29636 1.45654C2.20004 2.18909 1.34555 3.23028 0.840969 4.44845C0.336385 5.66663 0.204362 7.00707 0.461597 8.30028C0.718832 9.59348 1.35377 10.7814 2.28612 11.7137C3.21847 12.6461 4.40636 13.281 5.69956 13.5382C6.99277 13.7955 8.33322 13.6635 9.55139 13.1589C10.7696 12.6543 11.8108 11.7998 12.5433 10.7035C13.2758 9.60715 13.6668 8.31822 13.6668 6.99967C13.6668 6.1242 13.4944 5.25729 13.1594 4.44845C12.8243 3.63961 12.3333 2.90469 11.7142 2.28563C11.0952 1.66657 10.3602 1.17551 9.55139 0.840478C8.74255 0.505446 7.87565 0.333008 7.00017 0.333008ZM7.00017 12.333C5.94533 12.333 4.91419 12.0202 4.03712 11.4342C3.16006 10.8481 2.47648 10.0152 2.07281 9.04065C1.66914 8.06611 1.56352 6.99376 1.76931 5.95919C1.9751 4.92463 2.48305 3.97432 3.22893 3.22844C3.97481 2.48256 4.92512 1.97461 5.95968 1.76882C6.99425 1.56303 8.06661 1.66865 9.04114 2.07232C10.0157 2.47598 10.8486 3.15957 11.4347 4.03663C12.0207 4.9137 12.3335 5.94484 12.3335 6.99967C12.3335 8.41416 11.7716 9.77072 10.7714 10.7709C9.77121 11.7711 8.41465 12.333 7.00017 12.333Z"
                           fill="#858685"
                        />
                     </svg>
                  </div>
                  <div className="itinerary-special-promotions-price">
                     <FormattedNumber
                        style="currency"
                        value={
                           itirnaryDetails.promoPrice *
                           exchangeRate[selectedCurrency]
                        }
                        currency={selectedCurrency}
                        maximumFractionDigits={0}
                     />
                  </div>
               </div>
               <div className="border-line"></div>
               <div className="itinerary-total-taxes-section">
                  <div className="itinerary-total-title-price">
                     <div className="itinerary-total-title">
                        {" "}
                        <FormattedMessage
                           id="itinary-subtotal"
                           defaultMessage=""
                           description=""
                        />
                     </div>
                     <div className="itinerary-total-price">
                        <FormattedNumber
                           style="currency"
                           value={
                              itirnaryDetails.subtotal *
                              exchangeRate[selectedCurrency]
                           }
                           currency={selectedCurrency}
                           maximumFractionDigits={0}
                        />
                     </div>
                  </div>
                  <div className="special-promotions-price-wrapper">
                     <div className="special-promotions-info">
                        <div className="itinerary-special-promotions-name">
                           <FormattedMessage
                              id="itinary-taxes"
                              defaultMessage=""
                              description=""
                           />
                        </div>
                        <svg
                           style={{ cursor: "pointer" }}
                           onClick={() => {
                              if (taxesModalRef.current) {
                                 taxesModalRef.current.showModal();
                              }
                           }}
                           width="14"
                           height="14"
                           viewBox="0 0 14 14"
                           fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                           <path
                              d="M7.00017 6.33301C6.82336 6.33301 6.65379 6.40325 6.52876 6.52827C6.40374 6.65329 6.3335 6.82286 6.3335 6.99967V9.66634C6.3335 9.84315 6.40374 10.0127 6.52876 10.1377C6.65379 10.2628 6.82336 10.333 7.00017 10.333C7.17698 10.333 7.34655 10.2628 7.47157 10.1377C7.59659 10.0127 7.66683 9.84315 7.66683 9.66634V6.99967C7.66683 6.82286 7.59659 6.65329 7.47157 6.52827C7.34655 6.40325 7.17698 6.33301 7.00017 6.33301ZM7.2535 3.71967C7.09119 3.653 6.90914 3.653 6.74683 3.71967C6.665 3.7514 6.59024 3.79898 6.52683 3.85967C6.46795 3.92448 6.42059 3.99888 6.38683 4.07967C6.34951 4.15879 6.33125 4.24556 6.3335 4.33301C6.33299 4.42075 6.34981 4.50772 6.38299 4.58895C6.41616 4.67017 6.46504 4.74405 6.52683 4.80634C6.59163 4.86523 6.66604 4.91258 6.74683 4.94634C6.84783 4.98783 6.95748 5.00389 7.06613 4.99308C7.17479 4.98228 7.27912 4.94496 7.36997 4.88439C7.46083 4.82382 7.53541 4.74186 7.58717 4.64572C7.63893 4.54958 7.66629 4.4422 7.66683 4.33301C7.66438 4.1565 7.59532 3.98743 7.4735 3.85967C7.4101 3.79898 7.33533 3.7514 7.2535 3.71967ZM7.00017 0.333008C5.68162 0.333008 4.39269 0.724001 3.29636 1.45654C2.20004 2.18909 1.34555 3.23028 0.840969 4.44845C0.336385 5.66663 0.204362 7.00707 0.461597 8.30028C0.718832 9.59348 1.35377 10.7814 2.28612 11.7137C3.21847 12.6461 4.40636 13.281 5.69956 13.5382C6.99277 13.7955 8.33322 13.6635 9.55139 13.1589C10.7696 12.6543 11.8108 11.7998 12.5433 10.7035C13.2758 9.60715 13.6668 8.31822 13.6668 6.99967C13.6668 6.1242 13.4944 5.25729 13.1594 4.44845C12.8243 3.63961 12.3333 2.90469 11.7142 2.28563C11.0952 1.66657 10.3602 1.17551 9.55139 0.840478C8.74255 0.505446 7.87565 0.333008 7.00017 0.333008ZM7.00017 12.333C5.94533 12.333 4.91419 12.0202 4.03712 11.4342C3.16006 10.8481 2.47648 10.0152 2.07281 9.04065C1.66914 8.06611 1.56352 6.99376 1.76931 5.95919C1.9751 4.92463 2.48305 3.97432 3.22893 3.22844C3.97481 2.48256 4.92512 1.97461 5.95968 1.76882C6.99425 1.56303 8.06661 1.66865 9.04114 2.07232C10.0157 2.47598 10.8486 3.15957 11.4347 4.03663C12.0207 4.9137 12.3335 5.94484 12.3335 6.99967C12.3335 8.41416 11.7716 9.77072 10.7714 10.7709C9.77121 11.7711 8.41465 12.333 7.00017 12.333Z"
                              fill="#858685"
                           />
                        </svg>
                     </div>
                     <div className="itinerary-special-promotions-price">
                        <FormattedNumber
                           style="currency"
                           value={
                              Math.ceil(
                                 itirnaryDetails.subtotal *
                                    (occupancyTax + resortFee)
                              ) * exchangeRate[selectedCurrency]
                           }
                           currency={selectedCurrency}
                           maximumFractionDigits={0}
                        />
                     </div>
                  </div>
                  <div className="itinerary-total-title-price">
                     <div className="itinerary-total-title">
                        {" "}
                        <FormattedMessage
                           id="itinary-vat"
                           defaultMessage=""
                           description=""
                        />
                     </div>
                     <div className="itinerary-total-price">
                        <FormattedNumber
                           style="currency"
                           value={
                              Math.ceil(itirnaryDetails.subtotal * vat) *
                              exchangeRate[selectedCurrency]
                           }
                           currency={selectedCurrency}
                           maximumFractionDigits={0}
                        />
                     </div>
                  </div>
               </div>
               <div className="border-line"></div>
               <div className="itinerary-due-section">
                  <div className="itinerary-total-title-price">
                     <div className="itinerary-total-title">
                        {" "}
                        <FormattedMessage
                           id="itinary-dueNow"
                           defaultMessage=""
                           description=""
                        />
                     </div>
                     <div className="itinerary-total-price">
                        <FormattedNumber
                           style="currency"
                           value={
                              Math.ceil(
                                 (itirnaryDetails.subtotal +
                                    itirnaryDetails.subtotal *
                                       (vat + occupancyTax + resortFee)) *
                                    dueNow
                              ) * exchangeRate[selectedCurrency]
                           }
                           currency={selectedCurrency}
                           maximumFractionDigits={0}
                        />
                     </div>
                  </div>
                  <div className="itinerary-total-title-price">
                     <div className="itinerary-total-title">
                        {" "}
                        <FormattedMessage
                           id="itinary-dueResort"
                           defaultMessage=""
                           description=""
                        />
                     </div>
                     <div className="itinerary-total-price">
                        <FormattedNumber
                           style="currency"
                           value={
                              Math.ceil(
                                 (itirnaryDetails.subtotal +
                                    itirnaryDetails.subtotal *
                                       (vat + occupancyTax + resortFee)) *
                                    (1 - dueNow)
                              ) * exchangeRate[selectedCurrency]
                           }
                           currency={selectedCurrency}
                           maximumFractionDigits={0}
                        />
                     </div>
                  </div>
               </div>
               <div className="itinerary-checkout-btn">
                  {buttonType === "Checkout" ? (
                     <Link
                        to={`/checkout?iternaryId=${itirnaryDetails.iternaryId}`}
                        onClick={() => {
                           dispatch(
                              setShowItinerary({
                                 show: true,
                                 type: "Continue Shopping",
                              })
                           );
                        }}>
                        <FormattedMessage
                           id="Itinary-checkout"
                           defaultMessage=""
                           description=""
                        />
                     </Link>
                  ) : (
                     <Link
                        to={`/rooms${queryString}`}
                        onClick={() => {
                           dispatch(
                              setShowItinerary({
                                 show: true,
                                 type: "Checkout",
                              })
                           );
                        }}>
                        <FormattedMessage
                           id="itinary-continueShopping"
                           defaultMessage=""
                           description=""
                        />
                     </Link>
                  )}
               </div>
            </>
         )}
         <dialog
            data-modal
            ref={specialModalRef}
            className="special-room-modal-dialog"
            style={{ margin: "auto", border: "none" }}>
            <SpecialDealModal
               onClose={closeSpecialModal}
               promoname={itirnaryDetails.specialPromoName}
               promoDescription={itirnaryDetails.specialPromoDescription}
               packageTotal={
                  itirnaryDetails.subtotal +
                  itirnaryDetails.subtotal * (vat + occupancyTax + resortFee)
               }
            />
         </dialog>
         <dialog
            data-modal
            ref={taxesModalRef}
            className="taxes-modal-dialog"
            style={{ margin: "auto", border: "none" }}>
            <TaxBreakDownModal
               onClose={closeTexesModal}
               details={itirnaryDetails}
            />
         </dialog>
      </div>
   );
}
