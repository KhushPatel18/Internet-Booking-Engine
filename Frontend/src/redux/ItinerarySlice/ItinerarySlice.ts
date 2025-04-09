import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {  BASE_URL } from "../../Util/API";

export interface ItineraryDetails {
   iternaryId: string;
   roomTypeId: number;
   propertyName: string;
   stayString: string;
   guestString: string;
   promoPrice: number;
   roomName: string;
   avgPrice: number;
   noOfRooms: number;
   specialPromoName: string;
   specialPromoDescription: string;
   subtotal: number;
   dateWisePrices: { [key: string]: number };
   roomImage: string;
}

interface SetItineraryValuesPayload {
   iternaryId: string;
   roomTypeId: number;
   propertyName: string;
   stayString: string;
   guestString: string;
   roomName: string;
   avgPrice: number;
   promoPrice: number;
   noOfRooms: number;
   specialPromoName: string;
   specialPromoDescription: string;
   roomImage: string;
}

interface APIResponseUnit {
   basic_nightly_rate: number;
   date: string;
}

interface ReqBody {
   startDate: string;
   endDate: string;
   roomTypeId: number;
}

export const fetchItrRates = createAsyncThunk(
   "ItinerarySlice/fetchItrRates",
   async ({ startDate, endDate, roomTypeId }: ReqBody) => {
      try {
         console.log(startDate, endDate, roomTypeId);
         const response = await fetch(
            `${BASE_URL}/api/v1/property/getRatesItr`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify({
                  room_type_id: roomTypeId,
                  start_date: startDate,
                  end_date: endDate,
               }),
            }
         );
         const result = await response.json();
         return result;
      } catch (err) {
         throw new Error("An error occurred while fetching Rates: " + err);
      }
   }
);

export interface ItinerarySliceType {
   itineraryDetails: ItineraryDetails;
   showItinerary: boolean;
   buttonType: "Checkout" | "Continue Shopping";
   loading: boolean;
   error: string;
   timeLeft: number;
}

interface ShowItineraryPayload {
   show: boolean;
   type: "Checkout" | "Continue Shopping";
}

const initialState: ItinerarySliceType = {
   itineraryDetails: {
      iternaryId: "me nahi bataunga",
      roomTypeId: 71,
      propertyName: "Long Beautiful Resort Name",
      stayString: "May 9 - May 16, 2022",
      guestString: "1 adult 1 child",
      roomName: "Standard Deluxe",
      avgPrice: 132,
      noOfRooms: 1,
      promoPrice: 0,
      specialPromoName: "Special Promoname",
      specialPromoDescription: "Special Promo",
      subtotal: 100.0,
      dateWisePrices: {},
      roomImage: "room-defualt.jpg",
   },
   showItinerary: false,
   buttonType: "Continue Shopping",
   loading: false,
   error: "",
   timeLeft: 600,
};
const ItinerarySlice = createSlice({
   name: "ItinerarySlice",
   initialState,
   reducers: {
      setShowItinerary: (
         state,
         action: PayloadAction<ShowItineraryPayload>
      ) => {
         state.showItinerary = action.payload.show;
         state.buttonType = action.payload.type;
      },
      setItineraryValues: (
         state,
         action: PayloadAction<SetItineraryValuesPayload>
      ) => {
         const {
            roomTypeId,
            propertyName,
            stayString,
            guestString,
            roomName,
            avgPrice,
            noOfRooms,
            specialPromoName,
            specialPromoDescription,
            iternaryId,
            promoPrice,
            roomImage,
         } = action.payload;
         state.itineraryDetails.avgPrice = avgPrice;
         state.itineraryDetails.roomImage = roomImage;
         state.itineraryDetails.propertyName = propertyName;
         state.itineraryDetails.stayString = stayString;
         state.itineraryDetails.specialPromoName = specialPromoName;
         state.itineraryDetails.guestString = guestString;
         state.itineraryDetails.roomName = roomName;
         state.itineraryDetails.noOfRooms = noOfRooms;
         state.itineraryDetails.roomTypeId = roomTypeId;
         state.itineraryDetails.iternaryId = iternaryId;
         state.itineraryDetails.promoPrice = noOfRooms * promoPrice;
         state.itineraryDetails.specialPromoDescription =
            specialPromoDescription;
         let total = Object.values(
            state.itineraryDetails.dateWisePrices
         ).reduce((accumulator, value) => accumulator + value, 0.0);
         state.itineraryDetails.subtotal = noOfRooms * (total - promoPrice);
      },
      setTimeLeft: (state, action: PayloadAction<number>) => {
         state.timeLeft = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(
            fetchItrRates.fulfilled,
            (state, action: PayloadAction<APIResponseUnit[]>) => {
               action.payload.map((apiResponseUnit) => {
                  state.itineraryDetails.dateWisePrices[apiResponseUnit.date] =
                     apiResponseUnit.basic_nightly_rate;
               });
            }
         )
         .addCase(fetchItrRates.pending, (state) => {
            state.loading = true;
            state.error = "";
         })
         .addCase(fetchItrRates.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message ?? "An error occurred";
         });
   },
});

export const { setShowItinerary, setItineraryValues, setTimeLeft } =
   ItinerarySlice.actions;
export default ItinerarySlice.reducer;
