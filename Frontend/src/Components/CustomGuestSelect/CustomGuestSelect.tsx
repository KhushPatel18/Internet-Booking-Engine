import React, { useEffect, useRef, useState } from "react";
import "./CustomGuestSelect.scss";
import { useAppSelector } from "../../redux/store";
import { GuestItem } from "../GuestItem/GuestItem";
import { useMediaQuery } from "usehooks-ts";
import { FormattedMessage } from "react-intl";
import { changeToSpanish } from "../../Util/LanguageUtil";

interface CustomGuestSelectProps {
   isRoomResult?: boolean;
}

export const CustomGuestSelect: React.FC<CustomGuestSelectProps> = ({
   isRoomResult,
}) => {
   const options = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.currentConfig.allowedGuests
   );
   const selectedOptions = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.filterStates.selectedGuests
   );
   const selectedLanguage = useAppSelector(
      (state) => state.LanguageReducer.selectedLanguage
   );

   const isMobile = useMediaQuery("(max-width : 1023px)");
   const dropdownRef = useRef<HTMLDivElement | null>(null);
   const [isOpen, setIsOpen] = useState(false);
   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
         ) {
            setIsOpen(false);
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
      <div className="dropdown" ref={dropdownRef}>
         <div
            className="dropdown-button-guest-select"
            onClick={() => setIsOpen(!isOpen)}
            style={
               isRoomResult
                  ? {
                       display: "flex",
                       justifyContent: "space-between",
                       alignItems: "center",
                    }
                  : undefined
            }>
            {Object.keys(selectedOptions).length > 0 ? (
               <div
                  style={
                     isRoomResult && isMobile
                        ? {
                             display: "flex",
                             justifyContent: "space-between",
                             width: "90%",
                             minWidth: "280px",
                          }
                        : undefined
                  }>
                  {isRoomResult && (
                     <div
                        style={{
                           color: "rgba(133, 134, 133, 1)",
                           fontSize: "1rem",
                           marginBottom: "3px",
                        }}>
                        <FormattedMessage
                           id="Guests"
                           defaultMessage=""
                           description=""
                        />
                     </div>
                  )}
                  <div
                     className="dropdown-value"
                     style={
                        isRoomResult
                           ? { fontWeight: "700", fontSize: "16px" }
                           : undefined
                     }>
                     {Object.keys(selectedOptions)
                        .map((key) => {
                           const value = selectedOptions[key];
                           const label: string = changeToSpanish(
                              selectedLanguage.value,
                              key
                           );
                           if (value > 1) {
                              return `${label} - ${value}`;
                           } else if (value == 1) {
                              return `${label.substring(
                                 0,
                                 label.length - 1
                              )} - ${value}`;
                           } else {
                              return "";
                           }
                        })
                        .filter(Boolean)
                        .join(", ")}
                  </div>
               </div>
            ) : (
               !isRoomResult && <div className="dropdown-value">Guests</div>
            )}
            {!isOpen ? (
               <svg
                  width={isRoomResult ? "32" : "16"}
                  height={isRoomResult ? "32" : "16"}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                     fillRule="evenodd"
                     clipRule="evenodd"
                     d="M12.7803 6.21967C13.0732 6.51256 13.0732 6.98744 12.7803 7.28033L8.53033 11.5303C8.23744 11.8232 7.76256 11.8232 7.46967 11.5303L3.21967 7.28033C2.92678 6.98744 2.92678 6.51256 3.21967 6.21967C3.51256 5.92678 3.98744 5.92678 4.28033 6.21967L8 9.93934L11.7197 6.21967C12.0126 5.92678 12.4874 5.92678 12.7803 6.21967Z"
                     fill="#24292E"
                  />
               </svg>
            ) : (
               <svg
                  width={isRoomResult ? "32" : "16"}
                  height={isRoomResult ? "32" : "16"}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M18 15L12 9L6 15"
                     stroke="#24292E"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
            )}
         </div>
         {isOpen && (
            <div
               className="double-dropdown-content"
               style={
                  isRoomResult
                     ? {
                          width: "102%",
                          left: "0px",
                          top: "45px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                       }
                     : undefined
               }>
               {options.map((option) => (
                  <div
                     key={option.name}
                     className="option"
                     style={
                        isRoomResult
                           ? {
                                width: "100%",
                                margin: "auto",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                             }
                           : undefined
                     }>
                     {option.isActive && (
                        <GuestItem
                           name={option.name}
                           ages={option.ages}
                           count={selectedOptions[option.name]}
                           isRoomResult={isMobile && isRoomResult}
                        />
                     )}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};
