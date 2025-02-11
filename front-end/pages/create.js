import React, { useState, useEffect } from 'react';
import { ReturnToMain } from '../components/Menu';
import { SensitiveInput, TextInput } from '../components/TextBoxComponent';

export const Create = () => {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]); // Store selected random questions
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Used to trigger re-fetching

    // Fetch questions when component mounts or refreshTrigger changes
    useEffect(() => {
        fetch('http://localhost:8081/SecurityQs')
            .then(res => res.json())
            .then(data => {
                setQuestions(data); // Update state with fetched questions
                selectRandomQuestions(data); // Select random questions
            })
            .catch(err => console.error("Error fetching data:", err));
    }, [refreshTrigger]); // Re-run effect when refreshTrigger updates

    // Function to select random questions
    const selectRandomQuestions = (data) => {
        // Pick 5 random questions from the list
        const shuffled = data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        setSelectedQuestions(selected);
    };

    // Function to refresh the questions
    const refreshQuestions = () => {
        setRefreshTrigger(prev => prev + 1); // Change state to trigger re-fetch
    };

    return (
        <div>
            <ReturnToMain />
            <h1>Passphrase Generator</h1>
            <TextInput label="Website" placeholder="Type here" />
            <TextInput label="Username/Email" placeholder="Type here" />
            <div>Select and answer 5 security questions:</div>

            {selectedQuestions.length > 0 ? (
                selectedQuestions.map((q,index) => (
                    <SensitiveInput key={q.QNum} label={`Question ${index + 1}: ${q.QContent}`} placeholder="Type here" />
                ))
            ) : (
                <p>Loading security questions...</p>
            )}

            {/* Refresh Button */}
            <button onClick={refreshQuestions}>Refresh Questions</button>
        </div>
    );
};

export default Create;
