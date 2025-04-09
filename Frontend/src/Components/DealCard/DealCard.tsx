import { FormattedMessage, FormattedNumber } from "react-intl";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import "./DealCard.scss";
import { Link } from "react-router-dom";
import {
   fetchItrRates,
   setItineraryValues,
   setShowItinerary,
} from "../../redux/ItinerarySlice/ItinerarySlice";
import { v4 as uuidv4 } from "uuid";
export interface DealCardProps {
   title: string;
   description: string;
   price: number;
   roomTypeId: number;
   startDate: Date;
   endDate: Date;
   roomTypeName: string;
   priceFactor: number;
   image: string;
}

export function DealCard({
   title,
   description,
   price,
   startDate,
   endDate,
   roomTypeId,
   roomTypeName,
   priceFactor,
   image,
}: DealCardProps) {
   const exchangeRate = useAppSelector(
      (state) => state.LanguageReducer.exchangeRate
   );
   const selectedCurrency = useAppSelector(
      (state) => state.LanguageReducer.selectedCurrency
   );
   const guests = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.filterStates.selectedGuests
   );
   const rooms = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.filterStates.selectedRooms
   );
   const property = useAppSelector(
      (state) =>
         state.LandingPageConfigSliceReducer.filterStates.selectedProperty
   );
   const dispatch = useAppDispatch();

   const getStayString = (start: Date, end: Date): string => {
      const startMonth = start.toLocaleString("default", { month: "long" });
      const endMonth = end.toLocaleString("default", { month: "long" });

      const startDate = start.getDate();
      const endDate = end.getDate();

      return `${startMonth} ${startDate} - ${endMonth} ${endDate}, ${start.getFullYear()}`;
   };
   const getGuestString = (guestObj: Record<string, number>) => {
      return Object.keys(guestObj)
         .map((key) => {
            const value = guestObj[key];
            const label: string = key;
            if (value > 1) {
               return `${value} ${label}`;
            } else if (value == 1) {
               return `${value} ${label.substring(0, label.length - 1)}`;
            } else {
               return "";
            }
         })
         .filter(Boolean)
         .join(" ");
   };
   const iternaryId = uuidv4();

   console.log(image);
   const handleSelectPackage = () => {
      dispatch(
         setShowItinerary({
            show: true,
            type: "Continue Shopping",
         })
      );
      dispatch(
         fetchItrRates({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            roomTypeId: roomTypeId,
         })
      ).then((res) => {
         console.log("Package Applied, Rates Fetched", res);
         dispatch(
            setItineraryValues({
               iternaryId: iternaryId,
               roomTypeId: roomTypeId,
               propertyName: property,
               stayString: getStayString(startDate, endDate),
               specialPromoName: title,
               noOfRooms: rooms,
               roomName: roomTypeName,
               avgPrice: price * priceFactor,
               promoPrice: price * (1 - priceFactor),
               guestString: getGuestString(guests),
               specialPromoDescription: description,
               roomImage: image,
            })
         );
         console.log("setted", iternaryId);
      });
   };
   return (
      <div className="deal-card-container">
         <div className="deal-card-title-description-wrapper">
            <div className="deal-card-title">
               <FormattedMessage id={title} defaultMessage={title} />
            </div>
            <div className="deal-card-description">
               <FormattedMessage
                  id={`${title} Description`}
                  defaultMessage={description}
               />
            </div>
         </div>
         <div className="price-btn-wrapper">
            <div className="room-modal-price">
               <div className="room-modal-price-value">
                  <FormattedNumber
                     style="currency"
                     value={
                        Math.ceil(price * priceFactor) *
                        exchangeRate[selectedCurrency]
                     }
                     currency={selectedCurrency}
                     maximumFractionDigits={0}
                  />
               </div>
               <div className="room-modal-price-text">
                  {" "}
                  <FormattedMessage
                     id="per night"
                     defaultMessage="per night"
                     description=""
                  />
               </div>
            </div>
            <Link to={`/checkout?iternaryId=${iternaryId}`}>
               <button
                  className="room-modal-select-btn"
                  onClick={handleSelectPackage}>
                  <FormattedMessage
                     id="SELECT PACKAGE"
                     defaultMessage="SELECT PACKAGE"
                     description=""
                  />
               </button>
            </Link>
         </div>
      </div>
   );
}
