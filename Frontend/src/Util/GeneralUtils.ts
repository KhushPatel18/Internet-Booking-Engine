import { Feedback } from "../Types/RoomResultPage";
import { getDaysDifference } from "./CalenderUtils";

export const formatGuests = (selectedGuests: Record<string, number>) => {
   const keys = Object.keys(selectedGuests);
   let result = "";
   keys.forEach((key) => (result += `${key}:${selectedGuests[key]},`));
   return result.slice(0, result.length - 1);
};

export const embedLinks: { [key: string]: string } = {
   GRAND_DELUXE:
      "https://momento360.com/e/u/a8da64fee2fb42b2a0f0f8a9ed81668b?utm_campaign=embed&utm_source=other&heading=-31.9&pitch=-9.4&field-of-view=100&size=medium&display-plan=true",
   SUPER_DELUXE:
      "https://momento360.com/e/u/afb2dc4f2b1a4c37b2af46b25fa28a65?utm_campaign=embed&utm_source=other&heading=-51.01&pitch=-22.75&field-of-view=75&size=medium&display-plan=true",
   FAMILY_DELUXE:
      "https://momento360.com/e/u/903cadd0093b4eca9daeb536a2160479?utm_campaign=embed&utm_source=other&heading=8.41&pitch=-21.92&field-of-view=75&size=medium&display-plan=true",
   STANDARD_SUITE:
      "https://momento360.com/e/u/3e8baf5c95bb4fe381d502624e5d3f5e?utm_campaign=embed&utm_source=other&heading=0&pitch=0&field-of-view=75&size=medium&display-plan=true",
   GARDEN_SUITE:
      "https://momento360.com/e/u/a17ef4707a5d478489c6cfb399b9e17d?utm_campaign=embed&utm_source=other&heading=0&pitch=0&field-of-view=75&size=medium&display-plan=true",
   COUPLE_SUITE:
      "https://momento360.com/e/u/a17ef4707a5d478489c6cfb399b9e17d?utm_campaign=embed&utm_source=other&heading=0&pitch=0&field-of-view=75&size=medium&display-plan=true",
};

export const getColorForInitial = (initial: string) => {
   const colorMap: {
      [key: string]: string;
   } = {
      A: "#FF5733",
      B: "#FFBD33",
      C: "#FFDB58",
      D: "#C0FF33",
      E: "#33FFA8",
      F: "#33FFE6",
      G: "#33A8FF",
      H: "#3353FF",
      I: "#8033FF",
      J: "#D933FF",
      K: "#FF33E9",
      L: "#FF3373",
      M: "#FF3333",
      N: "#FF8C33",
      O: "#FFC933",
      P: "#FFE133",
      Q: "#E6FF33",
      R: "#85FF33",
      S: "#33FF6B",
      T: "#33FFC8",
      U: "#33B4FF",
      V: "#3384FF",
      W: "#3359FF",
      X: "#6533FF",
      Y: "#B033FF",
      Z: "#FF33F1",
   };

   return colorMap[initial.toUpperCase()] || "#ccc";
};

export const generateRandomCount = (num: number) => {
   return Math.floor(Math.random() * num) + 1;
};

// Highest rating first
export const applyHighest = (data: Feedback[]): Feedback[] => {
   return data.slice().sort((a, b) => b.rating - a.rating);
};

// Lowest rating first
export const applyLowest = (data: Feedback[]): Feedback[] => {
   return data.slice().sort((a, b) => a.rating - b.rating);
};

// Most relevant (useful - not useful) first
export const applyMostRelevant = (data: Feedback[]): Feedback[] => {
   return data
      .slice()
      .sort((a, b) => b.helpful - b.notHelpful - (a.helpful - a.notHelpful));
};

// Most recent first
export const applyNewest = (data: Feedback[]): Feedback[] => {
   return data.slice().sort((a, b) => {
      const daysAgoA = getDaysDifference(new Date(a.createdAt), new Date());
      const daysAgoB = getDaysDifference(new Date(b.createdAt), new Date());
      return daysAgoB - daysAgoA;
   });
};

type FeedbackFilterFunction = (data: Feedback[]) => Feedback[];

// Define the structure of the filterFunctions object
export const filterFunctions: Record<string, FeedbackFilterFunction> = {
   Highest: applyHighest,
   Lowest: applyLowest,
   "Most Relevant": applyMostRelevant,
   Newest: applyNewest,
};
