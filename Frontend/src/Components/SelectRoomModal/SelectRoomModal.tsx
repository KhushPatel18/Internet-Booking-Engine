import { ChangeEvent, useEffect, useRef, useState } from "react";
import { RoomCardType } from "../../Types/RoomResultPage";
import { CarousalStepper } from "../CarousalStepper/CarousalStepper";
import { DealCard } from "../DealCard/DealCard";
import "./SelectRoomModal.scss";
import { useMediaQuery } from "usehooks-ts";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { SnackbarComponent } from "../SnackbarComponent/SnackbarComponent";
import { applyPromo } from "../../redux/PromotionSlice/PromotionSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { DealCardSkeleton } from "../Skaleton/Skaleton";
import { FormattedMessage } from "react-intl";
import FeedBack from "../FeedBack/FeedBack";
export function SelectRoomModal({
   roomCard,
   closeModal,
}: {
   roomCard: RoomCardType;
   closeModal: () => void;
}) {
   const [promoCode, setPromoCode] = useState("");
   const isMobail = useMediaQuery("(max-width :  895px)");
   const promotions = useAppSelector(
      (state) => state.PromotionSliceReducer.promotions
   );
   const amenities = useAppSelector(
      (state) => state.PromotionSliceReducer.amenities
   );
   const standardRateDescription = useAppSelector(
      (state) => state.PromotionSliceReducer.standardRateDescription
   );
   const loading = useAppSelector(
      (state) => state.PromotionSliceReducer.loading
   );

   let error = useAppSelector((state) => state.PromotionSliceReducer.error);

   const start = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.filterStates.startDate
   );
   const end = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.filterStates.endDate
   );
   const [showPositiveSnackbar, setShowPositiveSnackbar] = useState(false);
   const reduxDispatch = useAppDispatch();
   const handleApplyPromoCode = () => {
      if (promoCode.trim() === "") {
         return;
      }
      const differenceInMilliseconds: number = end.getTime() - start.getTime();
      const millisecondsPerDay: number = 1000 * 60 * 60 * 24;
      const differenceInDays: number = Math.floor(
         differenceInMilliseconds / millisecondsPerDay
      );
      reduxDispatch(
         applyPromo({
            promoCode: promoCode,
            roomTypeId: roomCard.roomTypeId,
            minDays: differenceInDays,
         })
      ).then((res) => {
         if (res.type == "PromotionSlice/applyPromo/fulfilled") {
            setShowPositiveSnackbar(true);
         }
         console.log("thunk dispatched for apply button");
         console.log(error);
      });
      setPromoCode("");
   };

   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setPromoCode(e.target.value);
   };

   const handleCloseModal = () => {
      closeModal();
   };

   const dropdownRef = useRef<HTMLDivElement | null>(null);
   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
         ) {
            closeModal();
         }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);

      // Unbind the event listener on component unmount
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [dropdownRef]);

   return (
      <div className="room-modal-container" ref={dropdownRef}>
         <div className="room-name">
            <FormattedMessage
               id={roomCard.roomTypeName}
               defaultMessage=""
               description=""
            />
         </div>
         <button className="close-modal" onClick={handleCloseModal}>
            X
         </button>
         <div className="room-modal-carousal">
            <CarousalStepper
               images={roomCard.carouselImages}
               height="381px"
               transformation={{ height: "675", width: "1200" }}
            />
         </div>
         <div className="room-modal-content-wrapper">
            <div
               className="room-modal-info"
               style={isMobail ? { width: "100%" } : undefined}>
               <div className="room-modal-info-description">
                  <div className="room-card-info-header">
                     <div className="occupancy">
                        <svg
                           width="16"
                           height="16"
                           viewBox="0 0 16 16"
                           fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                           <path
                              d="M10.4733 8.47374C11.1269 7.95951 11.604 7.25436 11.8382 6.45637C12.0723 5.65838 12.0519 4.80725 11.7799 4.02139C11.5078 3.23552 10.9975 2.554 10.32 2.07165C9.64259 1.58929 8.83163 1.33008 8 1.33008C7.16836 1.33008 6.35741 1.58929 5.67995 2.07165C5.0025 2.554 4.49223 3.23552 4.22014 4.02139C3.94805 4.80725 3.92767 5.65838 4.16184 6.45637C4.396 7.25436 4.87307 7.95951 5.52666 8.47374C4.40672 8.92244 3.42952 9.66664 2.69926 10.627C1.969 11.5874 1.51304 12.7279 1.38 13.9271C1.37037 14.0146 1.37808 14.1032 1.40268 14.1878C1.42729 14.2723 1.46831 14.3512 1.52341 14.42C1.63468 14.5587 1.79652 14.6476 1.97333 14.6671C2.15014 14.6865 2.32744 14.6349 2.46621 14.5237C2.60499 14.4124 2.69388 14.2506 2.71333 14.0737C2.85972 12.7705 3.48112 11.5669 4.45881 10.6929C5.4365 9.81892 6.70193 9.33576 8.01333 9.33576C9.32473 9.33576 10.5902 9.81892 11.5679 10.6929C12.5455 11.5669 13.1669 12.7705 13.3133 14.0737C13.3315 14.2376 13.4096 14.3888 13.5327 14.4984C13.6559 14.608 13.8152 14.6681 13.98 14.6671H14.0533C14.2281 14.647 14.3878 14.5586 14.4977 14.4212C14.6076 14.2839 14.6587 14.1086 14.64 13.9337C14.5063 12.7312 14.0479 11.5877 13.3139 10.6259C12.5799 9.66402 11.5979 8.92006 10.4733 8.47374ZM8 8.00041C7.47258 8.00041 6.95701 7.84401 6.51848 7.55099C6.07995 7.25798 5.73815 6.8415 5.53632 6.35423C5.33449 5.86696 5.28168 5.33078 5.38457 4.8135C5.48746 4.29622 5.74144 3.82106 6.11438 3.44812C6.48732 3.07518 6.96247 2.82121 7.47976 2.71831C7.99704 2.61542 8.53322 2.66823 9.02049 2.87006C9.50776 3.0719 9.92423 3.41369 10.2173 3.85222C10.5103 4.29075 10.6667 4.80633 10.6667 5.33374C10.6667 6.04099 10.3857 6.71926 9.88562 7.21936C9.38552 7.71946 8.70724 8.00041 8 8.00041Z"
                              fill="#858685"
                           />
                        </svg>
                        <p className="occupancy-value">
                           1-{roomCard.maxCapacity}
                        </p>
                     </div>
                     <div className="beds">
                        <svg
                           width="16"
                           height="16"
                           viewBox="0 0 16 16"
                           fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                           <path
                              d="M13.3334 2.33301H2.66675C2.13631 2.33301 1.62761 2.54372 1.25253 2.91879C0.877462 3.29387 0.666748 3.80257 0.666748 4.33301V12.9997C0.666748 13.1765 0.736986 13.3461 0.86201 13.4711C0.987034 13.5961 1.1566 13.6663 1.33341 13.6663H4.00008C4.10989 13.6658 4.21785 13.6381 4.31438 13.5858C4.41091 13.5334 4.49302 13.458 4.55341 13.3663L5.69341 11.6663H10.3067L11.4467 13.3663C11.5071 13.458 11.5892 13.5334 11.6858 13.5858C11.7823 13.6381 11.8903 13.6658 12.0001 13.6663H14.6667C14.8436 13.6663 15.0131 13.5961 15.1382 13.4711C15.2632 13.3461 15.3334 13.1765 15.3334 12.9997V4.33301C15.3334 3.80257 15.1227 3.29387 14.7476 2.91879C14.3726 2.54372 13.8638 2.33301 13.3334 2.33301ZM14.0001 12.333H12.3601L11.2201 10.6663C11.1637 10.5684 11.0833 10.4865 10.9865 10.4282C10.8897 10.3699 10.7797 10.3371 10.6667 10.333H5.33341C5.22361 10.3336 5.11565 10.3613 5.01911 10.4136C4.92258 10.4659 4.84047 10.5413 4.78008 10.633L3.64008 12.333H2.00008V8.99967H14.0001V12.333ZM4.66675 7.66634V6.99967C4.66675 6.82286 4.73699 6.65329 4.86201 6.52827C4.98703 6.40325 5.1566 6.33301 5.33341 6.33301H6.66675C6.84356 6.33301 7.01313 6.40325 7.13815 6.52827C7.26318 6.65329 7.33341 6.82286 7.33341 6.99967V7.66634H4.66675ZM8.66675 7.66634V6.99967C8.66675 6.82286 8.73699 6.65329 8.86201 6.52827C8.98703 6.40325 9.1566 6.33301 9.33341 6.33301H10.6667C10.8436 6.33301 11.0131 6.40325 11.1382 6.52827C11.2632 6.65329 11.3334 6.82286 11.3334 6.99967V7.66634H8.66675ZM14.0001 7.66634H12.6667V6.99967C12.6667 6.46924 12.456 5.96053 12.081 5.58546C11.7059 5.21039 11.1972 4.99967 10.6667 4.99967H9.33341C8.84004 5.00261 8.36517 5.18781 8.00008 5.51967C7.63499 5.18781 7.16012 5.00261 6.66675 4.99967H5.33341C4.80298 4.99967 4.29427 5.21039 3.9192 5.58546C3.54413 5.96053 3.33341 6.46924 3.33341 6.99967V7.66634H2.00008V4.33301C2.00008 4.1562 2.07032 3.98663 2.19534 3.8616C2.32037 3.73658 2.48994 3.66634 2.66675 3.66634H13.3334C13.5102 3.66634 13.6798 3.73658 13.8048 3.8616C13.9298 3.98663 14.0001 4.1562 14.0001 4.33301V7.66634Z"
                              fill="#5D5D5D"
                           />
                        </svg>
                        {roomCard.doubleBeds > 0 && (
                           <div className="bed-value">
                              {roomCard.doubleBeds}{" "}
                              <FormattedMessage
                                 id="double beds"
                                 defaultMessage="double beds"
                                 description=""
                              />{" "}
                           </div>
                        )}
                        {roomCard.singleBeds > 0 && (
                           <div className="bed-value">
                              {roomCard.singleBeds}{" "}
                              <FormattedMessage
                                 id="single beds"
                                 defaultMessage="single beds"
                                 description=""
                              />{" "}
                           </div>
                        )}
                     </div>
                     <p className="area-value">
                        {roomCard.area}
                        {"  "}ft
                     </p>
                  </div>
                  <div className="room-model-description">
                     {loading ? (
                        <Skeleton count={3} style={{ marginBottom: "6px" }} />
                     ) : (
                        <FormattedMessage
                           id={"description-" + roomCard.roomTypeId}
                           description=""
                        />
                     )}
                  </div>
                  {isMobail && (
                     <div
                        className="room-modal-info-amenities"
                        style={{ marginTop: "20px" }}>
                        <div className="amenity-title">Amenities</div>
                        <div className="amenities">
                           {amenities.map((amenity) => (
                              <div className="amenity" key={amenity}>
                                 <svg
                                    width="19"
                                    height="19"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_5027_1809)">
                                       <path
                                          d="M11.4812 6.25551C11.4846 6.44981 11.4125 6.63785 11.28 6.78003L7.78 10.28C7.63937 10.4205 7.44875 10.4994 7.25 10.4994C7.05125 10.4994 6.86062 10.4205 6.72 10.28L4.72 8.28003C4.58752 8.13785 4.5154 7.94981 4.51882 7.75551C4.52225 7.56121 4.60096 7.37582 4.73838 7.23841C4.87579 7.10099 5.06118 7.02228 5.25548 7.01885C5.44978 7.01543 5.63782 7.08755 5.78 7.22003L7.25 8.69003L10.22 5.72003C10.3622 5.58755 10.5502 5.51543 10.7445 5.51885C10.9388 5.52228 11.1242 5.60099 11.2616 5.73841C11.399 5.87582 11.4777 6.06121 11.4812 6.25551Z"
                                          fill="#2F2F2F"
                                       />
                                       <path
                                          fill-rule="evenodd"
                                          clip-rule="evenodd"
                                          d="M13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569ZM12.5962 12.5962C13.8152 11.3772 14.5 9.72391 14.5 8C14.5 6.27609 13.8152 4.62279 12.5962 3.40381C11.3772 2.18482 9.72391 1.5 8 1.5C6.27609 1.5 4.62279 2.18482 3.40381 3.40381C2.18482 4.62279 1.5 6.27609 1.5 8C1.5 9.72391 2.18482 11.3772 3.40381 12.5962C4.62279 13.8152 6.27609 14.5 8 14.5C9.72391 14.5 11.3772 13.8152 12.5962 12.5962Z"
                                          fill="#2F2F2F"
                                       />
                                    </g>
                                    <defs>
                                       <clipPath id="clip0_5027_1809">
                                          <rect
                                             width="16"
                                             height="16"
                                             fill="white"
                                          />
                                       </clipPath>
                                    </defs>
                                 </svg>
                                 <p className="amenity-text">
                                    <FormattedMessage
                                       id={amenity}
                                       description=""
                                    />
                                 </p>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
               <div className="room-modal-deals-container">
                  <div className="room-modal-deals-title">
                     <FormattedMessage
                        id="Standard Rate"
                        description="Standard Rate"
                     />
                  </div>
                  <div className="deal-card" style={{ marginBottom: "32px" }}>
                     {!loading ? (
                        <DealCard
                           title={"Standard Rate"}
                           description={standardRateDescription}
                           price={roomCard.averageRoomRate}
                           priceFactor={1}
                           roomTypeId={roomCard.roomTypeId}
                           startDate={start}
                           endDate={end}
                           roomTypeName={roomCard.roomTypeName}
                           image={
                              roomCard.carouselImages.length > 0
                                 ? roomCard.carouselImages[0]
                                 : "room-defualt.jpg"
                           }
                        />
                     ) : (
                        <DealCardSkeleton />
                     )}
                  </div>
                  <div className="room-modal-deals-title">
                     <FormattedMessage
                        id="Deals & Packages"
                        description="Deals & Packages"
                     />
                  </div>
                  <div className="deals-wrapper">
                     {!loading &&
                        promotions.map((promotion) => (
                           <div
                              className="deal-card"
                              key={promotion.promotion_id}>
                              <DealCard
                                 title={promotion.promotion_title}
                                 description={promotion.promotion_description}
                                 price={roomCard.averageRoomRate}
                                 priceFactor={promotion.price_factor}
                                 roomTypeId={roomCard.roomTypeId}
                                 startDate={start}
                                 endDate={end}
                                 roomTypeName={roomCard.roomTypeName}
                                 image={
                                    roomCard.carouselImages.length > 0
                                       ? roomCard.carouselImages[0]
                                       : "room-defualt.jpg"
                                 }
                              />
                           </div>
                        ))}
                     {loading && (
                        <div
                           style={{
                              marginBottom: "10px",
                              width: "100%",
                              height: "45vh",
                           }}>
                           <DealCardSkeleton />
                           <DealCardSkeleton />
                           <DealCardSkeleton />
                        </div>
                     )}
                  </div>
               </div>
               <div className="promo-code-wrapper">
                  <div className="promo-text">
                     <FormattedMessage
                        id="Enter a promo code"
                        description="Enter a promo code"
                     />
                  </div>
                  <div className="promo-code">
                     <input
                        type="text"
                        name="promo"
                        value={promoCode}
                        onChange={(e) => handleChange(e)}
                        className="promo-code-input"
                        placeholder="e.g. HOLI24"
                     />
                     <button
                        disabled={promoCode.trim() === ""}
                        className="apply-btn"
                        style={
                           promoCode.trim() === ""
                              ? { opacity: "0.5", cursor: "not-allowed" }
                              : undefined
                        }
                        onClick={handleApplyPromoCode}>
                        <FormattedMessage id="APPLY" description="APPLY" />
                     </button>
                  </div>
               </div>
               {isMobail && <FeedBack roomTypeId={roomCard.roomTypeId} />}
            </div>
            {!isMobail && (
               <div className="room-modal-info-amenities">
                  <div className="amenity-title">
                     <FormattedMessage id="Amenities" description="Amenities" />
                  </div>
                  <div className="amenities">
                     {amenities.map((amenity) => (
                        <div className="amenity" key={amenity}>
                           <svg
                              width="19"
                              height="19"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg">
                              <g clip-path="url(#clip0_5027_1809)">
                                 <path
                                    d="M11.4812 6.25551C11.4846 6.44981 11.4125 6.63785 11.28 6.78003L7.78 10.28C7.63937 10.4205 7.44875 10.4994 7.25 10.4994C7.05125 10.4994 6.86062 10.4205 6.72 10.28L4.72 8.28003C4.58752 8.13785 4.5154 7.94981 4.51882 7.75551C4.52225 7.56121 4.60096 7.37582 4.73838 7.23841C4.87579 7.10099 5.06118 7.02228 5.25548 7.01885C5.44978 7.01543 5.63782 7.08755 5.78 7.22003L7.25 8.69003L10.22 5.72003C10.3622 5.58755 10.5502 5.51543 10.7445 5.51885C10.9388 5.52228 11.1242 5.60099 11.2616 5.73841C11.399 5.87582 11.4777 6.06121 11.4812 6.25551Z"
                                    fill="#2F2F2F"
                                 />
                                 <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569ZM12.5962 12.5962C13.8152 11.3772 14.5 9.72391 14.5 8C14.5 6.27609 13.8152 4.62279 12.5962 3.40381C11.3772 2.18482 9.72391 1.5 8 1.5C6.27609 1.5 4.62279 2.18482 3.40381 3.40381C2.18482 4.62279 1.5 6.27609 1.5 8C1.5 9.72391 2.18482 11.3772 3.40381 12.5962C4.62279 13.8152 6.27609 14.5 8 14.5C9.72391 14.5 11.3772 13.8152 12.5962 12.5962Z"
                                    fill="#2F2F2F"
                                 />
                              </g>
                              <defs>
                                 <clipPath id="clip0_5027_1809">
                                    <rect width="16" height="16" fill="white" />
                                 </clipPath>
                              </defs>
                           </svg>
                           <p className="amenity-text">
                              <FormattedMessage id={amenity} description="" />
                           </p>
                        </div>
                     ))}
                  </div>
                  <FeedBack roomTypeId={roomCard.roomTypeId} />
               </div>
            )}
            {!loading && error && (
               <SnackbarComponent
                  modify={true}
                  content={error}
                  type={"error"}
               />
            )}
            {showPositiveSnackbar && (
               <SnackbarComponent
                  modify={true}
                  content={"Promotion Added Successfully At the end"}
                  type={"success"}
               />
            )}
         </div>
      </div>
   );
}
