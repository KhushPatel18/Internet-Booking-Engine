import { CSSProperties } from "react";
import { ClipLoader } from "react-spinners";

export function Loader({ size }: { size?: number }) {
   const override: CSSProperties = {
      display: "block",
      margin: "0 auto",
      border: "3px solid white",
   };
   return (
      <div className="loading">
         <ClipLoader
            cssOverride={override}
            size={size ? size : 100}
            color="#26266d"
         />
      </div>
   );
}
