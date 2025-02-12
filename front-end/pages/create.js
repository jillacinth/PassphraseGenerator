import React, { useState, useEffect } from 'react';
import { ReturnToMain } from '../components/Menu';
import { SensitiveInput, TextInput } from '../components/TextBoxComponent';

export const Create = () => {
    const [securityQuestions, setSecurityQuestions] = useState([]); // Store selected questions
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Used to trigger re-fetching

    useEffect(() => { //fetches Security questions from database
        fetch('http://localhost:8081/RandomSecurityQs')
            .then(res => res.json())
            .then(data => setSecurityQuestions(data))
            .catch(err => console.error("Error fetching data:", err));
    }, [refreshTrigger]); // Refreshes questions when button hit

    const refreshQuestions = () => {
        setRefreshTrigger(prev => prev + 1); //sets trigger for refresh
    }

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
            <TextInput label="Website" placeholder="Type here" />
            <TextInput label="Username/Email" placeholder="Type here" />
            <h2>Select and answer 5 security questions:</h2>
            {/* Refresh Button */}
            <button onClick={refreshQuestions}>Refresh Questions</button>
            {securityQuestions.map((q,index)=> (
                <SensitiveInput key={q.QNum} label={`Question ${index + 1}: ${q.QContent}`} placeholder="Type here" />
            ))}
        </div>
    );
};

export default Create;
