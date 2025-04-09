import { useEffect, useState } from "react";
import { Feedback } from "../../Types/RoomResultPage";
import { Loader } from "../Loader/Loader";
import { BASE_URL } from "../../Util/API";
import { SnackbarComponent } from "../SnackbarComponent/SnackbarComponent";
import "./FeedBack.scss";
import FeedbackCard from "./FeedbackCard/FeedbackCard";
import { filterFunctions } from "../../Util/GeneralUtils";
import { FormattedMessage } from "react-intl";
export default function FeedBack({ roomTypeId }: { roomTypeId: number }) {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [data, setData] = useState<Feedback[]>([]);
   useEffect(() => {
      const getFeedbacks = async () => {
         setLoading(true);
         setError("");
         try {
            const response = await fetch(
               `${BASE_URL}/api/v1/roomModal/feedbacks/${roomTypeId}`
            );
            const responseData = await response.json();
            if (!response.ok) {
               setError(responseData.msg ?? "Failed to fetch feedbacks");
            }
            setData(responseData);
         } catch (error) {
            setError("Failed to fetch feedbacks");
         } finally {
            setLoading(false);
         }
      };
      getFeedbacks();
   }, []);

   const [selectedFilter, setSelectedFilter] = useState("No Filter");
   const filters = ["Highest", "Lowest", "Most Relevant", "Newest"];

   useEffect(() => {
      if (selectedFilter !== "No Filter") {
         setData((prev) => {
            if (filterFunctions[selectedFilter]) {
               return filterFunctions[selectedFilter](prev);
            }
            return prev;
         });
      }
   }, [selectedFilter]);

   return (
      <>
         <div className="feedback-title">
            <FormattedMessage
               id="Feedbacks"
               defaultMessage="Feedbacks"
               description=""
            />
         </div>
         <div className="sort-by">
            <FormattedMessage
               id="Sort By"
               defaultMessage="Sort By"
               description=""
            />
         </div>
         <div className="filters">
            {filters.map((filter) => (
               <button
                  style={
                     selectedFilter === filter
                        ? {
                             backgroundColor: "#26266d",
                             border: "1px solid  #9393e3",
                          }
                        : undefined
                  }
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}>
                  {selectedFilter === filter && <img src="check.png" alt="" />}
                  <span className="filter-text">
                     <FormattedMessage
                        id={filter}
                        defaultMessage={filter}
                        description=""
                     />
                  </span>
               </button>
            ))}
         </div>
         <div className="feedbacks">
            {data.length > 0 &&
               !loading &&
               data.map((feedback) => (
                  <FeedbackCard key={feedback.feedbackId} feedback={feedback} />
               ))}
            {loading && (
               <div style={{ marginTop: "50px" }}>
                  {" "}
                  <Loader size={70} />{" "}
               </div>
            )}
            {!loading && error && (
               <SnackbarComponent type="error" content={error} />
            )}
            {data.length == 0 && !loading && (
               <div
                  style={{
                     marginTop: "20px",
                     fontSize: "1.4rem",
                     fontWeight: "600",
                     color: "rgb(104, 115, 202)",
                  }}>
                  {" "}
                  No Reviews Yet!
               </div>
            )}
         </div>
      </>
   );
}
