import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Promotion } from "../../Types/RoomResultPage";
import {  BASE_URL } from "../../Util/API";

interface APIResponse {
   amenities: string[];
   standardRateDescription: string;
   description: string;
   promotions: Promotion[];
}

interface PromotionSliceType {
   amenities: string[];
   standardRateDescription: string;
   description: string;
   promotions: Promotion[];
   loading: boolean;
   error: string;
}

export const fetchDeals = createAsyncThunk(
   "PromotionSlice/fetchDeals",
   async ({
      roomTypeId,
      startDate,
      endDate,
   }: {
      roomTypeId: number;
      startDate: string;
      endDate: string;
   }) => {
      try {
         const res = await fetch(`${BASE_URL}/api/v1/roomModal`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({
               roomTypeId: roomTypeId,
               start_date: startDate,
               end_date: endDate,
            }),
         });
         const data = await res.json();
         return data;
      } catch (err) {
         throw new Error(
            "An error occurred while fetching Promotions : " + err
         );
      }
   }
);

export const applyPromo = createAsyncThunk(
   "PromotionSlice/applyPromo",
   async ({
      promoCode,
      roomTypeId,
      minDays,
   }: {
      promoCode: string;
      roomTypeId: number;
      minDays: number;
   }) => {
      try {
         const res = await fetch(`${BASE_URL}/api/v1/roomModal/promocode`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({
               promoCode: promoCode,
               roomTypeId: roomTypeId,
               minDays: minDays,
            }),
         });
         const data = await res.json();
         if (res.status !== 200) {
            throw new Error(" " + (data.msg ?? data));
         }
         return data;
      } catch (err) {
         throw new Error(" " + err);
      }
   }
);

const initialState: PromotionSliceType = {
   amenities: [],
   standardRateDescription: "",
   description: "",
   promotions: [],
   loading: false,
   error: "",
};
const PromotionSlice = createSlice({
   name: "PromotionSlice",
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(
            fetchDeals.fulfilled,
            (state, action: PayloadAction<APIResponse>) => {
               const {
                  amenities,
                  promotions,
                  standardRateDescription,
                  description,
               } = action.payload;
               state.promotions = promotions;
               state.amenities = amenities;
               state.description = description;
               state.standardRateDescription = standardRateDescription;
               state.loading = false;
            }
         )
         .addCase(fetchDeals.pending, (state) => {
            state.loading = true;
         })
         .addCase(fetchDeals.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message ?? "An error occurred";
         })
         .addCase(
            applyPromo.fulfilled,
            (state, action: PayloadAction<Promotion>) => {
               const promotion = state.promotions.find(
                  (promotion) =>
                     promotion.promotion_title ===
                     action.payload.promotion_title
               );
               if (promotion) {
                  state.error = "Promotion Already Added";
                  state.loading = false;
                  return;
               }
               state.promotions.push(action.payload);
               state.loading = false;
               state.error = "";
            }
         )
         .addCase(applyPromo.pending, (state) => {
            state.loading = true;
            state.error = "";
         })
         .addCase(applyPromo.rejected, (state, action) => {
            console.log("rejected");
            state.loading = false;
            state.error = action.error.message ?? "An error occurred";
         });
   },
});

export const {} = PromotionSlice.actions;
export default PromotionSlice.reducer;
