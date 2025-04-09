import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
   MinimumNightlyRate,
   MinimumNightlyRateDateValue,
} from "../../Types/LandingPage";
import { BASE_URL, PROPERTY_ID } from "../../Util/API";
interface MinimumNightlyRatesSliceState {
   minimumNightlyRates: {
      [date: string]: MinimumNightlyRateDateValue;
   };
   loading: boolean;
   error: string;
}

export const fetchRates = createAsyncThunk(
   "MinimumNightlyRatesSlice/fetchRates",
   async () => {
      try {
         const response = await fetch(
            `${BASE_URL}/api/v1/property/getRates/${PROPERTY_ID}`
         );
         const result = await response.json();
         return result;
      } catch (err) {
         console.log(err);
         throw new Error("An error occurred while fetching Rates: " + err);
      }
   }
);

const initialState: MinimumNightlyRatesSliceState = {
   minimumNightlyRates: {},
   loading: false,
   error: "",
};

const MinimumNightlyRatesSlice = createSlice({
   name: "MinimumNightlyRatesSlice",
   initialState,
   reducers: {
      setLoading: (state, action: PayloadAction<boolean>) => {
         state.loading = action.payload;
      },
      setError: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(
            fetchRates.fulfilled,
            (state, action: PayloadAction<MinimumNightlyRate[]>) => {
               const rates = action.payload;
               rates.map((rate) => {
                  state.minimumNightlyRates[rate.date] = {
                     price: rate.price,
                     discountedPrice: rate.discountedPrice,
                  };
               });
               state.loading = false;
               state.error = "";
            }
         )
         .addCase(fetchRates.pending, (state) => {
            state.loading = true;
            state.error = "";
         })
         .addCase(fetchRates.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message ?? "An error occurred";
         });
   },
});

export const { setError, setLoading } = MinimumNightlyRatesSlice.actions;
export default MinimumNightlyRatesSlice.reducer;
