import * as React from "react";
import Stepper from "@mui/joy/Stepper";
import Step from "@mui/joy/Step";
import StepButton from "@mui/joy/StepButton";
import StepIndicator from "@mui/joy/StepIndicator";
import Check from "@mui/icons-material/Check";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/store";
import { setShowItinerary } from "../../redux/ItinerarySlice/ItinerarySlice";

const steps = ["1: Choose room", "2: Choose add on", "3: Checkout"];
const links = ["/rooms", "/rooms", "/checkout"];
export default function ButtonStepper({ step }: { step: number }) {
   const [activeStep, setActiveStep] = React.useState(step);
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   return (
      <Stepper sx={{ width: "50%", minWidth: "400px" }}>
         {steps.map((step, index) => (
            <Step
               key={step}
               orientation="vertical"
               indicator={
                  <StepIndicator
                     variant={activeStep <= index ? "soft" : "solid"}
                     color={activeStep < index ? "neutral" : "primary"}
                     sx={{
                        bgcolor:
                           activeStep === index
                              ? "red"
                              : activeStep > index
                              ? "rgba(38, 38, 109, 1)"
                              : activeStep < index
                              ? "rgba(193, 194, 194, 1)"
                              : undefined,
                        color:
                           activeStep < index
                              ? "rgba(193, 194, 194, 1)"
                              : "white",
                     }}>
                     {activeStep >= index ? <Check /> : undefined}
                  </StepIndicator>
               }
               sx={{
                  "&::after": {
                     ...(activeStep > index &&
                        index !== 2 && { bgcolor: "rgba(38, 38, 109, 1)" }),
                  },
               }}>
               <StepButton
                  sx={{
                     color:
                        activeStep === index
                           ? "rgba(38, 38, 109, 1)"
                           : "rgba(93, 93, 93, 1)",
                     fontWeight: activeStep === index ? "700" : "400",
                  }}
                  onClick={() => {
                     if (index <= activeStep) {
                        setActiveStep(index);
                        if (index === 1) {
                           navigate(-1);
                           dispatch(
                              setShowItinerary({
                                 show: true,
                                 type: "Checkout",
                              })
                           );
                        } else window.location.href = links[index];
                     }
                  }}>
                  <FormattedMessage
                     id={step}
                     defaultMessage=""
                     description=""
                  />
               </StepButton>
            </Step>
         ))}
      </Stepper>
   );
}
