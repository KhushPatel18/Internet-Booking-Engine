import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface SnackBarSliceType {
   message: string;
   showSnackbar: boolean;
   type: "error" | "success";
}

const initialState: SnackBarSliceType = {
   message: "Something went wrong",
   showSnackbar: false,
   type: "error",
};
const SnackBarSlice = createSlice({
   name: "ItinerarySlice",
   initialState,
   reducers: {
      setShowSnackbar: (state, action: PayloadAction<SnackBarSliceType>) => {
         const { showSnackbar, message, type } = action.payload;
         state.showSnackbar = showSnackbar;
         state.message = message;
         state.type = type;
      },
   },
});

export const { setShowSnackbar } = SnackBarSlice.actions;
export default SnackBarSlice.reducer;
