import { useState, useEffect } from "react";

const usePreviousSearches = () => {
   const [previousSearch, setPreviousSearch] = useState<string | null>(null);

   useEffect(() => {
      const storedSearch = localStorage.getItem("lastSearch");
      if (storedSearch) {
        setPreviousSearch(storedSearch);
      }
   }, []);

   const addSearch = (url: string) => {
    console.log(url);
    setPreviousSearch(url);
      localStorage.setItem("lastSearch", url);
   };

   return { previousSearch , addSearch };
};

export default usePreviousSearches;
