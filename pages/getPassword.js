import React from 'react';
import { ReturnToMain } from '../components/Menu';
import { SensitiveInput, TextInput } from '../components/TextBoxComponent';

export const GetPassword = () => {
    const handleInputChange = (value) => {
        console.log("Input Value:", value);
    };  
    return (
        <div>
            <ReturnToMain />
            <h1>Retrieve Password</h1>
            <div>Show a list of the websites saved</div>
            <TextInput label="Website" placeholder="Type here" onChange={handleInputChange} />
            <TextInput label="Username/Email" placeholder="Type here" onChange={handleInputChange} />
            <div>Add an entire button that then shows the list of passphrase questions with a textbox under it</div>
            <SensitiveInput label="What is your mother's maiden name, What year did you graduate high school, What was your childhood pet's name" placeholder="Type here" onChange={handleInputChange} />
            <div>Add a button that checks if it's correct. Make sure the password does not disappear so you can copy paste it?</div>
        </div>
    );
};

export default GetPassword;
