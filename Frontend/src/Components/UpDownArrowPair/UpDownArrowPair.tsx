import React from "react";

export default function UpDownArrowPair({open,setOpen} : 
   {open: boolean,
   setOpen: React.Dispatch<React.SetStateAction<boolean>>}
) {
   return (
      <>
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
      </>
   );
}
