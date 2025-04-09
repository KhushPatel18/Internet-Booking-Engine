import { styled } from "@mui/system";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import { useAppSelector } from "../../redux/store";

const TimerDisplay = styled("div")(({ timeLeft }: { timeLeft: number }) => ({
   display: "flex",
   alignItems: "center",
   gap: "8px",
   fontSize: "1.8rem",
   color: "white",
   backgroundColor:
      timeLeft <= 100
         ? "#d71717b5"
         : timeLeft <= 300
         ? "#e7aa41de"
         : "#232691b5",
   padding: "8px",
   justifyContent: "center",
}));
import { FormattedMessage } from "react-intl";

const TimerIcon = styled(AccessAlarmIcon)({
   fontSize: "2.0rem",
   color: "white",
});

const CountdownTimer = () => {
   const timeLeft = useAppSelector((state) => state.ItinerarySlice.timeLeft);
   const minutes = Math.floor(timeLeft / 60);
   const seconds = Math.floor(timeLeft % 60);

   return (
      <TimerDisplay timeLeft={timeLeft}>
         <TimerIcon />
         <FormattedMessage
            id="timer-text"
            defaultMessage="{minutes} Minutes {seconds} Seconds left!"
            values={{ minutes, seconds }}
         />
         {/* {minutes} Minutes {seconds} Seconds left! */}
      </TimerDisplay>
   );
};

export default CountdownTimer;
