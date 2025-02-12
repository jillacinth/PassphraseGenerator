import React, { useState, useEffect } from 'react';
import { ReturnToMain } from '../components/Menu';
import { SecurityQuestion, TextInput } from '../components/TextBoxComponent';

export const Create = () => {
    const [securityAnswers, setSecurityAnswers] = useState({
        website: {site: ""}, 
        user: {username: ""},
        q1: { QNum: null, answer: "" },
        q2: { QNum: null, answer: "" },
        q3: { QNum: null, answer: "" },
        q4: { QNum: null, answer: "" },
        q5: { QNum: null, answer: "" },
    });

    const handleWebsiteChange = (answer) => {
        setSecurityAnswers((prev) => ({
            ...prev,
            ["website"]: { answer },
        }));
    };

    const handleUsernameChange = (answer) => {
        setSecurityAnswers((prev) => ({
            ...prev,
            ["user"]: { answer },
        }));
    };

    const handleSecurityAnswerChange = (index, QNum, answer) => {
        setSecurityAnswers((prev) => ({
            ...prev,
            [`q${index}`]: { QNum, answer },
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Saved Data:", securityAnswers);
    };

    return (
        <div>
            <ReturnToMain />
            <h1>Passphrase Generator</h1>
            <h2>Instructions</h2>
            <div>
                You can refresh the questions if you'd prefer new questions <br></br>
                Try to have at least one answer with a numerical value <br></br>
                Try to remember any capitilization
            </div>
            <h2>Login Information</h2>
            <TextInput label="Website" placeholder="Type here" onChange={handleWebsiteChange}/>
            <TextInput label="Username/Email" placeholder="Type here" onChange={handleUsernameChange}/>
            <h2>Select and answer 5 security questions:</h2>
            {[1, 2, 3, 4, 5].map((num) => (
                <div key={num}>
                    <div>Question {num}:</div>
                    <SecurityQuestion
                        index={num}
                        onAnswerChange={handleSecurityAnswerChange}
                    />
                </div>
            ))}

            <button onClick={handleSubmit}>Save Data</button>
        </div>
    );
};

export default Create;
