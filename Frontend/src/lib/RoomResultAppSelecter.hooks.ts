import { Option } from "../Types/LandingPage";
import { useAppDispatch, useAppSelector } from "../redux/store";

export const useRoomResultAppSelector = () => {
    const filters = useAppSelector(
        (state) =>
           state.LandingPageConfigSliceReducer.currentConfig.landingPageFilters
     );
     const maxNoRoom = useAppSelector(
        (state) =>
           state.LandingPageConfigSliceReducer.currentConfig.maxRoomAllowed
     );
     const filterState = useAppSelector(
        (state) => state.LandingPageConfigSliceReducer.filterStates
     );
     const narrowFilters = useAppSelector(
        (state) =>
           state.LandingPageConfigSliceReducer.currentConfig
              .narrowRoomResultPageFilters
     );
  
     const roomCards = useAppSelector(
        (state) => state.RoomCardSliceReducer.roomCards
     );
     const length = useAppSelector((state) => state.RoomCardSliceReducer.length);
     const loading = useAppSelector(
        (state) => state.RoomCardSliceReducer.loading
     );
     const error = useAppSelector((state) => state.RoomCardSliceReducer.error);
  
     const reduxDispatch = useAppDispatch();

     const maxBedAllowed = 15;


   const beds: Option[] = [];
   const rooms: Option[] = [];
   for (let i = 1; i <= maxNoRoom; i++) {
      rooms.push({ value: `${i}` });
   }
   for (let i = 1; i <= maxBedAllowed; i++) {
      beds.push({ value: `${i}` });
   }

     return {filters,maxNoRoom,filterState,narrowFilters,roomCards,length,loading,error,maxBedAllowed,beds,rooms,reduxDispatch};
}