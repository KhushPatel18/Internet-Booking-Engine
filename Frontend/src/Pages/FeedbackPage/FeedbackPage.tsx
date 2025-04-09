import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import "./FeedbackPage.scss";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL, urlEndpoint } from "../../Util/API";
import { SnackbarComponent } from "../../Components/SnackbarComponent/SnackbarComponent";
import { IKImage } from "imagekitio-react";
const colors = {
   orange: "#FFBA5A",
   grey: "#a9a9a9",
};

const FeedbackPage = () => {
   const [currentValue, setCurrentValue] = useState<number>(0);
   const [hoverValue, setHoverValue] = useState<number | undefined>(undefined);
   const [content, setContent] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const navigate = useNavigate();
   const stars = Array(5).fill(0);
   const handleClick = (value: number) => {
      setCurrentValue(value);
   };

   const handleMouseOver = (newHoverValue: number) => {
      setHoverValue(newHoverValue);
   };

   const handleMouseLeave = () => {
      setHoverValue(undefined);
   };

   const searchParams = new URLSearchParams(window.location.search);
   const roomName = searchParams.get("roomName");
   const feedbackId = searchParams.get("feedbackId");

   useEffect(() => {
      if (!feedbackId || !roomName) {
         navigate("/");
      }
      const getStatus = async () => {
         try {
            const res = await fetch(
               `${BASE_URL}/api/v1/rooms/feedback/${feedbackId}`
            );
            const data = await res.json();
            if (res.status !== 200) {
               setError(data.msg || data);
            }
            if (data.status) {
               setError("feedback is already submitted once");
               setTimeout(() => {
                  navigate("/");
               }, 1000);
            }
         } catch (error) {
            setError("failed to get status of the feedback");
         }
      };
      getStatus();
   }, []);
   const handleRatingSubmit = () => {
      const reqBody = {
         rating: currentValue,
         feedbackId: feedbackId,
         feedback: content,
         roomTypeName: roomName,
      };
      const updateRatings = async () => {
         setLoading(true);
         try {
            const res = await fetch(`${BASE_URL}/api/v1/rooms/updateRatings`, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(reqBody),
            });
            console.log(res.statusText);
         } catch (error) {
            setError("Error Sending feedback");
         } finally {
            setLoading(false);
            setTimeout(() => {
               navigate("/thank-you");
            }, 1000);
         }
      };
      updateRatings();
   };
   return (
      <div className="feedback-container">
         <div className="back-image">
            <IKImage urlEndpoint={urlEndpoint} path="feedback-background.jpg" />
         </div>
         <div className="feedback-component">
            <h2> Internet Booking Engine Feedback </h2>
            <div className="stars">
               {stars.map((_, index) => {
                  return (
                     <FaStar
                        key={index}
                        size={24}
                        onClick={() => handleClick(index + 1)}
                        onMouseOver={() => handleMouseOver(index + 1)}
                        onMouseLeave={handleMouseLeave}
                        color={
                           (hoverValue || currentValue) > index
                              ? colors.orange
                              : colors.grey
                        }
                        style={{
                           marginRight: 10,
                           cursor: "pointer",
                        }}
                     />
                  );
               })}
            </div>
            <div className="feedback">
               <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's your experience?"
               />
            </div>
            <div className="submit">
               <button
                  onClick={handleRatingSubmit}
                  disabled={
                     content.trim() === "" || currentValue === 0 || loading
                  }
                  style={{
                     opacity:
                        content.trim() === "" || currentValue === 0 || loading
                           ? "0.5"
                           : "1",
                     cursor:
                        content.trim() === "" || currentValue === 0 || loading
                           ? "not-allowed"
                           : "pointer",
                  }}>
                  {loading ? ". . ." : "SUBMIT"}
               </button>
               <Link to={"/"}>
                  <button>Remind Me Later</button>
               </Link>
            </div>
         </div>
         {!loading && error && (
            <SnackbarComponent content={error} type="error" />
         )}
      </div>
   );
};

export default FeedbackPage;
