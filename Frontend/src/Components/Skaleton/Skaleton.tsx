import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export function SkeletonComponent() {
   return (
      <div
         className="skeleton-container"
         style={{
            width : '100%',
            marginRight: "20px",
            boxShadow: "2px 2px 5px #d2d4d7,0px 4px 10px #d9dbdd",
         }}>
         <div className="image-container">
            <Skeleton
               height={145}
               containerClassName="avatar-skeleton"
               style={{ borderRadius: "6px" }}
            />
         </div>
         <div
            style={{
               display: "flex",
               padding: "1.4375rem 1.2375rem",
               justifyContent: "space-between",
               marginBottom: "",
            }}>
            <div>
               <Skeleton count={2} width={100} />
            </div>
            <div>
               <Skeleton count={2} width={70} />
            </div>
         </div>
         <div style={{ padding: "1.4375rem 1.2375rem", marginBottom: "6px" }}>
            <Skeleton count={3} style={{ marginBottom: "6px" }} />
         </div>
         <div style={{ padding: "1.4375rem 1.2375rem", marginBottom: "6px" }}>
            <Skeleton
               height={"50px"}
               width={"120px"}
               style={{ borderRadius: "6px" }}
            />
         </div>
      </div>
   );
}

export function DealCardSkeleton() {
   return (
      <div
         style={{
            display: "flex",
            padding: "26px 23px",
            paddingRight: "16px",
            justifyContent: "space-between",
            backgroundColor: "rgba(255, 255, 255, 1)",
            border: "1px solid rgba(239, 240, 241, 1)",
            height: "130px",
         }}>
         <div style={{ flex: "2" }}>
            <Skeleton
               height={32}
               width={100}
               // style={{ marginBottom: "16px" }}
            />
            <Skeleton count={2} height={16} width={"100%"} />
         </div>
         <div
            style={{
               flex: "1",
               display: "flex",
               flexDirection: "column",
               alignItems: "flex-end",
            }}>
            <div>
               <Skeleton
                  height={32}
                  width={100}
                  // style={{ marginBottom: "16px" }}
               />
            </div>
            <div style={{ marginBottom: "6px" }}>
               <Skeleton
                  height={"32px"}
                  width={"120px"}
                  style={{ borderRadius: "6px" }}
               />
            </div>
         </div>
      </div>
   );
}
