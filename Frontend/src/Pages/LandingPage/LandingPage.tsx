import { Header } from "../../Components/Header/Header";
import { Footer } from "../../Components/Footer/Footer";
import "./LandingPage.scss";
import { MiddleSection } from "../../Components/MiddleSection/MiddleSection";
import { useAppSelector } from "../../redux/store";
import { Loader } from "../../Components/Loader/Loader";
import { SnackbarComponent } from "../../Components/SnackbarComponent/SnackbarComponent";
import { IKImage } from "imagekitio-react";
import { urlEndpoint } from "../../Util/API";
export function LandingPage() {
   const bannerImage = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.currentConfig.bannerImage
   );
   const loading = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.loading
   );
   const error = useAppSelector(
      (state) => state.LandingPageConfigSliceReducer.error
   );
   return (
      <div className="container">
         <div className="header">
            <Header />
         </div>
         {!loading ? (
            <div className="middle-section">
               <MiddleSection />
               {bannerImage.length > 0 ? (
                  <IKImage
                     urlEndpoint={urlEndpoint}
                     path={bannerImage}
                     transformation={[
                        {
                           height: "1020",
                           width: "1900",
                        },
                     ]}
                  />
               ) : (
                  <IKImage
                     urlEndpoint={urlEndpoint}
                     path="bungalow-8627411_1920.jpg"
                     transformation={[
                        {
                           height: "900",
                           width: "1600",
                        },
                     ]}
                  />
               )}
            </div>
         ) : (
            <div className="loader">
               <Loader />
            </div>
         )}
         <div className="footer">
            <Footer />
         </div>
         {!loading && error && (
            <SnackbarComponent content={error} type={"error"} />
         )}
      </div>
   );
}
