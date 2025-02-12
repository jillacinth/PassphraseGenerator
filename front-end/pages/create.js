import React, { useState, useEffect } from 'react';
import { ReturnToMain } from '../components/Menu';
import { SecurityQuestion, TextInput } from '../components/TextBoxComponent';

export const Create = () => {
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
            <div>Question 1:</div>
            <SecurityQuestion />            
            <div>Question 2:</div>
            <SecurityQuestion />
            <div>Question 3:</div>
            <SecurityQuestion />
            <div>Question 4:</div>
            <SecurityQuestion />
            <div>Question 5:</div>
            <SecurityQuestion />
        </div>
    );
};

export default Create;
