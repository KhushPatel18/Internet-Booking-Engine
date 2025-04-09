import { useMediaQuery } from "@mui/material";
import { NarrowResultFilter } from "../NarrowResultFilter/NarrowResultFilter";
import "./NarrowResult.scss";
import { useEffect, useState } from "react";
import { NarrowRoomResultPageFilter } from "../../redux/LandingPageConfigSlice/LandingPageConfigSlice";
import { FormattedMessage } from "react-intl";
export function NarrowResult({narrowFilters,filterDispatcher} : {narrowFilters : NarrowRoomResultPageFilter[],filterDispatcher : () => void}) {
   const isMobile = useMediaQuery("(max-width : 837px)");
   const [open, setOpen] = useState(true);
   useEffect(() => {
      if (!open) {
         setOpen(true);
      }
   }, [isMobile]);
   return (
      <>
         <div className="narrow-result-title">
            <div> <FormattedMessage
                        id="Narrow your results"
                        defaultMessage=""
                        description=""
                     /></div>
            {isMobile && !open && (
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
            {isMobile && open && (
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
            <div className="narrow-result-filter-list">
               {narrowFilters.map((narrowFilter) => (
                  <NarrowResultFilter
                     key={narrowFilter.name}
                     options={narrowFilter.values}
                     name={narrowFilter.name}
                     filterDispatcher={filterDispatcher}
                  />
               ))}
            </div>
         )}
      </>
   );
}
