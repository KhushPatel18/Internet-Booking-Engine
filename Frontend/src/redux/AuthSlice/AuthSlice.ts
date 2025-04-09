import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthSlice {
   token: string;
   email: string;
}

const initialState: AuthSlice = {
   token: "",
   email: "patelkhush.girishbhai@kickdrumtech.com",
};
const AuthSlice = createSlice({
   name: "AuthSlice",
   initialState,
   reducers: {
      setToken: (state, action: PayloadAction<string>) => {
         state.token = action.payload;
      },
      setEmail: (state, action: PayloadAction<string>) => {
         state.email = action.payload;
      },
   },
});

export const { setToken,setEmail } = AuthSlice.actions;
export default AuthSlice.reducer;
