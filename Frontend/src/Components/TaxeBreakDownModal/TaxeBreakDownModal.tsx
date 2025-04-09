import { FormattedNumber } from "react-intl";
import { useAppSelector } from "../../redux/store";
import "./TaxeBreakDownModal.scss";
import { ItineraryDetails } from "../../redux/ItinerarySlice/ItinerarySlice";
import { getFormattedDate } from "../../Util/CalenderUtils";
import { useEffect, useRef } from "react";
export function TaxBreakDownModal({
   onClose,
   details,
}: {
   onClose: () => void;
   details: ItineraryDetails;
}) {
   const exchangeRate = useAppSelector(
      (state) => state.LanguageReducer.exchangeRate
   );
   const selectedCurrency = useAppSelector(
      (state) => state.LanguageReducer.selectedCurrency
   );
   const { dueNow, occupancyTax, resortFee } = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.currentConfig
   );

   const dropdownRef = useRef<HTMLDivElement | null>(null);
   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
         ) {
            onClose();
         }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);

      // Unbind the event listener on component unmount
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [dropdownRef]);

   return (
      <div className="tax-break-down-modal-container" ref={dropdownRef}>
         <button className="special-deal-close-modal" onClick={onClose}>
            X
         </button>
         <h1 className="tax-break-down-modal-title">Rate Breakdown</h1>
         <p className="tax-break-down-modal-room-type">
            {details.roomName.replace("_", " ")}
         </p>
         <p className="nightly-rate-per-room">
            <FormattedNumber
               style="currency"
               value={
                  details.avgPrice *
                  details.noOfRooms *
                  exchangeRate[selectedCurrency]
               }
               currency={selectedCurrency}
               maximumFractionDigits={0}
            />
            {" (per room)"}
         </p>
         <p className="promotion-title">{details.specialPromoName}</p>
         {Object.keys(details.dateWisePrices).map((key) => {
            const date = new Date(key);
            if (isNaN(date.getTime())) {
               return null; // Skip rendering for invalid dates
            }
            const formattedDate = getFormattedDate(date);
            return (
               <div className="day-price-wrapper" key={key}>
                  <div className="day">{formattedDate}</div>
                  <div className="modal-price">
                     <FormattedNumber
                        style="currency"
                        value={
                           details.dateWisePrices[key] *
                           exchangeRate[selectedCurrency]
                        }
                        currency={selectedCurrency}
                        maximumFractionDigits={0}
                     />
                  </div>
               </div>
            );
         })}
         <div className="day-price-wrapper room-total-modal">
            <div className="day">Room Total</div>
            <div className="modal-price">
               <FormattedNumber
                  style="currency"
                  value={details.subtotal * exchangeRate[selectedCurrency]}
                  currency={selectedCurrency}
                  maximumFractionDigits={0}
               />
            </div>
         </div>
         <div className="line-brake" />
         <div className="modal-texes">{"Taxes and fees (per room)"}</div>
         <div className="day-price-wrapper">
            <div className="day">Resort fee</div>
            <div className="modal-price">
               <FormattedNumber
                  style="currency"
                  value={
                     Math.ceil(details.subtotal * resortFee) *
                     exchangeRate[selectedCurrency]
                  }
                  currency={selectedCurrency}
                  maximumFractionDigits={0}
               />
            </div>
         </div>
         <div className="day-price-wrapper">
            <div className="day">Occupancy tax</div>
            <div className="modal-price">
               <FormattedNumber
                  style="currency"
                  value={
                     Math.ceil(details.subtotal * occupancyTax) *
                     exchangeRate[selectedCurrency]
                  }
                  currency={selectedCurrency}
                  maximumFractionDigits={0}
               />
            </div>
         </div>
         <div className="line-brake" />
         <div className="day-price-wrapper">
            <div className="day">Due now</div>
            <div className="modal-price">
               <FormattedNumber
                  style="currency"
                  value={
                     Math.ceil(
                        (details.subtotal +
                           details.subtotal * (occupancyTax + resortFee)) *
                           dueNow
                     ) * exchangeRate[selectedCurrency]
                  }
                  currency={selectedCurrency}
                  maximumFractionDigits={0}
               />
            </div>
         </div>
         <div className="day-price-wrapper">
            <div className="day">Due at resort</div>
            <div className="modal-price">
               <FormattedNumber
                  style="currency"
                  value={
                     Math.ceil(
                        (details.subtotal +
                           details.subtotal * (occupancyTax + resortFee)) *
                           (1 - dueNow)
                     ) * exchangeRate[selectedCurrency]
                  }
                  currency={selectedCurrency}
                  maximumFractionDigits={0}
               />
            </div>
         </div>
      </div>
   );
}
