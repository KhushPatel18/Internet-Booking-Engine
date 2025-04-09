import { useEffect, useState } from "react";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import "./MyBookings.scss";
import {  BASE_URL } from "../../Util/API";
import { isValidEmail } from "../../Util/bookingUtil";
import { MyBooking } from "../../Types/MyBookings";
import BookingCard from "../../Components/BookingCard/BookingCard";
import { useIsAuthenticated } from "@azure/msal-react";
export default function MyBookings() {
   const seachParams = new URLSearchParams(window.location.search);
   const email = seachParams.get("email");
   const [bookings, setBookings] = useState<MyBooking[]>([]);
   const [error, setError] = useState("");
   const isAuthenticated = useIsAuthenticated();
   useEffect(() => {
      const fetchBookings = async () => {
         try {
            const res = await fetch(
               `${BASE_URL}/api/v1/booking/getAll?email=${email}`
            );
            if (res.status !== 200) {
               setError("No Bookings Found");
            }
            const data = await res.json();
            setBookings(data);
         } catch (e) {
            console.error(e);
            setError("No Bookings Found");
         }
      };
      if (email && isValidEmail(email)) {
         fetchBookings();
      } else {
         setError("OOPS! No Bookings Found");
      }
   }, []);
   return (
      <div className="my-bookings-container">
         <div className="my-header-container">
            <Header />
         </div>
         <main className="main-section">
            <h1 className="main-section-title">My Bookings</h1>
            {!error && isAuthenticated && bookings.length > 0 ? (
               <div className="my-bookings">
                  {bookings.map((booking) => (
                     <BookingCard {...booking} key={booking.bookingId} />
                  ))}
               </div>
            ) : (
               <div className="error-msg">
                  {isAuthenticated
                     ? error || "NO BOOKINGS FOUND"
                     : "PLEASE LOGIN FIRST TO SEE YOUR BOOKINGS"}
               </div>
            )}
         </main>
         <div className="footer">
            <Footer />
         </div>
      </div>
   );
}
