import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./Pages/LandingPage/LandingPage";
import { RoomResultPage } from "./Pages/RoomResultPage/RoomResultPage";
import { CheckoutPage } from "./Pages/CheckoutPage/CheckoutPage";
import { ConfirmationPage } from "./Pages/ConfirmationPage/ConfirmationPage";
import NotFoundPage from "./Pages/NotFoundPage/NotFoundPage";
import { IntlProvider } from "react-intl";
import { Options } from "./Types/LandingPage";
import messages_de from "./translations/en.json";
import messages_fr from "./translations/es.json";
import { RootState, useAppDispatch, useAppSelector } from "./redux/store";
import { useEffect } from "react";
import { fetchRates } from "./redux/MinimumNightlyRatesSlice/MinimumNightlyRatesSlice";
import { fetchExchangeRates } from "./redux/LanguageSlice/LanguageSlice";
import { fetchConfig } from "./redux/LandingPageConfigSlice/LandingPageConfigSlice";
import FeedbackPage from "./Pages/FeedbackPage/FeedbackPage";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { SkeletonTheme } from "react-loading-skeleton";
import ThankYouPage from "./Pages/ThankYouPage/ThankYouPage";
import MyBookings from "./Pages/MyBookings/MyBookings";

const messages: any = {
   en: messages_de,
   es: messages_fr,
};

function App({ instance }: { instance: PublicClientApplication }) {
   const selectedLanguage: Options = useAppSelector(
      (state: RootState) => state.LanguageReducer.selectedLanguage
   );
   const reduxDispatch = useAppDispatch();
   useEffect(() => {
      try {
         reduxDispatch(fetchConfig());
         reduxDispatch(fetchRates());
         reduxDispatch(fetchExchangeRates());
      } catch (e) {
         console.log(e);
      }
   }, [reduxDispatch]);
   return (
      <IntlProvider
         locale={selectedLanguage.value}
         messages={messages[selectedLanguage.value]}
         defaultLocale="en">
         <MsalProvider instance={instance}>
            <SkeletonTheme baseColor="#fdfdfd" highlightColor="#cbcaca">
               <BrowserRouter>
                  <Routes>
                     <Route path="" element={<LandingPage />} />
                     <Route path="my-bookings" element={<MyBookings />} />
                     <Route path="/rooms" element={<RoomResultPage />} />
                     <Route path="/checkout" element={<CheckoutPage />} />
                     <Route path="/confirmation"element={<ConfirmationPage />}/>
                     <Route path="/feedback" element={<FeedbackPage />} />
                     <Route path="/thank-you" element={<ThankYouPage />} />
                     <Route path="*" element={<NotFoundPage />} />
                  </Routes>
               </BrowserRouter>
            </SkeletonTheme>
         </MsalProvider>
      </IntlProvider>
   );
}

export default App;
