import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { Itinerary } from "../../Components/Itinerary/Itinerary";
import NeedHelp from "../../Components/NeedHelp/NeedHelp";
import PaymentInfo from "../../Components/PaymentIInfo/PaymentInfo";
import ButtonStepper from "../../Components/Stepper/Stepper";
import CountdownTimer from "../../Components/CountdownTimer/CountdownTimer";
import "./CheckoutPage.scss";
import { useAppSelector } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function CheckoutPage() {
   const searchParams = new URLSearchParams(window.location.search);
   const navigate = useNavigate();
   const iternaryId = useAppSelector(
      (state) => state.ItinerarySlice.itineraryDetails.iternaryId
   );
   useEffect(() => {
      const iternary = searchParams.get("iternaryId");
      if (iternary) {
         console.log("you are on checkout page with " + iternaryId);
      } else {
         // go to home
         navigate("/");
      }
   }, []);
   return (
      <div className="checkout-container">
         <div className="header">
            <Header />
         </div>
         <div className="checkout-steps">
            <ButtonStepper step={2} />
         </div>
         <div className="checkout-timer">
            <CountdownTimer />
         </div>
         <div className="checkout-billing">
            <div className="payment">
               <PaymentInfo />
            </div>
            <div className="itinary-details">
               <div className="itinary">
                  <Itinerary />
               </div>
               <div className="checkout-help">
                  <NeedHelp />
               </div>
            </div>
         </div>
         <div className="checkout-phone-help">
            <NeedHelp />
         </div>
         <div className="footer">
            <Footer />
         </div>
      </div>
   );
}
