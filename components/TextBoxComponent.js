// components/TextBoxComponent.js
import React, { useState } from "react";

export const TextInput = ({ label, placeholder, onChange }) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 text-sm font-medium">{label} <br /> </label>}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
} 

  export const SensitiveInput = ({ label, placeholder, onChange }) => {
    const [value, setValue] = useState("");
    const [isVisible, setIsVisible] = useState(false); // State to toggle visibility
  
    const handleChange = (e) => {
      setValue(e.target.value);
      if (onChange) onChange(e.target.value);
    };
  
    return (
      <div className="flex flex-col">
        {label && <label className="mb-1 text-sm font-medium">{label}</label>}
        <div className="relative flex items-center">
          <input
            type={isVisible ? "text" : "password"} // Toggle between text & password
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="border rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="absolute right-2 text-sm text-blue-500 hover:underline"
          >
            {isVisible ? "Hide" : "Show"}
          </button>
        </div>
      </div>
    );

};

