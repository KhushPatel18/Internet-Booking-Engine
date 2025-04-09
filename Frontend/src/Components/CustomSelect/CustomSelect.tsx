import React, { useEffect, useRef, useState } from "react";
import "./CustomSelect.scss";
import { Option } from "../../Types/LandingPage";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useMediaQuery } from "usehooks-ts";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { FormattedMessage } from "react-intl";

interface CustomSelectProps {
   options: Option[];
   name: string;
   isRoomResult?: boolean;
   setter:
      | ActionCreatorWithPayload<
           number,
           "LandingPageConfigurations/setSelectedRoom"
        >
      | ActionCreatorWithPayload<
           number,
           "LandingPageConfigurations/setSelectedBeds"
        >;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
   options,
   name,
   isRoomResult,
   setter,
}) => {
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
   const isMobile = useMediaQuery("(max-width : 1023px)");
   const reduxDispatch = useAppDispatch();

   const handleOptionClick = (value: number) => {
      reduxDispatch(setter(value));
      setIsOpen(false);
   };

   let selectedRoom = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.filterStates.selectedRooms
   );
   let selectedBed = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.filterStates.selectedBed
   );
   return (
      <div className="dropdown" ref={dropdownRef}>
         <div
            className="dropdown-button"
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
            <div
               style={
                  isRoomResult && isMobile
                     ? {
                          display: "flex",
                          justifyContent: "space-between",
                          width: "80%",
                       }
                     : undefined
               }>
               {isRoomResult && (
                  <div
                     style={{
                        color: "rgba(133, 134, 133, 1)",
                        fontSize: "1rem",
                        marginBottom: "5px",
                     }}>
                     <FormattedMessage
                        id={name}
                        defaultMessage=""
                        description=""
                     />
                  </div>
               )}
               <span
                  className="dropdown-value"
                  style={
                     isRoomResult
                        ? {
                             fontWeight: "700",
                          }
                        : undefined
                  }>
                  {name === "rooms" ? selectedRoom : selectedBed}
               </span>
            </div>
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
               className="single-dropdown-content"
               style={
                  isRoomResult
                     ? { width: "100%", left: "0px", top: "45px", zIndex: 1 }
                     : undefined
               }>
               {options.map((option) => (
                  <div
                     key={option.value}
                     className="option"
                     onClick={() => handleOptionClick(parseInt(option.value))}>
                     <span>{option.value}</span>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};
