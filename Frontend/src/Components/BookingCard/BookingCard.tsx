import { Link } from "react-router-dom";
import { MyBooking } from "../../Types/MyBookings";
import { formatDate } from "../../Util/bookingUtil";
import "./BookingCard.scss";
import { useMediaQuery } from "usehooks-ts";

export default function BookingCard({
   bookingId,
   status,
   checkIn,
   checkOut,
   rooms,
   roomName,
   email,
}: MyBooking) {
   const isMobile = useMediaQuery("(max-width : 910px)");
   return (
      <>
         {!isMobile ? (
            <div className="booking-card-container">
               <div className="booking-id">
                  BOOKING ID :{" "}
                  <span style={{ fontWeight: "700", color: "#26266d" }}>
                     {bookingId}
                  </span>
               </div>
               <div className="status">
                  {status ? (
                     <div className="confirm">CONFIRMED</div>
                  ) : (
                     <div className="canceled">CANCELED</div>
                  )}
               </div>
               <div className="room-info">
                  {roomName.replace("_", " ")} X{" "}
                  <span style={{ fontWeight: "700", color: "#26266d" }}>
                     {rooms}
                  </span>
               </div>
               <div className="dates">
                  From {formatDate(checkIn)} To {formatDate(checkOut)}
               </div>
               <Link to={`/confirmation?bookingId=${bookingId}&email=${email}`}>
                  <button className="view-details">VIEW DETAILS</button>
               </Link>
            </div>
         ) : (
            <div className="booking-card-container">
               <div className="information">
                  <div className="status-booking-wrapper">
                     <div className="booking-id">
                        BOOKING ID :{" "}
                        <span style={{ fontWeight: "700", color: "#26266d" }}>
                           {bookingId}
                        </span>
                     </div>
                     <div className="status">
                        {status ? (
                           <div className="confirm">CONFIRMED</div>
                        ) : (
                           <div className="canceled">CANCELED</div>
                        )}
                     </div>
                  </div>
                  <div className="dates-info-wrapper">
                     <div className="room-info">
                        {roomName.replace("_", " ")} X{" "}
                        <span style={{ fontWeight: "700", color: "#26266d" }}>
                           {rooms}
                        </span>
                     </div>
                     <div className="dates">
                        <span> From {formatDate(checkIn)} </span>{" "}
                        <span>To {formatDate(checkOut)}</span>
                     </div>
                  </div>
               </div>
               <Link to={`/confirmation?bookingId=${bookingId}&email=${email}`}>
                  <button className="view-details">VIEW DETAILS</button>
               </Link>
            </div>
         )}
      </>
   );
}
