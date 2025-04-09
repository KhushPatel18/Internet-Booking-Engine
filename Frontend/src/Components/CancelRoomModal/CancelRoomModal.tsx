import { useEffect, useRef, useState } from "react";
import "./CancelRoomModal.scss";
import { ThreeDots } from "react-loader-spinner";
export default function CancelRoomModal({
   onClose,
   onCancel,
   handleSendOtp,
}: {
   onClose: () => void;
   handleSendOtp: () => Promise<void>;
   onCancel: (
      otp: number
   ) => Promise<{ content: string; type: "error" | "success" }>;
}) {
   const dropdownRef = useRef<HTMLDivElement | null>(null);
   const [otp, setOtp] = useState("");
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
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

   const handleClick = async () => {
      setLoading(true);
      const response = await onCancel(parseInt(otp));
      if (response.type === "success") {
         // close the modal
         onClose();
      } else {
         setError(response.content);
         setLoading(false);
      }
   };

   const handleOtpSend = async () => {
      setLoading(true);
      await handleSendOtp();
      setLoading(false);
   };

   return (
      <div className="cancel-room-modal-container" ref={dropdownRef}>
         <button className="close-modal-btn" onClick={onClose}>
            X
         </button>
         <h1 className="otp-title">
            Enter OTP for cancelling the room booking
         </h1>
         <input
            type="number"
            className="otp-input"
            placeholder="OTP goes here"
            onChange={(e) => setOtp(e.target.value)}
         />
         {error && <div className="otp-error">{error}</div>}
         <div className="buttons">
            <button
               disabled={loading}
               style={loading ? { opacity: "0.5" } : { opacity: "1" }}
               className="send-otp-btn"
               id="send-otp"
               onClick={handleOtpSend}>
               SEND OTP
            </button>
            <button
               disabled={loading || otp === ""}
               style={
                  loading || otp === "" ? { opacity: "0.5" } : { opacity: "1" }
               }
               className="confirm-otp-btn"
               onClick={handleClick}>
               CONFIRM OTP
            </button>
         </div>
         <div className="loading">
            {loading && (
               <ThreeDots
                  visible={true}
                  height="80"
                  width="80"
                  color="#26266d"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
               />
            )}
         </div>
      </div>
   );
}
