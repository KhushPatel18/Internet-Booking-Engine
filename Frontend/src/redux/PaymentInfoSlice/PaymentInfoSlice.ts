import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CardNUmber {
   cardNumber: string;
   expiryMonth: number;
   expiryYear: number;
}

const initialState: CardNUmber = {
   cardNumber: "",
   expiryYear: 2026,
   expiryMonth: 5,
};

const paymentInfoSlice = createSlice({
   name: "paymentInfo",
   initialState,
   reducers: {
      setPaymentInfo: (state, action: PayloadAction<CardNUmber>) => {
         console.log(action.payload);
         state.cardNumber = action.payload.cardNumber;
         state.expiryMonth = action.payload.expiryMonth;
         state.expiryYear = action.payload.expiryYear;
      },
   },
});

export const { setPaymentInfo } = paymentInfoSlice.actions;
export default paymentInfoSlice.reducer;
