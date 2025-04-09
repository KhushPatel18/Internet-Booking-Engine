import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import LanguageReducer from "./LanguageSlice/LanguageSlice";
import LandingPageConfigSliceReducer from "./LandingPageConfigSlice/LandingPageConfigSlice";
import MinimumNightlyRatesSlice from "./MinimumNightlyRatesSlice/MinimumNightlyRatesSlice";
import RoomCardSliceReducer from "./RoomCardSlice/RoomCardSlice";
import PromotionSliceReducer from "./PromotionSlice/PromotionSlice";
import ItinerarySlice from "./ItinerarySlice/ItinerarySlice";
import SnackbarSlice from "./SnackbarSlice/SnackbarSlice";
import travellerInfoReducer from "./TravellerInfoSlice/TraverllerInfoSlice";
import billingInfoReducer from "./BillingInfoSlice/BillingInfoSlice";
import paymentInfoReducer from "./PaymentInfoSlice/PaymentInfoSlice";
import AuthSliceReducer from "./AuthSlice/AuthSlice";

export const store = configureStore({
   reducer: {
      LanguageReducer,
      LandingPageConfigSliceReducer,
      MinimumNightlyRatesSlice,
      RoomCardSliceReducer,
      PromotionSliceReducer,
      SnackbarSlice,
      ItinerarySlice,
      travellerInfo: travellerInfoReducer,
      billingInfo: billingInfoReducer,
      paymentInfo: paymentInfoReducer,
      AuthSliceReducer,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: false,
      }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
