import { Rating } from "@mui/material";

import { Feedback } from "../../../Types/RoomResultPage";
import "../FeedBack.scss";
import { useState } from "react";
import { getColorForInitial } from "../../../Util/GeneralUtils";
import { getDaysDifference } from "../../../Util/CalenderUtils";
import { FormattedMessage } from "react-intl";
export default function FeedbackCard({ feedback }: { feedback: Feedback }) {
   const [liked, setLiked] = useState(false);
   const [disliked, setDisLiked] = useState(false);
   const [likedCount, setLikedCount] = useState<number>(feedback.helpful);
   const [dislikedCount, setDislikedCount] = useState(feedback.notHelpful);
   const [daysAgo, _] = useState<number>(
      getDaysDifference(feedback.createdAt, new Date())
   );

   const initial = feedback.name.charAt(0);
   const backgroundColor = getColorForInitial(initial);
   return (
      <div className="my-feedback-container" key={feedback.feedbackId}>
         <div className="profile-name-container">
            <div className="profile" style={{ backgroundColor }}>
               {feedback.name.charAt(0)}
            </div>
            <div className="name">{feedback.name}</div>
            <div className="time-ago">
               {daysAgo}{" "}
               <FormattedMessage
                  id="days ago"
                  defaultMessage="days ago"
                  description=""
               />
            </div>
            <div className="likes">
               <FormattedMessage
                  id="Helpful"
                  defaultMessage="Helpful"
                  description=""
               />
               <span className="like-count">{likedCount}</span>
            </div>
            <div className="likes">
               <FormattedMessage
                  id="Not Helpful"
                  defaultMessage="Not Helpful"
                  description=""
               />{" "}
               <span className="dislike-count">{dislikedCount}</span>
            </div>
         </div>
         <div className="ratings">
            <Rating name="read-only" value={feedback.rating} readOnly />
         </div>
         <div className="content">
            <FormattedMessage
               id={feedback.feedbackContent}
               defaultMessage={feedback.feedbackContent}
               description=""
            />
         </div>
         <div className="widgets">
            <button
               className="like-button"
               onClick={() => {
                  if (liked) {
                     setLikedCount((prev) => prev - 1);
                     setLiked(false);
                  } else {
                     setLikedCount((prev) => prev + 1);
                     setLiked(true);
                     setDisLiked(false);
                  }
               }}>
               {liked ? (
                  <div className="like-wrapper">
                     <img
                        style={{ height: "16px", width: "16px" }}
                        src="like.png"
                        alt="+"
                     />
                     <span className="ftag">
                        <FormattedMessage
                           id="Helpful"
                           defaultMessage="Helpful"
                           description=""
                        />
                     </span>
                  </div>
               ) : (
                  <div className="not-like-wrapper">
                     <img
                        style={{ height: "16px", width: "16px" }}
                        src="like.png"
                        alt="+"
                     />
                     <span className="ftag">
                        <FormattedMessage
                           id="Helpful"
                           defaultMessage="Helpful"
                           description=""
                        />
                     </span>
                  </div>
               )}
            </button>
            <button
               className="dislike-button"
               onClick={() => {
                  if (disliked) {
                     setDislikedCount((prev) => prev - 1);
                     setDisLiked(false);
                  } else {
                     setDislikedCount((prev) => prev + 1);
                     setDisLiked(true);
                     setLiked(false);
                  }
               }}>
               {disliked ? (
                  <div className="dislike-wrapper">
                     <img
                        style={{ height: "16px", width: "16px" }}
                        src="dislike.png"
                        alt="+"
                     />
                     <span className="ftag">
                        <FormattedMessage
                           id="Not Helpful"
                           defaultMessage="Not Helpful"
                           description=""
                        />
                     </span>
                  </div>
               ) : (
                  <div className="not-dislike-wrapper">
                     <img
                        style={{ height: "16px", width: "16px" }}
                        src="dislike.png"
                        alt="+"
                     />
                     <span className="ftag">
                        <FormattedMessage
                           id="Not Helpful"
                           defaultMessage="Not Helpful"
                           description=""
                        />
                     </span>
                  </div>
               )}
            </button>
         </div>
      </div>
   );
}
