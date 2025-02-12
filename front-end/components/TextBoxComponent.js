// components/TextBoxComponent.js
import React, { useState, useEffect } from "react";

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

}

export const SecurityQuestion = ({ index, onAnswerChange }) => {
  const [securityQ, setSecurityQ] = useState([]); // Store selected questions
  const [answer, setAnswer] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Used to trigger re-fetching
  
  const refreshQuestions = () => {
      setRefreshTrigger(prev => prev + 1); //sets trigger for refresh
  }

  useEffect(() => { //fetches Security questions from database
      fetch('http://localhost:8081/RandomSecurityQs')
          .then(res => res.json())
          .then(data => {
            setSecurityQ(data[0]);
            onAnswerChange(index,data[0].QNum, ""); //QNum is updated
          })
          .catch(err => console.error("Error fetching data:", err));
  }, [refreshTrigger]); // Refreshes questions when button hit
  

  const handleAnswerChange = (value) => {
    setAnswer(value);
    if (securityQ) {
      onAnswerChange(index, securityQ.QNum, value);
    }
  };

  return (
    <div>
      {securityQ ? (  // Since securityQ is a single object, no need for .map()
          <SensitiveInput
              label={securityQ.QContent}
              placeholder="Type here"
              onChange={handleAnswerChange}
          />
      ) : (
          <p>Loading question...</p>
      )}
      <button onClick={refreshQuestions}>Refresh Question</button>
    </div>
  );
};



