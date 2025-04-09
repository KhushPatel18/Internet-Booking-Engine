import { Header } from "../../Components/Header/Header";
import { Itinerary } from "../../Components/Itinerary/Itinerary";
import "./RoomResultPage.scss";
import { NarrowResult } from "../../Components/NarrowResult/NarrowResult";
import ButtonStepper from "../../Components/Stepper/Stepper";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useEffect, useState } from "react";
import { CustomGuestSelect } from "../../Components/CustomGuestSelect/CustomGuestSelect";
import { CustomSelect } from "../../Components/CustomSelect/CustomSelect";
import { Option } from "../../Types/LandingPage";
import { ReactCalender } from "../../Components/ReactCalender/ReactCalender";
import { useMediaQuery } from "usehooks-ts";
import {
   fetchConfig,
   setCountByName,
   setCurrentConfig,
   setEndDate,
   setSelectedBeds,
   setSelectedProperty,
   setSelectedRoom,
   setStartDate,
} from "../../redux/LandingPageConfigSlice/LandingPageConfigSlice";
import { formatGuests } from "../../Util/GeneralUtils";
import { Link } from "react-router-dom";
import { SortResultFilter } from "../../Components/SortResultFilter/SortResultFilter";
import { RoomCard } from "../../Components/RoomCard/RoomCard";
import { fetchRooms } from "../../redux/RoomCardSlice/RoomCardSlice";
import { SnackbarComponent } from "../../Components/SnackbarComponent/SnackbarComponent";
import { FormattedMessage } from "react-intl";
import { SkeletonComponent } from "../../Components/Skaleton/Skaleton";
import { urlEndpoint } from "../../Util/API";
import { IKImage } from "imagekitio-react";

