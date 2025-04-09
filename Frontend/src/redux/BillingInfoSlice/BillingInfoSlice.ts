import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: FormValuesBilling = {
  billingFirstName: "",
  billingLastName: "",
  billingAddress1: "",
  billingAddress2: "",
  billingCountry: "",
  billingCity: "",
  billingState: "",
  billingZip: "",
  billingPhone: "",
  billingEmail: "",
};

const BillingInfoSlice = createSlice({
  name: "billingInfo",
  initialState,
  reducers: {
    setBillingInfo: (state, action: PayloadAction<FormValuesBilling>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { setBillingInfo } = BillingInfoSlice.actions;
export default BillingInfoSlice.reducer;
