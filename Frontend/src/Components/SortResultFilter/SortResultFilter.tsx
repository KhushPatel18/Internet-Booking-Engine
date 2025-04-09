import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { setSelectedSortFilter } from "../../redux/LandingPageConfigSlice/LandingPageConfigSlice";
import "./SortResultFilter.scss";
import { FormattedMessage } from "react-intl";
export function SortResultFilter({
   filterDispatcher,
}: {
   filterDispatcher: () => void;
}) {
   const [open, setOpen] = useState(false);
   const selectedOption = useAppSelector(
      (state) =>
         state.LandingPageConfigSliceReducer.filterStates.selectedSortFilter
   );
   const givenChoices = useAppSelector(
      (state) =>
         state.LandingPageConfigSliceReducer.currentConfig.sortingFilters
   );
   const options: string[] = [];
   givenChoices.forEach((givenChoice) => {
      options.push(givenChoice.field + " in " + "DESC");
      if (givenChoice.both) {
         options.push(givenChoice.field + " in " + "ASC");
      }
   });

   const dropdownRef = useRef<HTMLDivElement | null>(null);
   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
         ) {
            setOpen(false);
         }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);

      // Unbind the event listener on component unmount
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [dropdownRef]);
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
   }, [selectedOption]);
   return (
      <div className="dropdown" ref={dropdownRef}>
         <div className="dropdown-button">
            <span
               className="dropdown-value"
               style={{
                  fontWeight: "700",
                  marginRight: "5px",
                  minWidth: "70px",
               }}>
               <FormattedMessage
                  id={selectedOption}
                  defaultMessage=""
                  description=""
               />
            </span>
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
            <div
               className="single-dropdown-content"
               style={{ width: "137px", right: "20px", zIndex: 1 }}>
               {options.map((option) => (
                  <button
                     key={option}
                     className="option"
                     onClick={() => {
                        reduxDispatch(setSelectedSortFilter(option));
                        setOpen(false);
                     }}
                     style={{ border: "none" }}>
                     <FormattedMessage
                        id={option}
                        defaultMessage=""
                        description=""
                     />
                  </button>
               ))}
            </div>
         )}
      </div>
   );
}
