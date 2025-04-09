import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { IKImage } from "imagekitio-react";
import { urlEndpoint } from "../../Util/API";
export function CarousalStepper({
   images,
   height,
   transformation,
}: {
   images: string[];
   height: string;
   transformation ?: {
      height: string;
      width: string;
   };
}) {
   return (
      <Carousel
         showThumbs={false}
         autoPlay
         infiniteLoop
         interval={3000}
         showStatus={false}>
         {images.map((image) => (
            <IKImage
               key={image}
               urlEndpoint={urlEndpoint}
               path={image}
               transformation={[
                  {
                     height: transformation?.height,
                     width: transformation?.width,
                  },
               ]}
               style={{
                  height: height,
                  borderTopLeftRadius: "5px",
                  borderTopRightRadius: "5px",
                  objectFit: "cover",
                  display: "block",
               }}
            />
         ))}
      </Carousel>
   );
}
