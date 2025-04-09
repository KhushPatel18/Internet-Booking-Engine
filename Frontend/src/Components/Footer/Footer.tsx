
import "./Footer.scss";
import { FormattedMessage } from "react-intl";

export function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-icon" data-testid="footer-icon">
        <img src="kickdrum-footer.svg" alt="" />
      </div>
      <div className="copyright-wrapper">
        <div className="copyright" data-testid="footer-copyright">
          © Kickdrum Technology Group LLC.
        </div>
        <div className="rights" data-testid="footer-rights">
          <FormattedMessage
            id="allRightsReserved"
            defaultMessage="All Rights Reserved."
            description=""
          />
        </div>
      </div>
    </div>
  );
}
