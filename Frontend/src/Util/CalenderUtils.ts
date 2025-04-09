import { MinimumNightlyRateDateValue } from "../Types/LandingPage";

export function formatDate(date: Date): string {
   const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
   };

   return date.toLocaleDateString("en-US", options);
}

export function formatDateForPrice(date: Date): string {
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, "0");
   const day = String(date.getDate()).padStart(2, "0");

   return `${year}-${month}-${day}`;
}

export const getMinimumPriceInRange = (
   startDate: Date,
   endDate: Date,
   minimumNightlyRate: { [date: string]: MinimumNightlyRateDateValue }
): number | null => {
   let minPrice: number | null = null;

   // Iterate over the dates from startDate to endDate
   let currentDate = new Date(startDate);
   while (currentDate <= endDate) {
      const formattedDate = formatDateForPrice(currentDate);

      // Check if the formatted date exists in minimumNightlyRate
      if (minimumNightlyRate.hasOwnProperty(formattedDate)) {
         const nightlyRate = minimumNightlyRate[formattedDate].price;
         if (minPrice === null || nightlyRate < minPrice) {
            minPrice = nightlyRate;
         }
      }

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
   }

   return minPrice;
};

export function getFormattedDate(date: Date) {
   const day = date.getDate();
   const suffix = getOrdinalSuffix(day);
   const month = date.toLocaleString("default", { month: "short" });
   const weekday = date.toLocaleString("default", { weekday: "long" });

   return `${weekday} ${day}${suffix} ${month}`;
}

// Function to get the ordinal suffix
function getOrdinalSuffix(day: number) {
   if (day >= 11 && day <= 13) {
      return "th";
   }
   switch (day % 10) {
      case 1:
         return "st";
      case 2:
         return "nd";
      case 3:
         return "rd";
      default:
         return "th";
   }
}

export function getDaysDifference(startDate: Date, endDate: Date) {
   const start = new Date(startDate).getTime();
   const end = new Date(endDate).getTime();
   const difference = end - start;
   const daysDifference = Math.ceil(difference / (1000 * 3600 * 24));
   return daysDifference;
}
