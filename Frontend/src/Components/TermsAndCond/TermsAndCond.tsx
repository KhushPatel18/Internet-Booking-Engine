import { useEffect, useRef } from "react";
import "./TermsAndConditions.scss"; // Import CSS file for styling
import { FormattedMessage } from "react-intl";

export const TermsAndConditions = ({ onClose }: { onClose: () => void }) => {
   const dropdownRef = useRef<HTMLDivElement | null>(null);
   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
         ) {
            onClose();
         }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);

      // Unbind the event listener on component unmount
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [dropdownRef]);

   return (
      <div className="terms-container" ref={dropdownRef}>
         <h2>
            <FormattedMessage
               id="Terms and Conditions"
               defaultMessage="Terms and Conditions"
               description=""
            />
         </h2>
         <ol>
            <li className="list-heading">
               <p>
                  <FormattedMessage
                     id="Reservation Policy"
                     defaultMessage="Reservation Policy"
                     description=""
                  />
                  :
               </p>
               <ul>
                  <li>
                     <FormattedMessage
                        id="All bookings are subject to availability."
                        defaultMessage="All bookings are subject to availability."
                        description=""
                     />
                  </li>
                  <li>
                     {" "}
                     <FormattedMessage
                        id="Minimum age requirement for making reservations."
                        defaultMessage="Minimum age requirement for making reservations."
                        description=""
                     />
                  </li>
               </ul>
            </li>
            <li className="list-heading">
               <p>
                  {" "}
                  <FormattedMessage
                     id="Cancellation and Refund Policy"
                     defaultMessage="Cancellation and Refund Policy"
                     description=""
                  />
                  :
               </p>
               <ul>
                  <li>
                     <FormattedMessage
                        id="Cancellation deadlines and associated charges may apply."
                        defaultMessage="Cancellation deadlines and associated charges may apply."
                        description=""
                     />
                  </li>
                  <li>
                     <FormattedMessage
                        id="Refunds for canceled bookings are subject to terms and conditions."
                        defaultMessage=" Refunds for canceled bookings are subject to terms and conditions."
                        description=""
                     />
                  </li>
               </ul>
            </li>
            <li className="list-heading">
               <p>
                  {" "}
                  <FormattedMessage
                     id="Payment Terms"
                     defaultMessage="Payment Terms"
                     description=""
                  />
                  :
               </p>
               <ul>
                  <li>
                     <FormattedMessage
                        id="Accepted payment methods include credit cards and debit cards."
                        defaultMessage="Accepted payment methods include credit cards and debit cards."
                        description=""
                     />
                  </li>
                  <li>
                     <FormattedMessage
                        id="Additional charges may apply for services such as parking or breakfast."
                        defaultMessage=" Additional charges may apply for services such as parking
                        or breakfast."
                        description=""
                     />
                  </li>
               </ul>
            </li>
            <li>
               <p>
                  {" "}
                  <FormattedMessage
                     id="Privacy Policy"
                     defaultMessage="Privacy Policy"
                     description=""
                  />
                  :
               </p>
               <ul>
                  <li>
                     <FormattedMessage
                        id="Personal information collected during the booking process is protected."
                        defaultMessage="Personal information collected during the booking process
                        is protected."
                        description=""
                     />
                  </li>
                  <li>
                     {" "}
                     <FormattedMessage
                        id="Compliance with data protection laws and regulations."
                        defaultMessage="Compliance with data protection laws and regulations."
                        description=""
                     />
                  </li>
               </ul>
            </li>
            <li>
               <p>
                  {" "}
                  <FormattedMessage
                     id="Liability Disclaimer"
                     defaultMessage="Liability Disclaimer"
                     description=""
                  />
                  :
               </p>
               <ul>
                  <li>
                     <FormattedMessage
                        id="The company is not liable for any loss, damage, or injury during the stay, including but not limited to theft, accidents, or natural disasters."
                        defaultMessage="The company is not liable for any loss, damage, or injury
                     during the stay, including but not limited to theft,
                     accidents, or natural disasters."
                        description=""
                     />
                  </li>
                  <li>
                     <FormattedMessage
                        id="Guests are responsible for their belongings and are advised to use safety deposit boxes where available."
                        defaultMessage="Guests are responsible for their belongings and are advised
                     to use safety deposit boxes where available."
                        description=""
                     />
                  </li>
               </ul>
            </li>
            <li>
               <p>
                  {" "}
                  <FormattedMessage
                     id="Guest Conduct"
                     defaultMessage="Guest Conduct"
                     description=""
                  />
                  :
               </p>
               <ul>
                  <li>
                     <FormattedMessage
                        id="Guests are expected to behave in a respectful manner towards staff and other guests."
                        defaultMessage=" Guests are expected to behave in a respectful manner
                     towards staff and other guests."
                        description=""
                     />
                  </li>
                  <li>
                     <FormattedMessage
                        id="Any disruptive behavior or violation of hotel policies may result in eviction without refund."
                        defaultMessage="Any disruptive behavior or violation of hotel policies may result in eviction without refund."
                        description=""
                     />
                  </li>
               </ul>
            </li>
            <li>
               <p>
                  {" "}
                  <FormattedMessage
                     id="Intellectual Property"
                     defaultMessage="Intellectual Property"
                     description=""
                  />
                  :
               </p>
               <ul>
                  <li>
                     <FormattedMessage
                        id="All content provided on the website, including text, images, and logos, are the intellectual property of the company and may not be used without permission."
                        defaultMessage="All content provided on the website, including text,
                     images, and logos, are the intellectual property of the
                     company and may not be used without permission."
                        description=""
                     />
                  </li>
                  <li>
                     <FormattedMessage
                        id="Third-party trademarks and logos used on the website are the property of their respective owners."
                        defaultMessage="Third-party trademarks and logos used on the website are
                     the property of their respective owners."
                        description=""
                     />
                  </li>
               </ul>
            </li>
            <li>
               <p>
                  {" "}
                  <FormattedMessage
                     id="Rate Guarantee"
                     defaultMessage="Rate Guarantee"
                     description=""
                  />
                  :
               </p>
               <ul>
                  <li>
                     <FormattedMessage
                        id="We guarantee the best available rate when booking directly through our website."
                        defaultMessage="We guarantee the best available rate when booking directly
                     through our website."
                        description=""
                     />
                  </li>
                  <li>
                     <FormattedMessage
                        id="If a lower rate for the same room type and dates is found elsewhere, we will match it and provide an additional discount."
                        defaultMessage="If a lower rate for the same room type and dates is found
                     elsewhere, we will match it and provide an additional
                     discount."
                        description=""
                     />
                  </li>
               </ul>
            </li>
         </ol>
      </div>
   );
};
