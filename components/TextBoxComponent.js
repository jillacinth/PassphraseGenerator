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
      {label && <label className="mb-1 text-sm font-medium">{label}</label>}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

