
import { Header } from "../../Components/Header/Header";
import { Footer } from "../../Components/Footer/Footer";

export default function ThankYouPage() {
   return (
      <div>
         <div className="container">
            <div className="header">
               <Header />
            </div>
            <div className="middle-section">
               <img src="ThankYoo.jpg" alt="" />
            </div>
            <div className="footer">
               <Footer />
            </div>
         </div>
      </div>
   );
}
