import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import "./TravellerInfo.scss";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { setTravellerInfo } from "../../redux/TravellerInfoSlice/TraverllerInfoSlice";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";

interface Props {
  activeSection: string;
  handleNextBillingClick: () => void;
}
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const travellerSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .matches(
      /^[A-Za-z]+$/,
      "First name must contain only alphabetic characters"
    ),
  lastName: Yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .matches(
      /^[A-Za-z]*$/,
      "Last name must contain only alphabetic characters"
    ),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(phoneRegExp, "Invalid phone number")
    .length(10, "Phone number must be 10 digits"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
});

const TravellerInfo: React.FC<Props> = ({
  activeSection,
  handleNextBillingClick,
}) => {
  const dispatch = useDispatch();
  const {
    register: registerTraveler,
    handleSubmit: handleSubmitTraveler,
    formState: { errors: travelerErrors },
  } = useForm<FormValues>({
    resolver: yupResolver(travellerSchema),
    mode: "onChange",
  });

  const onSubmitTraveller = (data: FormValues) => {
    dispatch(setTravellerInfo(data));
    handleNextBillingClick();
  };

  const [firstName] = useState("");
  const [lastName] = useState("");

  return (
    <div>
      <form onSubmit={handleSubmitTraveler(onSubmitTraveller)} noValidate>
        <div className="traveller-info">
          <div className="traveller-title">
            <FormattedMessage
              id="traveller-heading"
              defaultMessage="1. Traveller Info"
              description=""
            />
          </div>
          <div
            className={
              activeSection === "traveller-info-visible"
                ? "traveller-info-visible"
                : "expanded"
            }
          >
            <div className="name">
              <div className="first-name">
                <div className="title">
                  <FormattedMessage
                    id="traveller-firstName"
                    defaultMessage="First Name"
                    description=""
                  />
                </div>
                <div className="content">
                  <TextField
                    id="traveller-first-name"
                    variant="outlined"
                    {...registerTraveler("firstName")}
                    error={!!travelerErrors.firstName && !firstName}
                    helperText={
                      travelerErrors.firstName && !firstName
                        ? travelerErrors.firstName?.message
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
              <div className="last-name">
                <div className="title">
                  {" "}
                  <FormattedMessage
                    id="traveller-lastName"
                    defaultMessage="Last Name"
                    description=""
                  />
                </div>
                <div className="content">
                  <TextField
                    id="traveller-last-name"
                    variant="outlined"
                    {...registerTraveler("lastName")}
                    error={!!travelerErrors.lastName && !lastName}
                    helperText={
                      !!travelerErrors.lastName && !lastName
                        ? travelerErrors.lastName?.message
                        : ""
                    }
                    sx={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
            <div className="phone">
              <div className="title">
                <FormattedMessage
                  id="traveller-phone"
                  defaultMessage="Phone"
                  description=""
                />
              </div>
              <div className="content">
                <TextField
                  id="traveller-phone"
                  variant="outlined"
                  type="number"
                  {...registerTraveler("phone")}
                  error={!!travelerErrors.phone}
                  helperText={travelerErrors.phone?.message}
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
                  id="traveller-email"
                  defaultMessage="Email"
                  description=""
                />
              </div>
              <div className="content">
                <TextField
                  id="traveller-email"
                  variant="outlined"
                  {...registerTraveler("email")}
                  error={!!travelerErrors.email}
                  helperText={travelerErrors.email?.message}
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
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "#26266D",
                  borderRadius: "4px",
                  padding: "12px, 20px, 12px, 20px",
                  width: "fit-content",
                  heigth: "50%",
                }}
              >
                <FormattedMessage
                  id="traveller-submit"
                  defaultMessage="NEXT:BILLING INFO"
                  description=""
                />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TravellerInfo;
