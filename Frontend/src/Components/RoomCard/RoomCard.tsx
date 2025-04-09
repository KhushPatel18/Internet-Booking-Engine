import { FormattedMessage, FormattedNumber } from "react-intl";
import { RoomCardType } from "../../Types/RoomResultPage";
import { CarousalStepper } from "../CarousalStepper/CarousalStepper";
import "./RoomCard.scss";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { SelectRoomModal } from "../SelectRoomModal/SelectRoomModal";
import { useEffect, useRef } from "react";
import { fetchDeals } from "../../redux/PromotionSlice/PromotionSlice";
import { embedLinks } from "../../Util/GeneralUtils";
export function RoomCard(roomCard: RoomCardType) {
   const {
      roomTypeName,
      rating,
      review,
      maxCapacity,
      singleBeds,
      doubleBeds,
      area,
      averageRoomRate,
      carouselImages,
      bestPromotion,
   } = roomCard;
   const modalRef = useRef<HTMLDialogElement | null>(null);
   const closeModal = () => {
      if (modalRef.current) {
         modalRef.current.close();
      }
   };
   const threeSixtyModalRef = useRef<HTMLDialogElement | null>(null);
   const start = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.filterStates.startDate
   );
   const end = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.filterStates.endDate
   );
   const reduxDispatch = useAppDispatch();

   const exchangeRate = useAppSelector(
      (state) => state.LanguageReducer.exchangeRate
   );
   const selectedCurrency = useAppSelector(
      (state) => state.LanguageReducer.selectedCurrency
   );
   const handleOpenModel = () => {
      reduxDispatch(
         fetchDeals({
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            roomTypeId: roomCard.roomTypeId,
         })
      );
      if (modalRef.current) {
         modalRef.current.showModal();
      }
   };

   const dropdownRef = useRef<HTMLIFrameElement | null>(null);
   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            threeSixtyModalRef.current
         ) {
            threeSixtyModalRef.current.close();
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
      <div className="room-card-container">
         <div className="carousal-stepper">
            <CarousalStepper
               images={carouselImages}
               height="145px"
               transformation={{ height: "145", width: "293" }}
            />
         </div>
         <div className="title-review-ratings-wrapper">
            <div className="title-wrapper">
               <h2 className="resort-name">
                  <FormattedMessage
                     id={roomTypeName}
                     defaultMessage="ratings"
                     description=""
                  />
               </h2>
            </div>
            {rating && review ? (
               <div className="review-ratings-wrapper">
                  <div className="rating">
                     <svg
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                           d="M8.24958 1.72581L8.51707 2.14824C8.54234 2.13224 8.57108 2.12402 8.60004 2.12402C8.629 2.12402 8.65774 2.13224 8.683 2.14824C8.70832 2.16427 8.72936 2.18765 8.74307 2.21624L8.74306 2.21625L8.74462 2.21946L10.4273 5.66612L10.543 5.90299L10.8038 5.94142L14.5585 6.49475L14.5734 6.49695L14.5883 6.49824C14.6181 6.50081 14.647 6.51207 14.6715 6.53133C14.6915 6.54708 14.7079 6.56772 14.7191 6.59174C14.723 6.61766 14.7211 6.64427 14.7133 6.66938C14.7037 6.70022 14.6859 6.72697 14.6626 6.7469L14.65 6.75774L14.6381 6.76938L11.9127 9.43605L11.7247 9.62006L11.7698 9.87927L12.4297 13.6659L12.4297 13.6659L12.4309 13.6727C12.437 13.7049 12.4338 13.7382 12.4219 13.7683C12.4099 13.7985 12.39 13.8237 12.3652 13.8417L12.3632 13.8432C12.3358 13.8632 12.3034 13.8736 12.2708 13.8734L12.2674 13.8734C12.2486 13.8735 12.2299 13.8687 12.213 13.859L12.2065 13.8553L12.1999 13.8518L8.83449 12.0651L8.60093 11.9411L8.36698 12.0644L4.98836 13.8444L4.98836 13.8444L4.98533 13.846C4.95943 13.8599 4.93061 13.866 4.90201 13.8641C4.87339 13.8622 4.84543 13.8522 4.82129 13.8348L4.52853 14.2401C4.42616 14.166 4.3469 14.0639 4.30013 13.9457C4.25336 13.8276 4.24102 13.6984 4.26458 13.5734L4.92447 9.78676L2.19913 7.1201M8.24958 1.72581L4.82167 13.835C4.79685 13.8171 4.77694 13.7918 4.76502 13.7617C4.75307 13.7315 4.74986 13.6983 4.75593 13.666L4.75597 13.6661L4.75716 13.6593L5.41704 9.8726L5.46221 9.6134L5.27415 9.42939L2.55239 6.76621M8.24958 1.72581L8.51707 2.14824C8.49176 2.16427 8.47072 2.18765 8.45701 2.21624L8.4553 2.21981L8.45528 2.2198L6.77257 5.6598L6.6571 5.89586L6.39718 5.93463L2.64243 6.49463L2.63974 6.49503L2.63974 6.49502C2.61114 6.49913 2.58369 6.51132 2.56065 6.53086C2.53869 6.54948 2.52152 6.57415 2.51147 6.60262L8.24958 1.72581ZM2.19913 7.1201L2.55412 6.76799C2.55354 6.7674 2.55296 6.76681 2.55239 6.76621M2.19913 7.1201C2.11431 7.03458 2.05414 6.92734 2.02507 6.80989C1.99601 6.69244 1.99915 6.56921 2.03416 6.45343L2.55239 6.76621M2.19913 7.1201L2.54882 6.76272L2.55239 6.76621M11.4901 9.47104L11.4901 9.47108L11.4954 9.46576L13.475 7.47243L14.1737 6.76897L13.1927 6.62537L10.4146 6.2187L10.4146 6.21869L10.4117 6.2183C10.3867 6.21477 10.3625 6.20505 10.3413 6.18957C10.3201 6.17406 10.3024 6.15316 10.2904 6.12834L10.2901 6.12779L9.04954 3.58113L8.58829 2.63427L8.14621 3.59023L6.97426 6.12452C6.96226 6.14809 6.94518 6.16799 6.92478 6.1829C6.9036 6.19839 6.8794 6.20811 6.85435 6.21163L6.85434 6.21162L6.85151 6.21204L4.07338 6.6187L3.09443 6.762L3.79044 7.46517L5.77011 9.46517L5.77006 9.46522L5.77601 9.47104C5.79505 9.48964 5.80971 9.51309 5.81824 9.53956L6.29411 9.38608L5.81824 9.53956C5.82679 9.56604 5.82882 9.59439 5.82406 9.622L5.82391 9.62292L5.34879 12.4163L5.17725 13.4248L6.07839 12.9405L8.55957 11.6072L8.55976 11.6071C8.5826 11.5948 8.60774 11.5885 8.63303 11.5885C8.65832 11.5885 8.68347 11.5948 8.7063 11.6071L8.7065 11.6072L11.1877 12.9405L12.0888 13.4248L11.9173 12.4163L11.4422 9.62292L11.442 9.622C11.4372 9.59439 11.4393 9.56604 11.4478 9.53956L10.972 9.38608L11.4478 9.53956C11.4564 9.51309 11.471 9.48965 11.4901 9.47104Z"
                           fill="#26266D"
                           stroke="#26266D"
                        />
                        <path
                           d="M7.01641 6.47706L8.60014 3.33301L10.1839 6.47706L13.8792 7.00106L11.2397 9.62111L11.7676 13.2892L8.60014 11.7171C7.72029 12.2411 5.85501 12.87 5.43268 13.2892C5.01036 13.7084 5.60865 11.0185 5.96059 9.62111L3.32104 7.00106L7.01641 6.47706Z"
                           fill="#26266D"
                        />
                     </svg>
                     <div className="rating-value">
                        {rating.toFixed(1)}{" "}
                        <FormattedMessage
                           id="ratings"
                           defaultMessage="ratings"
                           description=""
                        />
                     </div>
                  </div>
                  <div className="reviews">
                     {review}{" "}
                     <FormattedMessage
                        id="reviews"
                        defaultMessage="reviews"
                        description=""
                     />
                  </div>
               </div>
            ) : (
               <svg
                  style={{ marginBottom: "12px" }}
                  width="99"
                  height="23"
                  viewBox="0 0 99 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <rect
                     opacity="0.3"
                     width="99"
                     height="23"
                     rx="5"
                     fill="#5757C4"
                  />
                  <path
                     d="M8.918 6.969C9.03933 6.969 9.128 6.98533 9.184 7.018C9.24467 7.046 9.31233 7.10667 9.387 7.2L15.197 14.76C15.183 14.6387 15.1737 14.522 15.169 14.41C15.1643 14.2933 15.162 14.1813 15.162 14.074V6.969H16.352V17H15.666C15.5587 17 15.4677 16.9813 15.393 16.944C15.323 16.9067 15.253 16.8437 15.183 16.755L9.38 9.202C9.38933 9.31867 9.39633 9.433 9.401 9.545C9.40567 9.657 9.408 9.75967 9.408 9.853V17H8.218V6.969H8.918ZM21.411 9.797C21.8357 9.797 22.2277 9.86933 22.587 10.014C22.9464 10.154 23.2567 10.3593 23.518 10.63C23.7794 10.896 23.9824 11.2273 24.127 11.624C24.2764 12.016 24.351 12.464 24.351 12.968C24.351 13.164 24.33 13.2947 24.288 13.36C24.246 13.4253 24.1667 13.458 24.05 13.458H19.332C19.3414 13.906 19.402 14.2957 19.514 14.627C19.626 14.9583 19.78 15.236 19.976 15.46C20.172 15.6793 20.4054 15.845 20.676 15.957C20.9467 16.0643 21.25 16.118 21.586 16.118C21.8987 16.118 22.167 16.083 22.391 16.013C22.6197 15.9383 22.8157 15.859 22.979 15.775C23.1424 15.691 23.2777 15.614 23.385 15.544C23.497 15.4693 23.5927 15.432 23.672 15.432C23.7747 15.432 23.854 15.4717 23.91 15.551L24.26 16.006C24.106 16.1927 23.9217 16.356 23.707 16.496C23.4924 16.6313 23.2614 16.7433 23.014 16.832C22.7714 16.9207 22.5194 16.986 22.258 17.028C21.9967 17.0747 21.7377 17.098 21.481 17.098C20.991 17.098 20.5384 17.0163 20.123 16.853C19.7124 16.685 19.3554 16.4423 19.052 16.125C18.7534 15.803 18.52 15.4063 18.352 14.935C18.184 14.4637 18.1 13.9223 18.1 13.311C18.1 12.8163 18.1747 12.3543 18.324 11.925C18.478 11.4957 18.6974 11.1247 18.982 10.812C19.2667 10.4947 19.6144 10.2473 20.025 10.07C20.4357 9.888 20.8977 9.797 21.411 9.797ZM21.439 10.714C20.837 10.714 20.3634 10.889 20.018 11.239C19.6727 11.5843 19.458 12.065 19.374 12.681H23.231C23.231 12.3917 23.1914 12.128 23.112 11.89C23.0327 11.6473 22.916 11.4397 22.762 11.267C22.608 11.0897 22.419 10.9543 22.195 10.861C21.9757 10.763 21.7237 10.714 21.439 10.714ZM25.0218 9.909H26.0018C26.1045 9.909 26.1885 9.93467 26.2538 9.986C26.3192 10.0373 26.3635 10.098 26.3868 10.168L27.7448 14.732C27.7822 14.9 27.8172 15.0633 27.8498 15.222C27.8825 15.376 27.9105 15.5323 27.9338 15.691C27.9712 15.5323 28.0132 15.376 28.0598 15.222C28.1065 15.0633 28.1555 14.9 28.2068 14.732L29.7048 10.14C29.7282 10.07 29.7678 10.0117 29.8238 9.965C29.8845 9.91833 29.9592 9.895 30.0478 9.895H30.5868C30.6802 9.895 30.7572 9.91833 30.8178 9.965C30.8785 10.0117 30.9205 10.07 30.9438 10.14L32.4068 14.732C32.4582 14.8953 32.5025 15.0563 32.5398 15.215C32.5818 15.3737 32.6215 15.53 32.6588 15.684C32.6822 15.53 32.7125 15.369 32.7498 15.201C32.7872 15.033 32.8268 14.8767 32.8688 14.732L34.2548 10.168C34.2782 10.0933 34.3225 10.0327 34.3878 9.986C34.4532 9.93467 34.5302 9.909 34.6188 9.909H35.5568L33.2608 17H32.2738C32.1525 17 32.0685 16.9207 32.0218 16.762L30.4538 11.953C30.4165 11.8457 30.3862 11.7383 30.3628 11.631C30.3395 11.519 30.3162 11.4093 30.2928 11.302C30.2695 11.4093 30.2462 11.519 30.2228 11.631C30.1995 11.743 30.1692 11.8527 30.1318 11.96L28.5428 16.762C28.4915 16.9207 28.3958 17 28.2558 17H27.3178L25.0218 9.909ZM39.3716 19.401V9.909H40.1136C40.2909 9.909 40.4029 9.99533 40.4496 10.168L40.5546 11.008C40.8579 10.6393 41.2033 10.343 41.5906 10.119C41.9826 9.895 42.4329 9.783 42.9416 9.783C43.3476 9.783 43.7163 9.86233 44.0476 10.021C44.3789 10.175 44.6613 10.406 44.8946 10.714C45.1279 11.0173 45.3076 11.3953 45.4336 11.848C45.5596 12.3007 45.6226 12.821 45.6226 13.409C45.6226 13.9317 45.5526 14.4193 45.4126 14.872C45.2726 15.32 45.0719 15.7097 44.8106 16.041C44.5493 16.3677 44.2273 16.6267 43.8446 16.818C43.4666 17.0047 43.0396 17.098 42.5636 17.098C42.1249 17.098 41.7493 17.0257 41.4366 16.881C41.1286 16.7363 40.8556 16.531 40.6176 16.265V19.401H39.3716ZM42.5286 10.791C42.1226 10.791 41.7656 10.8843 41.4576 11.071C41.1543 11.2577 40.8743 11.5213 40.6176 11.862V15.292C40.8463 15.6 41.0959 15.817 41.3666 15.943C41.6419 16.069 41.9476 16.132 42.2836 16.132C42.9416 16.132 43.4479 15.8963 43.8026 15.425C44.1573 14.9537 44.3346 14.2817 44.3346 13.409C44.3346 12.947 44.2926 12.5503 44.2086 12.219C44.1293 11.8877 44.0126 11.617 43.8586 11.407C43.7046 11.1923 43.5156 11.036 43.2916 10.938C43.0676 10.84 42.8133 10.791 42.5286 10.791ZM47.0962 17V9.909H47.8102C47.9456 9.909 48.0389 9.93467 48.0902 9.986C48.1416 10.0373 48.1766 10.126 48.1952 10.252L48.2792 11.358C48.5219 10.8633 48.8206 10.4783 49.1752 10.203C49.5346 9.923 49.9546 9.783 50.4352 9.783C50.6312 9.783 50.8086 9.80633 50.9672 9.853C51.1259 9.895 51.2729 9.95567 51.4082 10.035L51.2472 10.966C51.2146 11.0827 51.1422 11.141 51.0302 11.141C50.9649 11.141 50.8646 11.12 50.7292 11.078C50.5939 11.0313 50.4049 11.008 50.1622 11.008C49.7282 11.008 49.3642 11.134 49.0702 11.386C48.7809 11.638 48.5382 12.0043 48.3422 12.485V17H47.0962ZM55.6127 9.797C56.1307 9.797 56.5974 9.88333 57.0127 10.056C57.4327 10.2287 57.7874 10.4737 58.0767 10.791C58.3707 11.1083 58.5947 11.4933 58.7487 11.946C58.9074 12.394 58.9867 12.8957 58.9867 13.451C58.9867 14.011 58.9074 14.515 58.7487 14.963C58.5947 15.411 58.3707 15.7937 58.0767 16.111C57.7874 16.4283 57.4327 16.6733 57.0127 16.846C56.5974 17.014 56.1307 17.098 55.6127 17.098C55.0947 17.098 54.6257 17.014 54.2057 16.846C53.7904 16.6733 53.4357 16.4283 53.1417 16.111C52.8477 15.7937 52.6214 15.411 52.4627 14.963C52.304 14.515 52.2247 14.011 52.2247 13.451C52.2247 12.8957 52.304 12.394 52.4627 11.946C52.6214 11.4933 52.8477 11.1083 53.1417 10.791C53.4357 10.4737 53.7904 10.2287 54.2057 10.056C54.6257 9.88333 55.0947 9.797 55.6127 9.797ZM55.6127 16.125C56.3127 16.125 56.8354 15.8917 57.1807 15.425C57.526 14.9537 57.6987 14.298 57.6987 13.458C57.6987 12.6133 57.526 11.9553 57.1807 11.484C56.8354 11.0127 56.3127 10.777 55.6127 10.777C55.258 10.777 54.95 10.8377 54.6887 10.959C54.4274 11.0803 54.208 11.2553 54.0307 11.484C53.858 11.7127 53.7274 11.995 53.6387 12.331C53.5547 12.6623 53.5127 13.038 53.5127 13.458C53.5127 13.878 53.5547 14.2537 53.6387 14.585C53.7274 14.9163 53.858 15.1963 54.0307 15.425C54.208 15.649 54.4274 15.8217 54.6887 15.943C54.95 16.0643 55.258 16.125 55.6127 16.125ZM60.522 19.401V9.909H61.264C61.4413 9.909 61.5533 9.99533 61.6 10.168L61.705 11.008C62.0083 10.6393 62.3537 10.343 62.741 10.119C63.133 9.895 63.5833 9.783 64.092 9.783C64.498 9.783 64.8667 9.86233 65.198 10.021C65.5293 10.175 65.8117 10.406 66.045 10.714C66.2783 11.0173 66.458 11.3953 66.584 11.848C66.71 12.3007 66.773 12.821 66.773 13.409C66.773 13.9317 66.703 14.4193 66.563 14.872C66.423 15.32 66.2223 15.7097 65.961 16.041C65.6997 16.3677 65.3777 16.6267 64.995 16.818C64.617 17.0047 64.19 17.098 63.714 17.098C63.2753 17.098 62.8997 17.0257 62.587 16.881C62.279 16.7363 62.006 16.531 61.768 16.265V19.401H60.522ZM63.679 10.791C63.273 10.791 62.916 10.8843 62.608 11.071C62.3047 11.2577 62.0247 11.5213 61.768 11.862V15.292C61.9967 15.6 62.2463 15.817 62.517 15.943C62.7923 16.069 63.098 16.132 63.434 16.132C64.092 16.132 64.5983 15.8963 64.953 15.425C65.3077 14.9537 65.485 14.2817 65.485 13.409C65.485 12.947 65.443 12.5503 65.359 12.219C65.2797 11.8877 65.163 11.617 65.009 11.407C64.855 11.1923 64.666 11.036 64.442 10.938C64.218 10.84 63.9637 10.791 63.679 10.791ZM71.0536 9.797C71.4783 9.797 71.8703 9.86933 72.2296 10.014C72.5889 10.154 72.8993 10.3593 73.1606 10.63C73.4219 10.896 73.6249 11.2273 73.7696 11.624C73.9189 12.016 73.9936 12.464 73.9936 12.968C73.9936 13.164 73.9726 13.2947 73.9306 13.36C73.8886 13.4253 73.8093 13.458 73.6926 13.458H68.9746C68.9839 13.906 69.0446 14.2957 69.1566 14.627C69.2686 14.9583 69.4226 15.236 69.6186 15.46C69.8146 15.6793 70.0479 15.845 70.3186 15.957C70.5893 16.0643 70.8926 16.118 71.2286 16.118C71.5413 16.118 71.8096 16.083 72.0336 16.013C72.2623 15.9383 72.4583 15.859 72.6216 15.775C72.7849 15.691 72.9203 15.614 73.0276 15.544C73.1396 15.4693 73.2353 15.432 73.3146 15.432C73.4173 15.432 73.4966 15.4717 73.5526 15.551L73.9026 16.006C73.7486 16.1927 73.5643 16.356 73.3496 16.496C73.1349 16.6313 72.9039 16.7433 72.6566 16.832C72.4139 16.9207 72.1619 16.986 71.9006 17.028C71.6393 17.0747 71.3803 17.098 71.1236 17.098C70.6336 17.098 70.1809 17.0163 69.7656 16.853C69.3549 16.685 68.9979 16.4423 68.6946 16.125C68.3959 15.803 68.1626 15.4063 67.9946 14.935C67.8266 14.4637 67.7426 13.9223 67.7426 13.311C67.7426 12.8163 67.8173 12.3543 67.9666 11.925C68.1206 11.4957 68.3399 11.1247 68.6246 10.812C68.9093 10.4947 69.2569 10.2473 69.6676 10.07C70.0783 9.888 70.5403 9.797 71.0536 9.797ZM71.0816 10.714C70.4796 10.714 70.0059 10.889 69.6606 11.239C69.3153 11.5843 69.1006 12.065 69.0166 12.681H72.8736C72.8736 12.3917 72.8339 12.128 72.7546 11.89C72.6753 11.6473 72.5586 11.4397 72.4046 11.267C72.2506 11.0897 72.0616 10.9543 71.8376 10.861C71.6183 10.763 71.3663 10.714 71.0816 10.714ZM75.5884 17V9.909H76.3024C76.4377 9.909 76.5311 9.93467 76.5824 9.986C76.6337 10.0373 76.6687 10.126 76.6874 10.252L76.7714 11.358C77.0141 10.8633 77.3127 10.4783 77.6674 10.203C78.0267 9.923 78.4467 9.783 78.9274 9.783C79.1234 9.783 79.3007 9.80633 79.4594 9.853C79.6181 9.895 79.7651 9.95567 79.9004 10.035L79.7394 10.966C79.7067 11.0827 79.6344 11.141 79.5224 11.141C79.4571 11.141 79.3567 11.12 79.2214 11.078C79.0861 11.0313 78.8971 11.008 78.6544 11.008C78.2204 11.008 77.8564 11.134 77.5624 11.386C77.2731 11.638 77.0304 12.0043 76.8344 12.485V17H75.5884ZM83.3839 17.112C82.8239 17.112 82.3922 16.9557 82.0889 16.643C81.7902 16.3303 81.6409 15.88 81.6409 15.292V10.952H80.7869C80.7122 10.952 80.6492 10.931 80.5979 10.889C80.5466 10.8423 80.5209 10.7723 80.5209 10.679V10.182L81.6829 10.035L81.9699 7.844C81.9792 7.774 82.0096 7.718 82.0609 7.676C82.1122 7.62933 82.1776 7.606 82.2569 7.606H82.8869V10.049H84.9169V10.952H82.8869V15.208C82.8869 15.5067 82.9592 15.7283 83.1039 15.873C83.2486 16.0177 83.4352 16.09 83.6639 16.09C83.7946 16.09 83.9066 16.0737 83.9999 16.041C84.0979 16.0037 84.1819 15.964 84.2519 15.922C84.3219 15.88 84.3802 15.8427 84.4269 15.81C84.4782 15.7727 84.5226 15.754 84.5599 15.754C84.6252 15.754 84.6836 15.7937 84.7349 15.873L85.0989 16.468C84.8842 16.6687 84.6252 16.8273 84.3219 16.944C84.0186 17.056 83.7059 17.112 83.3839 17.112ZM88.5365 19.093C88.4945 19.1863 88.4409 19.261 88.3755 19.317C88.3149 19.373 88.2192 19.401 88.0885 19.401H87.1645L88.4595 16.587L85.5335 9.909H86.6115C86.7189 9.909 86.8029 9.937 86.8635 9.993C86.9242 10.0443 86.9685 10.1027 86.9965 10.168L88.8935 14.634C88.9355 14.7367 88.9705 14.8393 88.9985 14.942C89.0312 15.0447 89.0592 15.1497 89.0825 15.257C89.1152 15.1497 89.1479 15.0447 89.1805 14.942C89.2132 14.8393 89.2505 14.7343 89.2925 14.627L91.1335 10.168C91.1615 10.0933 91.2082 10.0327 91.2735 9.986C91.3435 9.93467 91.4182 9.909 91.4975 9.909H92.4915L88.5365 19.093Z"
                     fill="black"
                  />
               </svg>
            )}
         </div>
         <div className="room-details-wrapper">
            <div className="location">
               <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M12.0001 2.98693C10.9392 1.92607 9.50041 1.33008 8.00012 1.33008C6.49982 1.33008 5.06098 1.92607 4.00012 2.98693C2.93925 4.0478 2.34326 5.48664 2.34326 6.98693C2.34326 8.48722 2.93925 9.92607 4.00012 10.9869L7.51345 14.5069C7.57542 14.5694 7.64916 14.619 7.7304 14.6529C7.81164 14.6867 7.89877 14.7041 7.98678 14.7041C8.07479 14.7041 8.16193 14.6867 8.24317 14.6529C8.32441 14.619 8.39814 14.5694 8.46011 14.5069L12.0001 10.9536C13.0565 9.89715 13.65 8.4643 13.65 6.97027C13.65 5.47623 13.0565 4.04338 12.0001 2.98693ZM11.0468 10.0003L8.00012 13.0603L4.95345 10.0003C4.35155 9.39781 3.94177 8.63043 3.77591 7.79513C3.61006 6.95982 3.69557 6.0941 4.02165 5.30739C4.34773 4.52068 4.89973 3.8483 5.60787 3.37525C6.31601 2.9022 7.14851 2.64972 8.00012 2.64972C8.85173 2.64972 9.68422 2.9022 10.3924 3.37525C11.1005 3.8483 11.6525 4.52068 11.9786 5.30739C12.3047 6.0941 12.3902 6.95982 12.2243 7.79513C12.0585 8.63043 11.6487 9.39781 11.0468 10.0003ZM6.00012 4.94027C5.46193 5.48011 5.15971 6.21131 5.15971 6.9736C5.15971 7.73589 5.46193 8.46708 6.00012 9.00693C6.39996 9.40746 6.90917 9.68099 7.46388 9.7932C8.01859 9.90542 8.59408 9.85132 9.11816 9.6377C9.64224 9.42408 10.0916 9.06045 10.4098 8.59243C10.728 8.12441 10.9009 7.57285 10.9068 7.00693C10.9098 6.62907 10.837 6.25444 10.6927 5.90519C10.5484 5.55594 10.3356 5.23917 10.0668 4.9736C9.80256 4.70332 9.4875 4.48796 9.13973 4.33991C8.79196 4.19186 8.41834 4.11405 8.04038 4.11095C7.66242 4.10785 7.28758 4.17953 6.93743 4.32186C6.58728 4.46419 6.26873 4.67435 6.00012 4.94027ZM9.12678 8.06027C8.87414 8.31676 8.54026 8.47754 8.1822 8.5151C7.82414 8.55267 7.46416 8.46469 7.16379 8.26622C6.86342 8.06774 6.64131 7.77109 6.53545 7.42699C6.42959 7.08288 6.44655 6.71269 6.58342 6.3797C6.72029 6.04671 6.96858 5.77161 7.28584 5.60142C7.6031 5.43124 7.96962 5.37654 8.32274 5.44668C8.67586 5.51682 8.99366 5.70744 9.22179 5.98595C9.44992 6.26447 9.57423 6.61358 9.57345 6.9736C9.56375 7.38511 9.39111 7.77595 9.09345 8.06027H9.12678Z"
                     fill="#858685"
                  />
               </svg>
               <div className="location-value">Kickdrum</div>
            </div>
            <div className="area">
               <div className="inclusive">
                  <FormattedMessage
                     id="Inclusive"
                     defaultMessage="Inclusive"
                     description=""
                  />
               </div>
               <div className="area-value">{area} ft</div>
            </div>
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
               {"   "}
               <div className="occupancy-value">1 - {maxCapacity}</div>
            </div>
            <div className="bed-details">
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
               {doubleBeds > 0 && (
                  <div className="bed-value">
                     {doubleBeds}{" "}
                     <FormattedMessage
                        id="double beds"
                        defaultMessage="double beds"
                        description=""
                     />{" "}
                  </div>
               )}
               {singleBeds > 0 && (
                  <div className="bed-value">
                     {singleBeds}{" "}
                     <FormattedMessage
                        id="single beds"
                        defaultMessage="single beds"
                        description=""
                     />{" "}
                  </div>
               )}
            </div>
            {bestPromotion && (
               <div className="special-deal-wrapper">
                  <div className="special-deal">
                     <svg
                        width="121"
                        height="32"
                        viewBox="0 0 121 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                           d="M120.759 0H0V32H120.759L112.775 14.9677L120.759 0Z"
                           fill="#26266D"
                        />
                     </svg>
                     <div className="special-deal-text">
                        <FormattedMessage
                           id="Special deal"
                           defaultMessage="Special deal"
                           description=""
                        />
                     </div>
                  </div>
                  <div className="deal-detail">
                     <FormattedMessage
                        id={bestPromotion.substring(0, 4)}
                        description=""
                        defaultMessage="Save"
                     />
                     {bestPromotion.substring(4, 11)}{" "}
                     <FormattedMessage
                        id={bestPromotion.split("%")[1]}
                        description=""
                     />{" "}
                  </div>
               </div>
            )}
            <div className="room-price">
               <div className="price-value">
                  <FormattedNumber
                     style="currency"
                     value={averageRoomRate * exchangeRate[selectedCurrency]}
                     currency={selectedCurrency}
                     maximumFractionDigits={0}
                  />
               </div>
               <div className="room-price-text">
                  <FormattedMessage
                     id="per night"
                     defaultMessage="per night"
                     description=""
                  />
               </div>
            </div>
            <div
               className="buttons"
               style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
               }}>
               <button
                  className="select-room-btn"
                  id={roomCard.roomTypeId.toString()}
                  onClick={handleOpenModel}>
                  <FormattedMessage
                     id="SELECT ROOM"
                     defaultMessage="SELECT ROOM"
                     description=""
                  />
               </button>
               <button
                  className="open-360-btn"
                  onClick={() => {
                     if (threeSixtyModalRef.current) {
                        threeSixtyModalRef.current.showModal();
                     }
                  }}>
                  <FormattedMessage
                     id="GO 360"
                     defaultMessage="GO 360"
                     description=""
                  />
               </button>
            </div>

            <dialog
               data-modal
               ref={modalRef}
               className="select-room-modal-dialog">
               <SelectRoomModal roomCard={roomCard} closeModal={closeModal} />
            </dialog>
            <dialog
               data-modal
               ref={threeSixtyModalRef}
               className="view-modal-dialog">
               <iframe
                  src={embedLinks[roomTypeName]}
                  ref={dropdownRef}
                  title={roomTypeName}
                  allowFullScreen></iframe>
            </dialog>
         </div>
      </div>
   );
}
