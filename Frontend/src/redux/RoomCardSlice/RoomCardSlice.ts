import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RoomAPIResponse, RoomCardType } from "../../Types/RoomResultPage";
import { BASE_URL } from "../../Util/API";

interface RoomCardSliceState {
   roomCards: RoomCardType[];
   length: number;
   loading: boolean;
   error: string;
}

export interface FetchRoomsRequestBody {
   start_date: string;
   end_date: string;
   property_id: string;
   adults?: number;
   teens?: number;
   kids?: number;
   senior_citizen?: number;
   rooms?: number;
   beds?: number;
   room_types?: string[];
   bed_types?: string[];
   sort_rate?: string;
   sort_rating?: string;
   sort_review?: string;
   sort_name?: string;
}

export const fetchRooms = createAsyncThunk(
   "RoomCardSlice/fetchRooms",
   async ({
      pageNo,
      pageSize,
      reqBody,
   }: {
      pageNo: number;
      pageSize: number;
      reqBody: FetchRoomsRequestBody;
   }) => {
      try {
         const response = await fetch(
            `${BASE_URL}/api/v1/rooms/searchRooms?page=${pageNo}&pageSize=${pageSize}`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(reqBody),
            }
         );
         const result = await response.json();
         return result;
      } catch (err) {
         throw new Error("An error occurred while fetching Rooms: " + err);
      }
   }
);

const initialState: RoomCardSliceState = {
   roomCards: [
      {
         roomTypeName: "GRAND_DELUXE",
         maxCapacity: "4",
         doubleBeds: 2,
         singleBeds: 1,
         area: 450.0,
         roomTypeId: 67,
         averageRoomRate: 145.0,
         carouselImages: [
            "https://team12ibestorage.blob.core.windows.net/images/carouselimages/granddeluxe1.jpg",
            "https://team12ibestorage.blob.core.windows.net/images/carouselimages/granddeluxe2.jpg",
            "https://team12ibestorage.blob.core.windows.net/images/carouselimages/granddeluxe3.jpg",
         ],
         rating: 5,
         review: 178,
      },
   ],
   length: 1,
   loading: false,
   error: "",
};

const RoomCardSlice = createSlice({
   name: "RoomCardSlice",
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
            fetchRooms.fulfilled,
            (state, action: PayloadAction<RoomAPIResponse>) => {
               state.roomCards = action.payload.roomCardDTOList;
               state.length = action.payload.length;
               state.loading = false;
               state.error = "";
            }
         )
         .addCase(fetchRooms.pending, (state) => {
            state.loading = true;
            state.error = "";
         })
         .addCase(fetchRooms.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message ?? "An error occurred";
         });
   },
});

export const { setError, setLoading } = RoomCardSlice.actions;
export default RoomCardSlice.reducer;
