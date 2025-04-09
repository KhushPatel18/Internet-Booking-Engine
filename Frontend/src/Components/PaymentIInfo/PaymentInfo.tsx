import "./paymentInfo.scss";
import TravellerInfo from "../TravellerInfo/TravellerInfo";
import BillingInfo from "../BillingInfo/BillingInfo";
import PaymentInformation from "../PaymentInformation/PaymentInformation";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

const PaymentInfo = () => {
  const [activeSection, setActiveSection] = useState("traveller-info-visible");
  

  const handleEditTravelInfo = () => {
    setActiveSection("traveller-info-visible");
  };

  const handleEditBillingInfo = () => {
    setActiveSection("billing-info-visible");
  };

  const handleNextBillingClick = () => {
    setActiveSection("billing-info-visible");
  };

  const handleNextPaymentClick = () => {
    setActiveSection("payment-info-visible");
  };

  return (
    <div>
      <div className="payment-heading"><FormattedMessage
                     id="checkout-heading"
                     defaultMessage="Payment Info"
                     description=""
                  /></div>
      <TravellerInfo
        activeSection={activeSection}
        handleNextBillingClick={handleNextBillingClick}
      />
      <BillingInfo
        activeSection={activeSection}
        handleEditTravelInfo={handleEditTravelInfo}
        handleNextPaymentClick={handleNextPaymentClick}
      />
      <PaymentInformation
        activeSection={activeSection}
        handleEditBillingInfo={handleEditBillingInfo}
      />
    </div>
  );
};

export default PaymentInfo;