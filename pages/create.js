import React from 'react';
import { ReturnToMain } from '../components/Menu';
import { SensitiveInput, TextInput } from '../components/TextBoxComponent';

export const Create = () => {
    const handleInputChange = (value) => {
        console.log("Input Value:", value);
    };  
    return (
    <div>
        <ReturnToMain />
        <h1>Passphrase Generator</h1>
        <TextInput label="Website" placeholder="Type here" onChange={handleInputChange} />
        <TextInput label="Username/Email" placeholder="Type here" onChange={handleInputChange} />
        <div>Provide a list of Passphrase questions and the user picks some number of them</div>
        <SensitiveInput label="What is your mother's maiden name?" placeholder="Type here" onChange={handleInputChange} />
        <SensitiveInput label="What town did you grow up in?" placeholder="Type here" onChange={handleInputChange} />
    </div>
    );
};

export default Create;
