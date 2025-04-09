const languageMap: {
   [key: string]: string;
} = {
   Adults: "Adultos",
   Teens: "Adolesce",
   Kids: "Niños",
   "Team 10 Hotel": "Equipo 10 Hotel",
   "Team 18 Hotel": "Equipo 18 Hotel",
   "Team 12 Hotel": "Equipo 12 Hotel"
};

export const changeToSpanish = (language: string, word: string) => {
   if (language == "en") {
      return word;
   }

   return languageMap[word] ?? word;
};
