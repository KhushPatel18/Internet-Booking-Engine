import { useEffect, useState } from "react";
import Dropdown from "../Dropdown/Dropdown";
import "./Header.scss";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { Options } from "../../Types/LandingPage";
import { useDispatch } from "react-redux";
import {
   setCurrency,
   setLanguage,
} from "../../redux/LanguageSlice/LanguageSlice";
import { RootState, useAppDispatch, useAppSelector } from "../../redux/store";
import { useMediaQuery } from "usehooks-ts";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import {
   AuthenticatedTemplate,
   UnauthenticatedTemplate,
   useMsal,
} from "@azure/msal-react";
import { setEmail, setToken } from "../../redux/AuthSlice/AuthSlice";
export function Header() {
   const { instance } = useMsal();
   const email = useAppSelector((state) => state.AuthSliceReducer.email);
   const dispatch = useDispatch();
   const login = async () => {
      try {
         let { idToken } = await instance.loginPopup();
         const decoded: any = jwtDecode(idToken);
         if (decoded.emails) {
            console.log(decoded.emails[0]);
            dispatch(setEmail(decoded.emails[0]));
         }
         dispatch(setToken(idToken));
      } catch (error) {
         console.error(error);
      }
   };

   const logout = async () => {
      try {
         await instance.logoutPopup();
         dispatch(setToken(""));
      } catch (error) {
         console.error(error);
      }
   };

   const [selectedCurrency, setSelectedCurrency] = useState({
      label: "USD",
      value: "usd",
      logo: "usd.svg",
   });
   const languageOptions = [
      { label: "En", value: "en", logo: "globe.svg" },
      { label: "Spn", value: "es", logo: "globe.svg" },
   ];
   const currencyOptions = [
      { label: "USD", value: "usd", logo: "usd.svg", unicode: "\u{00024}" },
      { label: "INR", value: "inr", logo: "inr.svg", unicode: "\u{20B9}" },
      { label: "EUR", value: "eur", logo: "euro.svg", unicode: "\u{20AC}" },
   ];
   const [toggleHam, setToggleHam] = useState(true);
   const isMobail = useMediaQuery("(max-width : 810px)");
   useEffect(() => {
      if (!isMobail) {
         setToggleHam(true);
      } else {
         setToggleHam(false);
      }
   }, [isMobail]);
   const handleHamToggle = () => {
      setToggleHam((prev) => !prev);
   };
   const selectedLanguage: Options = useSelector(
      (state: RootState) => state.LanguageReducer.selectedLanguage
   );
   const onLanguageSelector = (selectedLanguage: Options) => {
      dispatch(setLanguage(selectedLanguage));
   };
   const reduxDispatch = useAppDispatch();
   const onCurrencySelector = (selectedCurrency: Options) => {
      setSelectedCurrency(selectedCurrency);
      reduxDispatch(setCurrency(selectedCurrency.label));
   };
   const navigate = useNavigate();
   const handleMyBookings = () => {
      navigate(`/my-bookings?email=${email}`);
   };

   return (
      <div className="header-container">
         <div className="title-logo-wrapper">
            <Link to="/">
               <div className="logo">
                  <img src="kickdrum-logo.png" alt="kickdrum" />
               </div>
            </Link>
            <Link to="/">
               <div className="title">
                  <FormattedMessage
                     id="subtitle"
                     defaultMessage="Internet Booking Engine"
                     description=""
                  />
               </div>
            </Link>
         </div>

         <button
            className="hamburger"
            data-testid="hamburger"
            onClick={handleHamToggle}>
            <img src="hamburger.svg" alt="" />
         </button>
         {toggleHam && (
            <div className="right-side-nav">
               <AuthenticatedTemplate>
                  <button
                     data-testid="my-bookings"
                     className="my-bookings"
                     onClick={handleMyBookings}>
                     <FormattedMessage
                        id="myBookings"
                        defaultMessage="My Bookings"
                        description=""
                     />
                  </button>
               </AuthenticatedTemplate>
               <div className="dropdown-wrapper">
                  <div className="languages">
                     <Dropdown
                        options={languageOptions}
                        selectedOption={selectedLanguage.value}
                        onOptionSelected={onLanguageSelector}
                        logo="globe.svg"
                     />
                  </div>
                  <div className="currencies">
                     <Dropdown
                        options={currencyOptions}
                        selectedOption={selectedCurrency.value}
                        onOptionSelected={onCurrencySelector}
                     />
                  </div>
               </div>
               <AuthenticatedTemplate>
                  <button
                     data-testid="login"
                     className="login"
                     onClick={logout}>
                     LOGOUT
                  </button>
               </AuthenticatedTemplate>
               <UnauthenticatedTemplate>
                  <button
                     type="button"
                     className="login"
                     onClick={() => login()}>
                     <FormattedMessage
                        id="login"
                        defaultMessage="My Bookings"
                        description=""
                     />
                  </button>
               </UnauthenticatedTemplate>
            </div>
         )}
      </div>
   );
}