export function RoomResultPage() {
   const iternary = useAppSelector(
      (state) => state.ItinerarySlice.showItinerary
   );
   const [pageNo, setPageNo] = useState(0);
   const [pageSize] = useState(3);
   const [noCardShow, setNoCardShow] = useState(true);
   const isMobail = useMediaQuery("(max-width :  768px)");
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
   const maxBedAllowed = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.currentConfig.maxBedAllowed
   );

   const beds: Option[] = [];
   const rooms: Option[] = [];
   for (let i = 1; i <= maxNoRoom; i++) {
      rooms.push({ value: `${i}` });
   }
   for (let i = 1; i <= maxBedAllowed; i++) {
      beds.push({ value: `${i}` });
   }

   const previousSearch = window.localStorage.getItem("prevSearch");
   if (window.location.search === "") {
      if (previousSearch === null) {
         window.location.href = "/";
      } else {
         console.log("Redirecting to previous search:", previousSearch);
         window.location.search = previousSearch;
      }
   }

   const searchParams = new URLSearchParams(window.location.search);
   const propertyString = searchParams.get("property");

   // Setting dropdown options and their selected state using search params
   useEffect(() => {
      reduxDispatch(fetchConfig()).then(() => {
         const propertyString = searchParams.get("property");
         if (propertyString) {
            reduxDispatch(setCurrentConfig(propertyString));
            reduxDispatch(setSelectedProperty(propertyString));
         } else {
            console.log("through property");
            setNoCardShow(false);
         }
         const roomsString = searchParams.get("rooms");
         if (roomsString) {
            const count = parseInt(roomsString, 10) || 1;
            if (count > maxNoRoom) {
               setNoCardShow(false);
               return;
            }
            reduxDispatch(setSelectedRoom(count));
         } else {
            console.log("through rooms");
            setNoCardShow(false);
         }

         const guestsString = searchParams.get("guests");
         if (guestsString) {
            guestsString.split(",").forEach((guestString) => {
               const [name, countString] = guestString.split(":");
               const count = parseInt(countString, 10) || 0;
               if (count > maxNoRoom * 2) {
                  setNoCardShow(false);
                  return;
               }
               console.log(name, count);
               reduxDispatch(setCountByName({ name, count }));
            });
         } else {
            console.log("through guest");
            setNoCardShow(false);
         }

         const startDateString = searchParams.get("startDate");
         if (startDateString) {
            const date = new Date(startDateString);
            if (isNaN(date.getTime())) {
               setNoCardShow(false);
               return;
            }
            reduxDispatch(setStartDate(date));
         } else {
            setNoCardShow(false);
         }

         const endDateString = searchParams.get("endDate");
         if (endDateString) {
            const date = new Date(endDateString);
            if (isNaN(date.getTime())) {
               setNoCardShow(false);
               return;
            }
            reduxDispatch(setEndDate(date));
         } else {
            setNoCardShow(false);
         }
         if (startDateString && endDateString) {
            const start = new Date(startDateString);
            const end = new Date(endDateString);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
               setNoCardShow(false);
               return;
            }
            const differenceInMilliseconds: number =
               end.getTime() - start.getTime();

            // Convert milliseconds to days
            const millisecondsPerDay: number = 1000 * 60 * 60 * 24;
            const differenceInDays: number = Math.floor(
               differenceInMilliseconds / millisecondsPerDay
            );
            if (differenceInDays > 14) {
               setNoCardShow(false);
               return;
            }
         }
      });
   }, []);

   console.log("room-results rerendered");
   // pagination APIcall
   useEffect(() => {
      const tick = performance.now();
      console.log("thunk dispatched for room card due to pageNo Change");
      reduxDispatch(
         fetchRooms({
            pageNo: pageNo,
            pageSize: pageSize,
            reqBody: {
               start_date: filterState.startDate.toISOString(),
               end_date: filterState.endDate.toISOString(),
               property_id: "12",
               adults: filterState.selectedGuests["Adults"] ?? 1,
               teens: filterState.selectedGuests["Teens"] ?? 0,
               kids: filterState.selectedGuests["Kids"] ?? 0,
               rooms: filterState.selectedRooms,
               beds: filterState.selectedBed,
               room_types: filterState.narrowResultFiltersState["Room Type"],
               bed_types: filterState.narrowResultFiltersState["Bed Type"],
               sort_name:
                  filterState.selectedSortFilter.split(" ")[0] === "name"
                     ? filterState.selectedSortFilter.split(" ")[2]
                     : undefined,
               sort_rate:
                  filterState.selectedSortFilter.split(" ")[0] === "price"
                     ? filterState.selectedSortFilter.split(" ")[2]
                     : undefined,
               sort_rating:
                  filterState.selectedSortFilter.split(" ")[0] === "ratings"
                     ? filterState.selectedSortFilter.split(" ")[2]
                     : undefined,
               sort_review:
                  filterState.selectedSortFilter.split(" ")[0] === "reviews"
                     ? filterState.selectedSortFilter.split(" ")[2]
                     : undefined,
            },
         })
      ).then(() => {
         const tock = performance.now();
         console.log("got the response", tock - tick);
      });
   }, [pageNo]);

   // filter api call
   const dispatchRoomResults = () => {
      const tick = performance.now();
      console.log("thunk dispatched for room card through normal clicks");
      reduxDispatch(
         fetchRooms({
            pageNo: pageNo,
            pageSize: pageSize,
            reqBody: {
               start_date: filterState.startDate.toISOString(),
               end_date: filterState.endDate.toISOString(),
               property_id: "12",
               adults: filterState.selectedGuests["Adults"] ?? 1,
               teens: filterState.selectedGuests["Teens"] ?? 0,
               kids: filterState.selectedGuests["Kids"] ?? 0,
               rooms: filterState.selectedRooms,
               beds: filterState.selectedBed,
               room_types: filterState.narrowResultFiltersState["Room Type"],
               bed_types: filterState.narrowResultFiltersState["Bed Type"],
               sort_name:
                  filterState.selectedSortFilter.split(" ")[0] === "name"
                     ? filterState.selectedSortFilter.split(" ")[2]
                     : undefined,
               sort_rate:
                  filterState.selectedSortFilter.split(" ")[0] === "price"
                     ? filterState.selectedSortFilter.split(" ")[2]
                     : undefined,
               sort_rating:
                  filterState.selectedSortFilter.split(" ")[0] === "ratings"
                     ? filterState.selectedSortFilter.split(" ")[2]
                     : undefined,
               sort_review:
                  filterState.selectedSortFilter.split(" ")[0] === "reviews"
                     ? filterState.selectedSortFilter.split(" ")[2]
                     : undefined,
            },
         })
      ).then(() => {
         setPageNo(0);
         const tock = performance.now();
         console.log("got the response", tock - tick);
      });
   };

   const handlePageDown = () => {
      if (noCardShow && !loading && pageNo > 0) {
         setPageNo(pageNo - 1);
      }
   };
   const handlePageUp = () => {
      if (!loading && pageNo + 1 < Math.ceil(length / pageSize)) {
         setPageNo(pageNo + 1);
      }
   };
   const bannerImage = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.currentConfig.bannerImage
   );
   return (
      <div className="room-result-container">
         <div className="room-result-header">
            <Header />
         </div>
         <div className="banner-room-result">
            <IKImage
               urlEndpoint={urlEndpoint}
               path={bannerImage}
            />
         </div>
         <div className="steps">
            <ButtonStepper step={!iternary ? 0 : 1} />
         </div>
         <main className="filter-result-wrapper">
            <div className="filters-wrapper">
               <div className="guests-filter">
                  <CustomGuestSelect isRoomResult={true} />
               </div>
               <div className="rooms-filter">
                  <CustomSelect
                     isRoomResult={true}
                     name="rooms"
                     options={rooms}
                     setter={setSelectedRoom}
                  />
               </div>
               <div className="beds-filter">
                  <CustomSelect
                     isRoomResult={true}
                     name="beds"
                     options={beds}
                     setter={setSelectedBeds}
                  />
               </div>
               <div className="date-filter">
                  <ReactCalender isRoomResult={true} isMobileView={isMobail} />
               </div>

               <button
                  className="search-dates-btn"
                  onClick={() => {
                     console.log("through search button");
                     dispatchRoomResults();
                  }}>
                  <Link
                     to={`/rooms?property=${propertyString}&guests=${formatGuests(
                        filterState.selectedGuests
                     )}&rooms=${filterState.selectedRooms}&startDate=${
                        filterState.startDate
                     }&endDate=${filterState.endDate}`}
                     onClick={() =>
                        window.localStorage.setItem(
                           "prevSearch",
                           `?property=${propertyString}&guests=${formatGuests(
                              filterState.selectedGuests
                           )}&rooms=${filterState.selectedRooms}&startDate=${
                              filterState.startDate
                           }&endDate=${filterState.endDate}`
                        )
                     }>
                     <FormattedMessage
                        id="SEARCH DATES"
                        defaultMessage=""
                        description=""
                     />
                  </Link>
               </button>
            </div>
            <div className="cards-narrow-results-wrapper">
               <div
                  className="narrow-results"
                  style={
                     isMobail
                        ? { width: "98%", maxWidth: "457px", margin: "auto" }
                        : undefined
                  }>
                  <NarrowResult
                     narrowFilters={narrowFilters}
                     filterDispatcher={() => {
                        console.log("through narrow button");
                        dispatchRoomResults();
                     }}
                  />
               </div>
               {iternary && isMobail && !loading && (
                  <div
                     className="itinerary"
                     style={{
                        width: "98%",
                        maxWidth: "457px",
                        margin: "auto",
                        backgroundColor: " #eff0f1",
                        borderRadius: "5px",
                     }}>
                     <Itinerary />
                  </div>
               )}
               <div className="cards-itinerary-wrapper">
                  <div className="cards-itinerary-wrapper-head">
                     <div className="room-results-title">
                        <FormattedMessage
                           id="Room Results"
                           defaultMessage=""
                           description=""
                        />
                     </div>
                     <div className="result-pagination-sort-filter-wrapper">
                        <div className="pagination-wrapper">
                           <svg
                              onClick={handlePageDown}
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                 d="M8.5002 12.8L14.2002 18.4C14.6002 18.8 15.2002 18.8 15.6002 18.4C16.0002 18 16.0002 17.4 15.6002 17L10.7002 12L15.6002 7.00005C16.0002 6.60005 16.0002 6.00005 15.6002 5.60005C15.4002 5.40005 15.2002 5.30005 14.9002 5.30005C14.6002 5.30005 14.4002 5.40005 14.2002 5.60005L8.5002 11.2C8.1002 11.7 8.1002 12.3 8.5002 12.8C8.5002 12.7 8.5002 12.7 8.5002 12.8Z"
                                 fill="black"
                              />
                           </svg>
                           {!loading && (
                              <div className="pagination-info">
                                 <FormattedMessage
                                    id="Showing"
                                    defaultMessage=""
                                    description=""
                                 />{" "}
                                 {pageNo * pageSize + 1}-
                                 {Math.min(length, (pageNo + 1) * pageSize)}{" "}
                                 <FormattedMessage
                                    id="of"
                                    defaultMessage=""
                                    description=""
                                 />{" "}
                                 {length}{" "}
                                 <FormattedMessage
                                    id="Results"
                                    defaultMessage=""
                                    description=""
                                 />
                              </div>
                           )}
                           <svg
                              onClick={handlePageUp}
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                 d="M15.5397 11.29L9.87974 5.64004C9.78677 5.54631 9.67617 5.47191 9.55431 5.42115C9.43246 5.37038 9.30175 5.34424 9.16974 5.34424C9.03773 5.34424 8.90702 5.37038 8.78516 5.42115C8.6633 5.47191 8.5527 5.54631 8.45974 5.64004C8.27349 5.8274 8.16895 6.08085 8.16895 6.34504C8.16895 6.60922 8.27349 6.86267 8.45974 7.05004L13.4097 12.05L8.45974 17C8.27349 17.1874 8.16895 17.4409 8.16895 17.705C8.16895 17.9692 8.27349 18.2227 8.45974 18.41C8.55235 18.5045 8.6628 18.5797 8.78467 18.6312C8.90655 18.6827 9.03743 18.7095 9.16974 18.71C9.30204 18.7095 9.43293 18.6827 9.5548 18.6312C9.67668 18.5797 9.78712 18.5045 9.87974 18.41L15.5397 12.76C15.6412 12.6664 15.7223 12.5527 15.7777 12.4262C15.8331 12.2997 15.8617 12.1631 15.8617 12.025C15.8617 11.8869 15.8331 11.7503 15.7777 11.6238C15.7223 11.4973 15.6412 11.3837 15.5397 11.29Z"
                                 fill="black"
                              />
                           </svg>
                        </div>

                        <svg
                           width="1"
                           height="16"
                           viewBox="0 0 1 16"
                           fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                           <path d="M0.5 0V15.5" stroke="#5D5D5D" />
                        </svg>
                        <div className="sort-filter">
                           <SortResultFilter
                              filterDispatcher={() => {
                                 console.log("through sort button");
                                 dispatchRoomResults();
                              }}
                           />
                        </div>
                     </div>
                  </div>
                  <div className="cards-itinerary-wrapper-main">
                     {!loading && noCardShow && (
                        <div
                           className="cards"
                           style={
                              !iternary || isMobail
                                 ? { width: "100%" }
                                 : { width: "42.50vw" }
                           }>
                           {roomCards.map((roomCard) => (
                              <div className="card" key={roomCard.roomTypeId}>
                                 <RoomCard {...roomCard} />
                              </div>
                           ))}
                        </div>
                     )}
                     {!loading && !noCardShow && (
                        <p className="no-rooms-message">
                           <FormattedMessage
                              id="OOPS! No Cards to Show Right now"
                              defaultMessage="OOPS! No Cards to Show Right now"
                              description=""
                           />
                        </p>
                     )}
                     {iternary && !isMobail && !loading && (
                        <div className="itinerary">
                           <Itinerary />
                        </div>
                     )}
                     {loading && (
                        <div className="cards">
                           {/* <Loader /> */}
                           <div className="card">
                              <SkeletonComponent />
                           </div>
                           <div className="card">
                              <SkeletonComponent />
                           </div>
                           <div className="card">
                              <SkeletonComponent />
                           </div>
                        </div>
                     )}
                     {!loading && error && (
                        <SnackbarComponent
                           content={error || "Rooms loaded"}
                           type={error ? "error" : "success"}
                        />
                     )}
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
}
