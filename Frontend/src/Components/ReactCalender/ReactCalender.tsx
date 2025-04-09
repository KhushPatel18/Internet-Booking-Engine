import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./ReactCalender.scss";
import { useMediaQuery } from "usehooks-ts";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { FormattedMessage, FormattedNumber } from "react-intl";
import {
   formatDate,
   formatDateForPrice,
   getMinimumPriceInRange,
} from "../../Util/CalenderUtils";
import {
   setEndDate,
   setStartDate,
} from "../../redux/LandingPageConfigSlice/LandingPageConfigSlice";

export interface CalenderProps {
   isRoomResult?: boolean;
   isMobileView?: boolean;
}

export const ReactCalender: React.FC<CalenderProps> = ({
   isRoomResult,
   isMobileView,
}) => {
   const dropdownRef = useRef<HTMLDivElement | null>(null);
   const [isOpen, setIsOpen] = useState(false);
   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
         ) {
            // toggleVisibility('calender');
            setIsOpen(false);
         }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);

      // Unbind the event listener on component unmount
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [dropdownRef]);

   const isMobail = useMediaQuery("(max-width :  1023px)");
   const reduxDispatch = useAppDispatch();
   const startDate = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.filterStates.startDate
   );
   const endDate = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.filterStates.endDate
   );
   const minimumNightlyRate = useAppSelector(
      (state) => state.MinimumNightlyRatesSlice.minimumNightlyRates
   );
   const exchangeRate = useAppSelector(
      (state) => state.LanguageReducer.exchangeRate
   );
   const selectedCurrency = useAppSelector(
      (state) => state.LanguageReducer.selectedCurrency
   );

   const [dateRange, setDateRange] = useState([
      {
         startDate: new Date(),
         endDate: new Date(new Date().getTime() + 86400000 * 2),
         key: "selection",
      },
   ]);

   useEffect(() => {
      setDateRange((prev) => {
         prev[0].startDate = startDate;
         prev[0].endDate = endDate;
         return prev;
      });
   }, [startDate, endDate]);

   const lengthOfStay = 14;

   const handleDateChange = (ranges: any) => {
      setDateRange([ranges.selection]);
   };

   const getMaxEndDate = (startDate: Date) => {
      if (
         dateRange[0].startDate.toDateString() ==
         dateRange[0].endDate.toDateString()
      ) {
         const maxEndDate = new Date(startDate);
         const deadline = new Date();
         deadline.setDate(30);
         deadline.setMonth(5);
         deadline.setFullYear(2024);
         maxEndDate.setDate(startDate.getDate() + 14);
         if (maxEndDate > deadline) {
            return deadline;
         }
         return maxEndDate;
      } else {
         const maxEndDate = new Date();
         maxEndDate.setDate(30);
         maxEndDate.setMonth(5);
         maxEndDate.setFullYear(2024);
         return maxEndDate;
      }
   };

   const getMinDate = () => {
      if (
         dateRange[0].startDate.toDateString() !==
         dateRange[0].endDate.toDateString()
      ) {
         return new Date();
      }
      return dateRange[0].startDate;
   };

   const getMonths = () => {
      if ((!isRoomResult && isMobail) || (isRoomResult && isMobileView)) {
         return 1;
      }
      return 2;
   };

   return (
      <div className="cal-cont" ref={dropdownRef}>
         <div
            className="select-menu"
            onClick={() => setIsOpen(!isOpen)}
            style={
               isRoomResult
                  ? { padding: "0", border: "none", height: "100%" }
                  : undefined
            }>
            <div
               className="check-in"
               style={
                  isRoomResult ? { width: "30%", minWidth: "127px" } : undefined
               }>
               {isRoomResult && (
                  <div
                     style={{
                        color: "rgba(133, 134, 133, 1)",
                        fontSize: "1rem",
                        marginBottom: "5px",
                     }}>
                     <FormattedMessage
                        id="Check in between"
                        defaultMessage=""
                        description=""
                     />
                  </div>
               )}
               <div
                  style={
                     isRoomResult
                        ? { fontWeight: "700", color: "rgba(47, 47, 47, 1)" }
                        : undefined
                  }>
                  {formatDate(startDate)}
               </div>
            </div>
            {isRoomResult ? (
               <svg
                  width="1"
                  height="42"
                  viewBox="0 0 1 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.5 0V42" stroke="#C1C2C2" />
               </svg>
            ) : (
               <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M11.9467 7.74646C11.9149 7.66463 11.8674 7.58987 11.8067 7.52646L8.47333 4.19313C8.41117 4.13097 8.33738 4.08167 8.25617 4.04803C8.17495 4.01438 8.08791 3.99707 8 3.99707C7.82247 3.99707 7.6522 4.0676 7.52667 4.19313C7.46451 4.25529 7.4152 4.32908 7.38156 4.4103C7.34792 4.49151 7.33061 4.57856 7.33061 4.66646C7.33061 4.844 7.40113 5.01426 7.52667 5.1398L9.72667 7.33313H4.66667C4.48986 7.33313 4.32029 7.40337 4.19526 7.52839C4.07024 7.65342 4 7.82299 4 7.9998C4 8.17661 4.07024 8.34618 4.19526 8.4712C4.32029 8.59623 4.48986 8.66646 4.66667 8.66646H9.72667L7.52667 10.8598C7.46418 10.9218 7.41459 10.9955 7.38074 11.0767C7.34689 11.158 7.32947 11.2451 7.32947 11.3331C7.32947 11.4211 7.34689 11.5083 7.38074 11.5895C7.41459 11.6708 7.46418 11.7445 7.52667 11.8065C7.58864 11.8689 7.66238 11.9185 7.74362 11.9524C7.82486 11.9862 7.91199 12.0037 8 12.0037C8.08801 12.0037 8.17515 11.9862 8.25638 11.9524C8.33762 11.9185 8.41136 11.8689 8.47333 11.8065L11.8067 8.47313C11.8674 8.40973 11.9149 8.33497 11.9467 8.25313C12.0133 8.09082 12.0133 7.90877 11.9467 7.74646Z"
                     fill="black"
                  />
               </svg>
            )}
            <div className="check-out">
               {isRoomResult && (
                  <div
                     style={{
                        color: "rgba(133, 134, 133, 1)",
                        fontSize: "1rem",
                        marginBottom: "5px",
                     }}>
                     <FormattedMessage
                        id="Check out between"
                        defaultMessage=""
                        description=""
                     />
                  </div>
               )}
               <div
                  style={
                     isRoomResult
                        ? { fontWeight: "700", color: "rgba(47, 47, 47, 1)" }
                        : undefined
                  }>
                  {formatDate(endDate)}
               </div>
            </div>
            <svg
               width="16"
               height="16"
               viewBox="0 0 16 16"
               fill="none"
               xmlns="http://www.w3.org/2000/svg">
               <path
                  d="M8.00004 12.6665C8.1319 12.6665 8.26079 12.6274 8.37042 12.5542C8.48005 12.4809 8.5655 12.3768 8.61596 12.255C8.66642 12.1331 8.67962 11.9991 8.6539 11.8698C8.62817 11.7405 8.56468 11.6217 8.47145 11.5284C8.37821 11.4352 8.25942 11.3717 8.1301 11.346C8.00078 11.3203 7.86674 11.3335 7.74492 11.3839C7.6231 11.4344 7.51898 11.5198 7.44573 11.6295C7.37247 11.7391 7.33337 11.868 7.33337 11.9998C7.33337 12.1766 7.40361 12.3462 7.52864 12.4712C7.65366 12.5963 7.82323 12.6665 8.00004 12.6665ZM11.3334 12.6665C11.4652 12.6665 11.5941 12.6274 11.7038 12.5542C11.8134 12.4809 11.8988 12.3768 11.9493 12.255C11.9998 12.1331 12.013 11.9991 11.9872 11.8698C11.9615 11.7405 11.898 11.6217 11.8048 11.5284C11.7115 11.4352 11.5928 11.3717 11.4634 11.346C11.3341 11.3203 11.2001 11.3335 11.0783 11.3839C10.9564 11.4344 10.8523 11.5198 10.7791 11.6295C10.7058 11.7391 10.6667 11.868 10.6667 11.9998C10.6667 12.1766 10.7369 12.3462 10.862 12.4712C10.987 12.5963 11.1566 12.6665 11.3334 12.6665ZM11.3334 9.99984C11.4652 9.99984 11.5941 9.96074 11.7038 9.88748C11.8134 9.81423 11.8988 9.71011 11.9493 9.58829C11.9998 9.46648 12.013 9.33243 11.9872 9.20311C11.9615 9.07379 11.898 8.955 11.8048 8.86177C11.7115 8.76853 11.5928 8.70504 11.4634 8.67931C11.3341 8.65359 11.2001 8.66679 11.0783 8.71725C10.9564 8.76771 10.8523 8.85316 10.7791 8.96279C10.7058 9.07242 10.6667 9.20132 10.6667 9.33317C10.6667 9.50998 10.7369 9.67955 10.862 9.80457C10.987 9.9296 11.1566 9.99984 11.3334 9.99984ZM8.00004 9.99984C8.1319 9.99984 8.26079 9.96074 8.37042 9.88748C8.48005 9.81423 8.5655 9.71011 8.61596 9.58829C8.66642 9.46648 8.67962 9.33243 8.6539 9.20311C8.62817 9.07379 8.56468 8.955 8.47145 8.86177C8.37821 8.76853 8.25942 8.70504 8.1301 8.67931C8.00078 8.65359 7.86674 8.66679 7.74492 8.71725C7.6231 8.76771 7.51898 8.85316 7.44573 8.96279C7.37247 9.07242 7.33337 9.20132 7.33337 9.33317C7.33337 9.50998 7.40361 9.67955 7.52864 9.80457C7.65366 9.9296 7.82323 9.99984 8.00004 9.99984ZM12.6667 1.99984H12V1.33317C12 1.15636 11.9298 0.98679 11.8048 0.861766C11.6798 0.736742 11.5102 0.666504 11.3334 0.666504C11.1566 0.666504 10.987 0.736742 10.862 0.861766C10.7369 0.98679 10.6667 1.15636 10.6667 1.33317V1.99984H5.33337V1.33317C5.33337 1.15636 5.26314 0.98679 5.13811 0.861766C5.01309 0.736742 4.84352 0.666504 4.66671 0.666504C4.4899 0.666504 4.32033 0.736742 4.1953 0.861766C4.07028 0.98679 4.00004 1.15636 4.00004 1.33317V1.99984H3.33337C2.80294 1.99984 2.29423 2.21055 1.91916 2.58562C1.54409 2.9607 1.33337 3.4694 1.33337 3.99984V13.3332C1.33337 13.8636 1.54409 14.3723 1.91916 14.7474C2.29423 15.1225 2.80294 15.3332 3.33337 15.3332H12.6667C13.1971 15.3332 13.7058 15.1225 14.0809 14.7474C14.456 14.3723 14.6667 13.8636 14.6667 13.3332V3.99984C14.6667 3.4694 14.456 2.9607 14.0809 2.58562C13.7058 2.21055 13.1971 1.99984 12.6667 1.99984ZM13.3334 13.3332C13.3334 13.51 13.2631 13.6796 13.1381 13.8046C13.0131 13.9296 12.8435 13.9998 12.6667 13.9998H3.33337C3.15656 13.9998 2.98699 13.9296 2.86197 13.8046C2.73695 13.6796 2.66671 13.51 2.66671 13.3332V7.33317H13.3334V13.3332ZM13.3334 5.99984H2.66671V3.99984C2.66671 3.82303 2.73695 3.65346 2.86197 3.52843C2.98699 3.40341 3.15656 3.33317 3.33337 3.33317H4.00004V3.99984C4.00004 4.17665 4.07028 4.34622 4.1953 4.47124C4.32033 4.59627 4.4899 4.6665 4.66671 4.6665C4.84352 4.6665 5.01309 4.59627 5.13811 4.47124C5.26314 4.34622 5.33337 4.17665 5.33337 3.99984V3.33317H10.6667V3.99984C10.6667 4.17665 10.7369 4.34622 10.862 4.47124C10.987 4.59627 11.1566 4.6665 11.3334 4.6665C11.5102 4.6665 11.6798 4.59627 11.8048 4.47124C11.9298 4.34622 12 4.17665 12 3.99984V3.33317H12.6667C12.8435 3.33317 13.0131 3.40341 13.1381 3.52843C13.2631 3.65346 13.3334 3.82303 13.3334 3.99984V5.99984ZM4.66671 9.99984C4.79856 9.99984 4.92745 9.96074 5.03709 9.88748C5.14672 9.81423 5.23217 9.71011 5.28263 9.58829C5.33309 9.46648 5.34629 9.33243 5.32056 9.20311C5.29484 9.07379 5.23135 8.955 5.13811 8.86177C5.04488 8.76853 4.92609 8.70504 4.79677 8.67931C4.66745 8.65359 4.5334 8.66679 4.41159 8.71725C4.28977 8.76771 4.18565 8.85316 4.11239 8.96279C4.03914 9.07242 4.00004 9.20132 4.00004 9.33317C4.00004 9.50998 4.07028 9.67955 4.1953 9.80457C4.32033 9.9296 4.4899 9.99984 4.66671 9.99984ZM4.66671 12.6665C4.79856 12.6665 4.92745 12.6274 5.03709 12.5542C5.14672 12.4809 5.23217 12.3768 5.28263 12.255C5.33309 12.1331 5.34629 11.9991 5.32056 11.8698C5.29484 11.7405 5.23135 11.6217 5.13811 11.5284C5.04488 11.4352 4.92609 11.3717 4.79677 11.346C4.66745 11.3203 4.5334 11.3335 4.41159 11.3839C4.28977 11.4344 4.18565 11.5198 4.11239 11.6295C4.03914 11.7391 4.00004 11.868 4.00004 11.9998C4.00004 12.1766 4.07028 12.3462 4.1953 12.4712C4.32033 12.5963 4.4899 12.6665 4.66671 12.6665Z"
                  fill="black"
               />
            </svg>
         </div>

         {isOpen && (
            <div
               className="date-dropdown-container"
               style={
                  isRoomResult
                     ? {
                          right: "20px",
                          width:
                             !isMobileView && isRoomResult && isMobail
                                ? "760px"
                                : "",
                          left: isMobileView && isRoomResult ? "10vw" : "",
                       }
                     : undefined
               }>
               <div className="calender">
                  <DateRangePicker
                     ranges={dateRange}
                     className="dateRangePicker"
                     onChange={handleDateChange}
                     minDate={getMinDate()}
                     maxDate={getMaxEndDate(dateRange[0].startDate)}
                     months={getMonths()}
                     direction="horizontal"
                     // showSelectionPreview={false}
                     editableDateInputs={true}
                     // onChangeStart={handleStartDateChange}
                     dayContentRenderer={(day) => {
                        return (
                           <div className="date-price-container">
                              <span className="date">{day.getDate()}</span>
                              {minimumNightlyRate[formatDateForPrice(day)] ? (
                                 <span
                                    className="price"
                                    style={
                                       minimumNightlyRate[
                                          formatDateForPrice(day)
                                       ]?.discountedPrice === null ||
                                       minimumNightlyRate[
                                          formatDateForPrice(day)
                                       ]?.discountedPrice === undefined
                                          ? { textDecoration: "" }
                                          : {
                                               textDecoration: "line-through",
                                               color: "#858685",
                                            }
                                    }>
                                    <FormattedNumber
                                       style="currency"
                                       value={
                                          minimumNightlyRate[
                                             formatDateForPrice(day)
                                          ]?.price *
                                          exchangeRate[selectedCurrency]
                                       }
                                       currency={selectedCurrency}
                                       maximumFractionDigits={0}
                                    />
                                 </span>
                              ) : (
                                 <p
                                    style={{
                                       fontSize: "16px",
                                       color: "black",
                                    }}>
                                    {". . ."}
                                 </p>
                              )}
                              <span className="discounted-price">
                                 {minimumNightlyRate[formatDateForPrice(day)]
                                    ?.discountedPrice && (
                                    <FormattedNumber
                                       style="currency"
                                       value={
                                          minimumNightlyRate[
                                             formatDateForPrice(day)
                                          ]?.discountedPrice! *
                                          exchangeRate[selectedCurrency]
                                       }
                                       currency={selectedCurrency}
                                       maximumFractionDigits={0}
                                    />
                                 )}
                              </span>
                           </div>
                        );
                     }}
                  />
               </div>
               <div className="apply-btn-container">
                  {dateRange[0].startDate.toDateString() !==
                     dateRange[0].endDate.toDateString() && (
                     <div className="minimum-price-in-range">
                        <FormattedMessage
                           id="from"
                           defaultMessage=""
                           description=""
                        />{" "}
                        {"  "}
                        <FormattedNumber
                           style="currency"
                           value={
                              getMinimumPriceInRange(
                                 dateRange[0].startDate,
                                 dateRange[0].endDate,
                                 minimumNightlyRate
                              )! * exchangeRate[selectedCurrency]
                           }
                           currency={selectedCurrency}
                           maximumFractionDigits={0}
                        />
                        /
                        <FormattedMessage
                           id="night"
                           defaultMessage=""
                           description=""
                        />{" "}
                     </div>
                  )}
                  <button
                     className="apply-btn"
                     style={
                        dateRange[0].startDate.toDateString() ===
                        dateRange[0].endDate.toDateString()
                           ? { opacity: "0.2", cursor: "not-allowed" }
                           : { opacity: "1" }
                     }
                     onClick={() => {
                        if (
                           dateRange[0].startDate.toDateString() ===
                           dateRange[0].endDate.toDateString()
                        )
                           return;
                        reduxDispatch(setStartDate(dateRange[0].startDate));
                        reduxDispatch(setEndDate(dateRange[0].endDate));
                        setIsOpen(false);
                     }}>
                     <FormattedMessage
                        id="APPLY DATES"
                        defaultMessage=""
                        description=""
                     />
                  </button>
                  {dateRange[0].startDate.toDateString() ===
                     dateRange[0].endDate.toDateString() && (
                     <div className="end-date-select-message">
                        <FormattedMessage
                           id="Please select end date"
                           defaultMessage=""
                           description=""
                        />
                        .{" "}
                        <FormattedMessage
                           id="Max length of stay"
                           defaultMessage=""
                           description=""
                        />
                        : {lengthOfStay}{" "}
                        <FormattedMessage
                           id="days"
                           defaultMessage=""
                           description=""
                        />
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
   );
};
