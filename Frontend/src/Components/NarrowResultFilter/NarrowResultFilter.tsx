import { useEffect, useState } from "react";
import "./NarrowResultFilter.scss";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
   addNarrowResultFilter,
   removeNarrowResultFilter,
} from "../../redux/LandingPageConfigSlice/LandingPageConfigSlice";
import { FormattedMessage } from "react-intl";

interface NarrowResultFilterProps {
   name: string;
   options: string[];
   filterDispatcher: () => void;
}
export function NarrowResultFilter({
   name,
   options,
   filterDispatcher,
}: NarrowResultFilterProps) {
   const [open, setOpen] = useState(false);
   const selectedOptions = useAppSelector(
      (state) =>
         state.LandingPageConfigSliceReducer.filterStates
            .narrowResultFiltersState[name]
   );
   const [firstTime, setFirstTime] = useState(true);
   const reduxDispatch = useAppDispatch();
   useEffect(() => {
      if (!firstTime) {
         console.log("called first time");
         filterDispatcher();
      } else {
         console.log("called second time");
         setFirstTime(false);
      }
   }, [selectedOptions]);
   return (
      <div className="narrow-result-filter-container">
         <div className="narrow-result-filter-button">
            <div className="narrow-result-filter-value">
               {" "}
               <FormattedMessage id={name} defaultMessage="" description="" />
            </div>
            {!open && (
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
            {open && (
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
            <div className="narrow-result-filter-options">
               {options.map((option) => (
                  <div className="narrow-result-filter-option" key={option}>
                     <input
                        type="checkbox"
                        name={option}
                        id=""
                        checked={selectedOptions.includes(option)}
                        onChange={(e) => {
                           if (e.target.checked) {
                              reduxDispatch(
                                 addNarrowResultFilter({
                                    filterName: name,
                                    value: option,
                                 })
                              );
                           } else {
                              reduxDispatch(
                                 removeNarrowResultFilter({
                                    filterName: name,
                                    value: option,
                                 })
                              );
                           }
                        }}
                     />
                     <div className="option-value">
                        <FormattedMessage
                           id={option}
                           defaultMessage=""
                           description=""
                        />
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
