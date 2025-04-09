import { FormattedNumber } from "react-intl";
import { useAppSelector } from "../../redux/store";
import "./SpecialDealModal.scss";
import { useEffect, useRef } from "react";
export function SpecialDealModal({
   onClose,
   promoname,
   promoDescription,
   packageTotal,
}: {
   onClose: () => void;
   promoname: string;
   promoDescription: string;
   packageTotal: number;
}) {
   const exchangeRate = useAppSelector(
      (state) => state.LanguageReducer.exchangeRate
   );
   const selectedCurrency = useAppSelector(
      (state) => state.LanguageReducer.selectedCurrency
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
      <div className="special-deal-modal-container" ref={dropdownRef}>
         <button className="special-deal-close-modal" onClick={onClose}>
            X
         </button>
         <h1 className="special-deal-modal-title">{promoname}</h1>
         <p className="special-deal-modal-description">{promoDescription}</p>
         <div className="special-deal-modal-bottom">
            <div className="package-total">Package Total</div>
            <div className="total">
               <FormattedNumber
                  style="currency"
                  value={packageTotal * exchangeRate[selectedCurrency]}
                  currency={selectedCurrency}
                  maximumFractionDigits={0}
               />
            </div>
         </div>
      </div>
   );
}
