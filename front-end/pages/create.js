import bcrypt from 'bcryptjs';
import React, { useState } from 'react';
import { ReturnToMain } from '../components/Menu';
import { SecurityQuestion, TextInput } from '../components/TextBoxComponent';
import { SALT } from '../components/salt';

export const Create = () => {
    const [securityAnswers, setSecurityAnswers] = useState({
        user: {username: ""},
        passphrase: { answer: ""},
        salt: {pswdSalt: ""},
        q1: { QNum: null},
        q2: { QNum: null},
        q3: { QNum: null},
        q4: { QNum: null},
        q5: { QNum: null},
    });

    const divStyle = {
        marginBottom: '200px',
        fontFamily: 'sans-serif',
    };

    const handleUsernameChange = (answer) => {
        setSecurityAnswers((prev) => ({
            ...prev,
            user: { username: answer }, 
        }));
    };
    

    const handleSecurityAnswerChange = (index, QNum, answer) => {
        setSecurityAnswers((prev) => {
            // Ensure we store QNum separately and answers in a different structure
            const updatedAnswers = {
                ...prev,
                [`q${index}`]: { QNum }, // Store only QNum for q1 to q5
                [`q${index}_answer`]: answer, // Store answers separately
            };
    
            // Generate passphrase by concatenating all stored answers
            const passphrase = [1, 2, 3, 4, 5]
                .map((num) => updatedAnswers[`q${num}_answer`] || "") // Ensure we use the latest state
                .join(""); // Concatenate answers
            
            const saveSalt = SALT;
            const hashedPassword = bcrypt.hashSync(passphrase, SALT);
            return {
                ...updatedAnswers,
                passphrase: { answer: hashedPassword }, // Store hashed passphrase
                salt: {pswdSalt : saveSalt},
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:8081/save-passphrase', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(securityAnswers)
            });

            const data = await response.json();
            console.log(securityAnswers);
            alert("Acccount and passphrase saved successfully!");
            router.push("/LoginPage");
        } catch (error) {
            console.error("Error saving account details: ", error);
        }
    };

    return (
        <div style={divStyle}>
            <ReturnToMain />
            <h1>Passphrase Generator</h1>
            <h2>Instructions</h2>
            <div>
                You can refresh the questions if you'd prefer new questions <br></br>
                Try to have at least one answer with a numerical value <br></br>
                Try to remember any capitilization
            </div>
            <h2>Login Information</h2>
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
