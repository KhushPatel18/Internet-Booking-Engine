import { CustomGuestSelect } from "../CustomGuestSelect/CustomGuestSelect";
import { CustomMultiSelect } from "../CustomMultiSelect/CustomMultiSelect";
import { CustomSelect } from "../CustomSelect/CustomSelect";
import "./SearchForm.scss";
import { ReactCalender } from "../ReactCalender/ReactCalender";
import { Option } from "../../Types/LandingPage";
import { useAppSelector } from "../../redux/store";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { formatGuests } from "../../Util/GeneralUtils";
import { setSelectedRoom } from "../../redux/LandingPageConfigSlice/LandingPageConfigSlice";
export function SearchForm() {
   const properties = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.tenantConfig.properties
   );
   const maxNoRoom = useAppSelector(
      (state) =>
         state.LandingPageConfigSliceReducer.currentConfig.maxRoomAllowed
   );
   const filters = useAppSelector(
      (state) =>
         state.LandingPageConfigSliceReducer.currentConfig.landingPageFilters
   );
   const selectedProperty = useAppSelector(
      (state) =>
         state.LandingPageConfigSliceReducer.filterStates.selectedProperty
   );
   const rooms: Option[] = [];
   for (let i = 1; i <= maxNoRoom; i++) {
      rooms.push({ value: `${i}` });
   }

   const FilterState = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.filterStates
   );

   return (
      <div className="search-form-container">
         <div className="select-properties">
            <p className="label">
               {" "}
               <FormattedMessage
                  id="properties"
                  defaultMessage=""
                  description=""
               />
            </p>
            <div className="properties">
               <CustomMultiSelect
                  options={properties}
               />
            </div>
         </div>
         <div className="select-dates">
            <p className="label">
               <FormattedMessage
                  id="select dates"
                  defaultMessage=""
                  description=""
               />
            </p>

            <ReactCalender />
         </div>
         <div className="guests-room-wrapper">
            {filters.includes("guests") && (
               <div
                  className="guests-select"
                  style={
                     !filters.includes("rooms")
                        ? { width: "100%" }
                        : { width: "200px" }
                  }>
                  <p className="label">
                     <FormattedMessage
                        id="guests"
                        defaultMessage=""
                        description=""
                     />
                  </p>
                  <div className="guests">
                     <CustomGuestSelect
                     />
                  </div>
               </div>
            )}
            {filters.includes("rooms") && (
               <div className="rooms-select">
                  <p className="label">
                     <FormattedMessage
                        id="rooms"
                        defaultMessage=""
                        description=""
                     />
                  </p>
                  <div className="rooms">
                     <CustomSelect
                        options={rooms}
                        name="rooms"
                        setter={setSelectedRoom}
                     />
                  </div>
               </div>
            )}
            {filters.includes("wheelchair") && (
               <div className="wheelchair">
                  <input type="checkbox" className="checkbox" />
                  <svg
                     width="12"
                     height="14"
                     viewBox="0 0 12 14"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                     <path
                        d="M5.99998 3.33317C6.26368 3.33317 6.52147 3.25497 6.74074 3.10846C6.96 2.96196 7.1309 2.75372 7.23181 2.51008C7.33273 2.26645 7.35914 1.99836 7.30769 1.73972C7.25624 1.48108 7.12925 1.2435 6.94278 1.05703C6.75631 0.870559 6.51874 0.743571 6.2601 0.692124C6.00145 0.640677 5.73337 0.667082 5.48973 0.767998C5.2461 0.868915 5.03786 1.03981 4.89135 1.25908C4.74484 1.47834 4.66664 1.73613 4.66664 1.99984C4.66664 2.35346 4.80712 2.6926 5.05717 2.94265C5.30721 3.1927 5.64635 3.33317 5.99998 3.33317ZM11 12.6665H10.3333V9.33317C10.3333 9.15636 10.2631 8.98679 10.138 8.86177C10.013 8.73674 9.84345 8.6665 9.66664 8.6665H6.33331V7.33317H9.66664C9.84345 7.33317 10.013 7.26293 10.138 7.13791C10.2631 7.01288 10.3333 6.84332 10.3333 6.6665C10.3333 6.48969 10.2631 6.32012 10.138 6.1951C10.013 6.07008 9.84345 5.99984 9.66664 5.99984H6.33331V4.6665C6.33331 4.48969 6.26307 4.32012 6.13805 4.1951C6.01302 4.07008 5.84345 3.99984 5.66664 3.99984C5.48983 3.99984 5.32026 4.07008 5.19524 4.1951C5.07021 4.32012 4.99998 4.48969 4.99998 4.6665V9.33317C4.99998 9.50998 5.07021 9.67955 5.19524 9.80458C5.32026 9.9296 5.48983 9.99984 5.66664 9.99984H8.99998V13.3332C8.99998 13.51 9.07021 13.6796 9.19524 13.8046C9.32026 13.9296 9.48983 13.9998 9.66664 13.9998H11C11.1768 13.9998 11.3464 13.9296 11.4714 13.8046C11.5964 13.6796 11.6666 13.51 11.6666 13.3332C11.6666 13.1564 11.5964 12.9868 11.4714 12.8618C11.3464 12.7367 11.1768 12.6665 11 12.6665ZM6.46664 11.5998C6.13083 12.0476 5.66265 12.3783 5.12842 12.5452C4.59419 12.7121 4.021 12.7066 3.49003 12.5297C2.95907 12.3527 2.49725 12.0131 2.17 11.5591C1.84274 11.105 1.66664 10.5595 1.66664 9.99984C1.66743 9.48165 1.81917 8.97492 2.10332 8.54159C2.38747 8.10826 2.79172 7.76711 3.26664 7.55984C3.42931 7.48911 3.55722 7.35667 3.62223 7.19163C3.68724 7.0266 3.68403 6.8425 3.61331 6.67984C3.54258 6.51717 3.41014 6.38926 3.24511 6.32425C3.08007 6.25924 2.89597 6.26245 2.73331 6.33317C2.17231 6.57814 1.67501 6.94859 1.27973 7.41601C0.884443 7.88342 0.601711 8.43533 0.453308 9.02922C0.304905 9.62311 0.29479 10.2431 0.423742 10.8416C0.552694 11.44 0.817273 12.0008 1.1971 12.4809C1.57693 12.9609 2.06188 13.3474 2.61459 13.6105C3.1673 13.8737 3.77303 14.0064 4.38513 13.9986C4.99723 13.9908 5.59937 13.8426 6.14517 13.5654C6.69098 13.2882 7.16588 12.8895 7.53331 12.3998C7.6394 12.2584 7.68495 12.0806 7.65994 11.9056C7.63494 11.7305 7.54142 11.5726 7.39998 11.4665C7.25853 11.3604 7.08073 11.3149 6.90569 11.3399C6.73066 11.3649 6.57273 11.4584 6.46664 11.5998Z"
                        fill="black"
                     />
                  </svg>
                  <p className="wheelchair-text">
                     {" "}
                     <FormattedMessage
                        id="wheelchair-text"
                        defaultMessage=""
                        description=""
                     />
                  </p>
               </div>
            )}
         </div>
         <Link
            to={`/rooms?property=${selectedProperty}&guests=${formatGuests(
               FilterState.selectedGuests
            )}&rooms=${FilterState.selectedRooms}&startDate=${
               FilterState.startDate
            }&endDate=${FilterState.endDate}`}
            onClick={() =>
               window.localStorage.setItem(
                  "prevSearch",
                  `?property=${selectedProperty}&guests=${formatGuests(
                     FilterState.selectedGuests
                  )}&rooms=${FilterState.selectedRooms}&startDate=${
                     FilterState.startDate
                  }&endDate=${FilterState.endDate}`
               )
            }>
            <button
               className="search-btn"
               disabled={selectedProperty !== "" ? false : true}
               style={
                  selectedProperty === ""
                     ? { opacity: "0.2", cursor: "not-allowed" }
                     : undefined
               }>
               <FormattedMessage id="search" defaultMessage="" description="" />
            </button>
         </Link>
      </div>
   );
}
