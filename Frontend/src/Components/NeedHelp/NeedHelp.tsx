import "./NeedHelp.scss";
import { FormattedMessage } from "react-intl";
const NeedHelp = () => {
  return (
    <div>
      <div className="need-help-container">
        <div className="contacts">
          <div className="content">
          <FormattedMessage
              id="need-help"
              defaultMessage="Need Help?"
            />
          </div>
          <div className="contact-us">
          <FormattedMessage
              id="call-us"
              defaultMessage="Call 1-800-555-5555"
            />
          </div>
        </div>
        <div className="timings">
        <FormattedMessage
            id="business-hours"
            defaultMessage="Mon-Fr 8a-5p EST"
          />
        </div>
      </div>
    </div>
  );
};

export default NeedHelp;
