// components/TextBoxComponent.js
import React, { useEffect, useState } from "react";
//import '../index.css';

export const TextInput = ({ label, placeholder, onChange }) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  const divStyle = {
    marginBottom: '20px', // Adds space below each div
    padding: '10px',      // Adds space inside the div
  };

  return (
    <div style={divStyle}>
      {label && <label>{label} <br /> </label>}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
} 

export const SensitiveInput = ({ label, placeholder, onChange }) => {
  const [value, setValue] = useState("");
  const [isVisible, setIsVisible] = useState(false); // State to toggle visibility
  
  const divStyle = {
    marginBottom: '20px', // Adds space below each div
    padding: '10px',      // Adds space inside the div
  };


  const handleChange = (e) => {
    setValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <div style={divStyle}>
      {label && <label>{label}</label>}
      <div>
        <input
          type={isVisible ? "text" : "password"} // Toggle between text & password
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
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
  
  const divStyle = {
    marginBottom: '20px',  // Adds space between this and the next div
    padding: '15px',       // Adds space inside the div content
    backgroundColor: '#f0f0f0', // Example background for better visibility
  }

  const buttonStyle = { 
    backgroundColor: '#6272a4',
    color: 'white',
    borderRadius: '6px',
    border: 'none',
    cursor: "pointer",
    fontSize: "16px",
    transition: "background 0.3s"
  }

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
    <div style={divStyle}>
      {securityQ ? (  // Since securityQ is a single object, no need for .map()
          <SensitiveInput
              label={securityQ.QContent}
              placeholder="Type here"
              onChange={handleAnswerChange}
          />
      ) : (
          <p>Loading question...</p>
      )}
      <button style={buttonStyle} onClick={refreshQuestions}>Refresh Question</button>
    </div>
  );
};

export const SecurityQuestionLogin = ({ index, onAnswerChange }) => {
  const [securityQ, setSecurityQ] = useState([]);
  const [answer, setAnswer] = useState("");
  
  const divStyle = {
    marginBottom: '20px',  // Adds space between this and the next div
    padding: '15px',       // Adds space inside the div content
    backgroundColor: '#f0f0f0', // Example background for better visibility
  }

  const buttonStyle = { 
    backgroundColor: '#6272a4',
    color: 'white',
    borderRadius: '6px',
    border: 'none',
    cursor: "pointer",
    fontSize: "16px",
    transition: "background 0.3s"
  }


      useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8081/SecurityQs');
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await response.json();
                //console.log(userData);
                setUsers(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUsers();
    }, []); // Empty array default

    // Handle input change for username
    const handleUsernameChange = (usernameInput) => {
        setUsername(usernameInput);
    };
  

  const handleAnswerChange = (value) => {
    setAnswer(value);
    if (securityQ) {
      onAnswerChange(index, securityQ.QNum, value);
    }
  };

  return (
    <div style={divStyle}>
      {securityQ ? (  // Since securityQ is a single object, no need for .map()
          <SensitiveInput
              label={securityQ.QContent}
              placeholder="Type here"
              onChange={handleAnswerChange}
          />
      ) : (
          <p>Loading question...</p>
      )}
      <button style={buttonStyle} onClick={refreshQuestions}>Refresh Question</button>
    </div>
  );
};

