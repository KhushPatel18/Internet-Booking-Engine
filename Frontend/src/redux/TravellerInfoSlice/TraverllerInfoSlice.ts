import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState:FormValues = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
};

const travellerInfoSlice = createSlice({
  name: 'travellerInfo',
  initialState,
  reducers: {
    setTravellerInfo: (state, action: PayloadAction<FormValues>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { setTravellerInfo } = travellerInfoSlice.actions;
export default travellerInfoSlice.reducer;
