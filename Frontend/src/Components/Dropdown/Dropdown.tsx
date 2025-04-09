import React from "react";
import { Options } from "../../Types/LandingPage";
import "./Dropdown.scss";

interface DropdownProps {
   options: Options[];
   selectedOption: string;
   onOptionSelected: (option: Options) => void;
   logo?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
   options,
   selectedOption,
   onOptionSelected,
   logo,
}) => {
   return (
      <div className="dropdown-header">
         <img src={logo} alt="" />
         <select
            name=""
            id=""
            className="dropdown-button"
            value={selectedOption}
            onChange={(e) =>
               onOptionSelected(
                  options.find((opt) => opt.value === e.target.value)!
               )
            }>
            {options.map((option) => (
               <option value={option.value} key={option.value}>
                  {option.unicode}
                  {"  "}
                  {option.label}
               </option>
            ))}
         </select>
      </div>
   );
};

export default Dropdown;
