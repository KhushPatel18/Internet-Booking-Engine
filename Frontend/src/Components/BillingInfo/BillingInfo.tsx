import React, { useState } from "react";
import { TextField, Button, Menu, MenuItem } from "@mui/material";
import * as csc from "country-state-city";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { setBillingInfo } from "../../redux/BillingInfoSlice/BillingInfoSlice";
import { useDispatch } from "react-redux";

import "./BillingInfo.scss";
import { FormattedMessage } from "react-intl";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ZIPAPIKEY } from "../../Util/API";
interface Props {
   handleEditTravelInfo: () => void;
   handleNextPaymentClick: () => void;
   activeSection: string;
}
const phoneRegExp =
   /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const BillingInfo: React.FC<Props> = ({
   handleEditTravelInfo,
   activeSection,
   handleNextPaymentClick,
}) => {
   const dispatch = useDispatch();
   const billingSchema = Yup.object().shape({
      billingFirstName: Yup.string()
         .required("First name is required")
         .matches(
            /^[A-Za-z]+$/,
            "First name must contain only alphabetic characters"
         ),
      billingLastName: Yup.string()
         .nullable()
         .transform((value) => (value === "" ? null : value))
         .matches(
            /^[A-Za-z]*$/,
            "Last name must contain only alphabetic characters"
         ),
      billingAddress1: Yup.string().required("Address is required"),
      billingAddress2: Yup.string(),
      billingCountry: Yup.string().required("Country is required"),
      billingCity: Yup.string().required("City is required"),
      billingState: Yup.string().required("State is required"),
      billingZip: Yup.string()
         .required("ZIP code is required")
         .test("valid-zip", "Invalid ZIP code", async function (value) {
            const billingState = this.parent.billingState;
            const isValid = await validateZipCode(value, billingState);
            return isValid;
         }),
      billingPhone: Yup.string()
         .required("Phone number is required")
         .matches(phoneRegExp, "Invalid phone number")
         .length(10, "Phone number must be 10 digits"),
      billingEmail: Yup.string()
         .required("Email is required")
         .email("Invalid email address"),
   });

   const {
      register: registerBilling,
      handleSubmit: handleSubmitBilling,
      formState: { errors: billingErrors },
   } = useForm({
      resolver: yupResolver(billingSchema),
      mode: "onChange",
   });
   const onSubmitBilling = (data: FormValuesBilling) => {
      dispatch(setBillingInfo(data));
      handleNextPaymentClick();
   };

   const [billingCountry, setBillingCountry] = React.useState("");
   const [billingState, setBillingState] = React.useState("");
   const [countryMenu, setCountryMenu] = useState<HTMLElement | null>(null);
   const [countryMenuWidth, setCountryMenuWidth] = useState<number>(0);
   const [stateMenuWidth, _] = useState<number>(0);
   const [stateOptions, setStateOptions] = useState<
      { value: string; label: string }[]
   >([]);
   const handleToggleCountryMenu = (
      event: React.MouseEvent<HTMLDivElement>
   ) => {
      setCountryMenu(event.currentTarget);
      const width = event.currentTarget.offsetWidth;
      setCountryMenuWidth(width);
   };
   const handleCountryClose = (country: csc.ICountry) => {
      setBillingCountry(country.name);
      setBillingState("");
      setCountryMenu(null);

      const states = csc.State.getStatesOfCountry(country.isoCode);

      const stateOptions = states.map((state) => ({
         value: state.name,
         label: state.name,
      }));

      setStateOptions(stateOptions);
   };
   const [billingZip, setBillingZip] = useState("");
   const validateZipCode = async (zipcode: string, billingState: string) => {
      const url = `https://app.zipcodebase.com/api/v1/search?apikey=${ZIPAPIKEY}&codes=${zipcode}`;

      try {
         const response = await axios.get(url);
         const responseData = response.data;
         if (billingState === responseData.results[zipcode][0].state) {
            return true;
         } else {
            return false;
         }
      } catch (error) {
         console.error("Error fetching API data:", error);
         return false;
      }
   };

   return (
      <form onSubmit={handleSubmitBilling(onSubmitBilling)} noValidate>
         <div className="billing-info">
            <div className="billing-title">
               <FormattedMessage
                  id="billing-heading"
                  defaultMessage="2. Billing Info"
                  description=""
               />
            </div>
            <div
               className={` ${
                  activeSection === "billing-info-visible"
                     ? "billing-info-visible"
                     : "expanded"
               }`}>
               <div className="name">
                  <div className="first-name">
                     <div className="title">
                        <FormattedMessage
                           id="billing-FirstName"
                           defaultMessage="First Name"
                           description=""
                        />
                     </div>
                     <div className="content">
                        <TextField
                           id="billing-first-name"
                           variant="outlined"
                           {...registerBilling("billingFirstName")}
                           error={!!billingErrors.billingFirstName}
                           helperText={billingErrors.billingFirstName?.message}
                           sx={{
                              width: "90%",
                              "@media (max-width: 1023px)": {
                                 width: "100%",
                              },
                           }}
                        />
                     </div>
                  </div>
                  <div className="last-name">
                     <div className="title">
                        <FormattedMessage
                           id="billing-LastName"
                           defaultMessage="Last Name"
                           description=""
                        />
                     </div>
                     <div className="content">
                        <TextField
                           id="billing-last-name"
                           variant="outlined"
                           {...registerBilling("billingLastName")}
                           error={!!billingErrors.billingLastName}
                           helperText={billingErrors.billingLastName?.message}
                           sx={{ width: "100%" }}
                        />
                     </div>
                  </div>
               </div>
               <div className="mailing-address">
                  <div className="mailing-address-1">
                     <div className="title">
                        <FormattedMessage
                           id="billingAddess1"
                           defaultMessage="Mailing Address1"
                           description=""
                        />
                     </div>
                     <div className="content">
                        <TextField
                           id="billing-address1"
                           variant="outlined"
                           {...registerBilling("billingAddress1")}
                           error={!!billingErrors.billingAddress1}
                           helperText={billingErrors.billingAddress1?.message}
                           sx={{
                              width: "90%",
                              "@media (max-width: 1023px)": {
                                 width: "100%",
                              },
                           }}
                        />
                     </div>
                  </div>
                  <div className="mailing-address-2">
                     <div className="title">
                        <FormattedMessage
                           id="billingAddess2"
                           defaultMessage="Mailing Address2"
                           description=""
                        />
                     </div>
                     <div className="content">
                        <TextField
                           id="billing-address2"
                           variant="outlined"
                           {...registerBilling("billingAddress2")}
                           error={!!billingErrors.billingAddress2}
                           helperText={billingErrors.billingAddress2?.message}
                           sx={{ width: "100%" }}
                        />
                     </div>
                  </div>
               </div>
               <div className="country">
                  <div className="title">
                     <FormattedMessage
                        id="billing-Country"
                        defaultMessage=""
                        description=""
                     />
                  </div>
                  <div className="content">
                     <TextField
                        id="billing-country"
                        variant="outlined"
                        value={billingCountry}
                        onClick={handleToggleCountryMenu}
                        {...registerBilling("billingCountry")}
                        sx={{
                           width: "90%",
                           "@media (max-width: 1023px)": {
                              width: "100%",
                           },
                        }}
                        helperText={billingErrors.billingCountry?.message}
                        error={!!billingErrors.billingCountry}
                        InputProps={{
                           endAdornment: (
                              <InputAdornment position="end">
                                 <IconButton aria-label="toggle dropdown">
                                    <KeyboardArrowDownIcon fontSize="small" />
                                 </IconButton>
                              </InputAdornment>
                           ),
                        }}
                     />
                     <Menu
                        id="country-menu"
                        anchorEl={countryMenu}
                        open={Boolean(countryMenu)}
                        onClose={() => setCountryMenu(null)}
                        PaperProps={{
                           style: {
                              width: countryMenuWidth,
                           },
                        }}
                        MenuListProps={{
                           style: {
                              maxHeight: 200,
                              overflowY: "auto",
                           },
                        }}>
                        {csc.Country.getAllCountries().map(
                           (country: csc.ICountry) => (
                              <MenuItem
                                 key={country.isoCode}
                                 onClick={() => handleCountryClose(country)}>
                                 {country.name}
                              </MenuItem>
                           )
                        )}
                     </Menu>
                  </div>
               </div>
               <div className="city-container">
                  <div className="city">
                     <div className="title">
                        <FormattedMessage
                           id="billing-City"
                           defaultMessage=""
                           description=""
                        />
                     </div>
                     <div className="content">
                        <TextField
                           id="billing-city"
                           variant="outlined"
                           {...registerBilling("billingCity")}
                           error={!!billingErrors.billingCity}
                           helperText={billingErrors.billingCity?.message}
                           sx={{
                              width: "90%",
                              "@media (max-width: 1023px)": {
                                 width: "100%",
                              },
                           }}
                        />
                     </div>
                  </div>
                  <div className="state-container">
                     <div className="state">
                        <div className="title">
                           <FormattedMessage
                              id="billing-State"
                              defaultMessage=""
                              description=""
                           />
                        </div>
                        <div className="content">
                           <TextField
                              id="billing-state"
                              variant="outlined"
                              select
                              value={billingState}
                              {...registerBilling("billingState")}
                              helperText={billingErrors.billingState?.message}
                              onChange={(e) => setBillingState(e.target.value)}
                              error={!!billingErrors.billingState}
                              sx={{
                                 width: "95%",
                                 "@media (max-width: 1023px)": {
                                    width: "100%",
                                 },
                              }}
                              SelectProps={{
                                 IconComponent: (props) => (
                                    <InputAdornment position="end">
                                       <IconButton
                                          aria-label="toggle dropdown"
                                          onClick={props.onClick}
                                          onMouseDown={(event) => {
                                             event.preventDefault();
                                          }}>
                                          <KeyboardArrowDownIcon fontSize="small" />
                                       </IconButton>
                                    </InputAdornment>
                                 ),
                                 MenuProps: {
                                    PaperProps: {
                                       style: {
                                          width: stateMenuWidth,
                                          maxHeight: 200,
                                          overflowY: "auto",
                                       },
                                    },
                                 },
                              }}>
                              {stateOptions.map((state, index) => (
                                 <MenuItem key={index} value={state.value}>
                                    {state.label}
                                 </MenuItem>
                              ))}
                           </TextField>
                        </div>
                     </div>

                     <div className="zip">
                        <div className="title">
                           <FormattedMessage
                              id="billing-Zip"
                              defaultMessage=""
                              description=""
                           />
                        </div>
                        <div className="content">
                           <TextField
                              id="billing-zip"
                              variant="outlined"
                              {...registerBilling("billingZip")}
                              error={!!billingErrors.billingZip}
                              helperText={billingErrors.billingZip?.message}
                              sx={{ width: "100%" }}
                              value={billingZip}
                              onChange={(e) => setBillingZip(e.target.value)}
                           />
                        </div>
                     </div>
                  </div>
               </div>
               <div className="phone">
                  <div className="title">
                     <FormattedMessage
                        id="billing-Phone"
                        defaultMessage=""
                        description=""
                     />
                  </div>
                  <div className="content">
                     <TextField
                        id="billing-phone"
                        variant="outlined"
                        type="number"
                        {...registerBilling("billingPhone")}
                        error={!!billingErrors.billingPhone}
                        helperText={billingErrors.billingPhone?.message}
                        sx={{
                           width: "90%",
                           "@media (max-width: 1023px)": {
                              width: "100%",
                           },
                        }}
                     />
                  </div>
               </div>

               <div className="email">
                  <div className="title">
                     <FormattedMessage
                        id="billing-Email"
                        defaultMessage=""
                        description=""
                     />
                  </div>
                  <div className="content">
                     <TextField
                        id="billing-email"
                        variant="outlined"
                        {...registerBilling("billingEmail")}
                        error={!!billingErrors.billingEmail}
                        helperText={
                           billingErrors.billingEmail
                              ? billingErrors.billingEmail.type === "required"
                                 ? "Field cannot be empty"
                                 : "Invalid email address"
                              : ""
                        }
                        sx={{
                           width: "90%",
                           "@media (max-width: 1023px)": {
                              width: "100%",
                           },
                        }}
                     />
                  </div>
               </div>
               <div className="next">
                  <Button
                     variant="text"
                     onClick={handleEditTravelInfo}
                     sx={{
                        color: "#26266D",
                        fontWeight: "400",
                        marginRight: "20px",
                     }}>
                     Edit Travel Info.
                  </Button>
                  <Button
                     variant="contained"
                     type="submit"
                     sx={{
                        backgroundColor: "#26266D",
                        borderRadius: "4px",
                        padding: "12px 20px",
                        width: "fit-content",
                        height: "50%",
                     }}>
                     <FormattedMessage
                        id="billing-submit"
                        defaultMessage=""
                        description=""
                     />
                  </Button>
               </div>
            </div>
         </div>
      </form>
   );
};

export default BillingInfo;
