import { useEffect, useRef, useState } from "react";
import "./CancelConfirmationModal.scss";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";

function CancelConfirmationModal({
   onClose,
   onCancel,
}: {
   onClose: () => void;
   onCancel: () => Promise<{ content: string; type: "error" | "success" }>;
}) {
   const dropdownRef = useRef<HTMLDivElement | null>(null);
   const navigate = useNavigate();
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
      const response = await onCancel();
      if (response.type === "success") {
         // close the modal
         onClose();
         navigate("/rooms");
         setLoading(false);
      } else {
         setLoading(false);
      }
   };

   return (
      <div className="cancel-confirmation-modal-container" ref={dropdownRef}>
         <button
            className="cancel-confirmation-close-modal-btn"
            onClick={onClose}>
            X
         </button>
         <h1 className="modal-title">
            Do you surely want to cancel the booking
         </h1>
         <div className="yes-no">
            <button
               disabled={loading}
               style={
                  loading
                     ? { opacity: "0.5", cursor: "not-allowed" }
                     : undefined
               }
               className="yes"
               onClick={handleClick}>
               YES
            </button>
            <button
               disabled={loading}
               className="no"
               style={
                  loading
                     ? { opacity: "0.5", cursor: "not-allowed" }
                     : undefined
               }
               onClick={onClose}>
               NO
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

export default CancelConfirmationModal;
