import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LANGUAGE_API_KEY } from "../../Util/API";

interface LanguageSlice {
   selectedLanguage: { label: string; value: string; logo: string };
   selectedCurrency: string;
   exchangeRate: {
      [key: string]: number;
   };
}

export const fetchExchangeRates = createAsyncThunk(
   "language-currency-conversion/fetchExchangeRates",
   async () => {
      try {
         const rates = window.localStorage.getItem("exchangeRates");
         // Check if data is already cached
         if (rates) {
            return JSON.parse(rates);
         }

         const response = await fetch(
            `https://api.freecurrencyapi.com/v1/latest?apikey=${LANGUAGE_API_KEY}&currencies=EUR%2CINR%2CUSD`
         );
         const result = await response.json();
         const data = result.data;

         // Cache the data
         window.localStorage.setItem("exchangeRates", JSON.stringify(data));
         return data;
      } catch (err) {
         throw new Error(
            "An error occurred while fetching Exchange Rates: " + err
         );
      }
   }
);

const initialState: LanguageSlice = {
   selectedLanguage: { label: "En", value: "en", logo: "globe.svg" },
   selectedCurrency: "USD",
   exchangeRate: { USD: 1 },
};
const LanguageSlice = createSlice({
   name: "language-currency-conversion",
   initialState,
   reducers: {
      setLanguage: (state, action) => {
         state.selectedLanguage = action.payload;
      },
      setCurrency: (state, action: PayloadAction<string>) => {
         state.selectedCurrency = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder.addCase(fetchExchangeRates.fulfilled, (state, action) => {
         state.exchangeRate = action.payload;
      });
   },
});

export const { setLanguage, setCurrency } = LanguageSlice.actions;
export default LanguageSlice.reducer;
