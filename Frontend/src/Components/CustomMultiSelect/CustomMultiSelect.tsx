import React, { useEffect, useRef, useState } from "react";
import "./CustomMultiSelect.scss";
import { FormattedMessage } from "react-intl";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { setSelectedProperty } from "../../redux/LandingPageConfigSlice/LandingPageConfigSlice";

interface CustomMultiSelectProps {
   options: string[];
}

export const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
   options,
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

   const selectedOption = useAppSelector(
      (state) =>
         state.LandingPageConfigSliceReducer.filterStates.selectedProperty
   );
   const reduxDispath = useAppDispatch();

   const handleOptionClick = (option: string) => {
      reduxDispath(setSelectedProperty(option));
      setIsOpen(false);
   };

   return (
      <div className="dropdown" ref={dropdownRef}>
         <div className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
            {selectedOption !== "" ? (
               <div>
                  <span className="dropdown-value">{selectedOption}</span>
               </div>
            ) : (
               <div
                  className="placeholder-text"
                  style={isOpen ? { color: "#2f2f2f" } : { color: "#C1C2C2" }}>
                  <FormattedMessage
                     id="properties-placeholder"
                     defaultMessage=""
                     description=""
                  />
               </div>
            )}
            <svg
               width="16"
               height="16"
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
         </div>
         {isOpen && (
            <div className="dropdown-content">
               {options.map((option) => (
                  <div
                     key={option}
                     className="option"
                     id={option}
                     onClick={() => handleOptionClick(option)}>
                     <span>{option}</span>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};
