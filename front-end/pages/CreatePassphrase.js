import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
import React, { useState } from 'react';
import secureLocalStorage from "react-secure-storage";
import { ReturnToMain } from '../components/Menu';
import { SALT } from '../components/salt';
import { SecurityQuestion, TextInput } from '../components/TextBoxComponent';
import { db } from '../db';

export const CreatePassphrase = () => {
    const key = secureLocalStorage.getItem("key");
    const [website, setWebsite] = useState("");
    const [username, setUsername] = useState("");
    const [passphrase, setPassphrase] = useState("");
    const salt = SALT;
    const [questions, setQuestion] = useState({
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        q5: "",
    });
    const [qAnswers, setQAnswer] = useState({
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        q5: "",
    });
    const currentUser = typeof window !== "undefined" ? secureLocalStorage.getItem("currentUser") : "";
    
    const handleWebsiteChange = (answer) => {
        setWebsite(answer);
    };
    

    const handleUsernameChange = (answer) => {
        setUsername(answer);
    };
    

    const handleSecurityAnswerChange = (index, qObj, answer) => {
        const qContent = qObj.QContent;
        //different questions
        switch (index) {
            case 1:
                setQuestion((prev) => ({
                    ...prev, 
                    q1: qContent,
                }));
                setQAnswer((prev) => ({
                    ...prev, 
                    q1: answer,
                }));
                break;
            case 2:
                setQuestion((prev) => ({
                    ...prev, 
                    q2: qContent,
                }));
                setQAnswer((prev) => ({
                    ...prev, 
                    q2: answer,
                }));
                break;
            case 3:
                setQuestion((prev) => ({
                    ...prev, 
                    q3: qContent,
                }));
                setQAnswer((prev) => ({
                    ...prev, 
                    q3: answer,
                }));
                break;
            case 4:
                setQuestion((prev) => ({
                    ...prev, 
                    q4: qContent,
                }));
                setQAnswer((prev) => ({
                    ...prev, 
                    q4: answer,
                }));
                break;
            case 5:
                setQuestion((prev) => ({
                    ...prev, 
                    q5: qContent,
                }));
                setQAnswer((prev) => ({
                    ...prev, 
                    q5: answer,
                }));
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {        
        e.preventDefault();

        if (await db.passphrases.where('user').equals(currentUser).count() > 0) {
            const allPassphrases = await db.passphrases.toArray();
            const decryptedEntries = allPassphrases.map(entry => ({
                passphrase: CryptoJS.AES.decrypt(entry.passphrase, key).toString(CryptoJS.enc.Utf8),
                user: CryptoJS.AES.decrypt(entry.user, key).toString(CryptoJS.enc.Utf8),
                username: CryptoJS.AES.decrypt(entry.username, key).toString(CryptoJS.enc.Utf8),
                website: CryptoJS.AES.decrypt(entry.website, key).toString(CryptoJS.enc.Utf8),
                salt: CryptoJS.AES.decrypt(entry.salt, key).toString(CryptoJS.enc.Utf8),
                q1: CryptoJS.AES.decrypt(entry.q1, key).toString(CryptoJS.enc.Utf8),
                q2: CryptoJS.AES.decrypt(entry.q2, key).toString(CryptoJS.enc.Utf8),
                q3: CryptoJS.AES.decrypt(entry.q3, key).toString(CryptoJS.enc.Utf8),
                q4: CryptoJS.AES.decrypt(entry.q4, key).toString(CryptoJS.enc.Utf8),
                q5: CryptoJS.AES.decrypt(entry.q5, key).toString(CryptoJS.enc.Utf8),
            }));
            const existingEntry = decryptedEntries.find(entry => entry.user === currUser && entry.website === website);

            if (existingEntry) {
                alert('User already has password for this website');
                return;
            }
        }


        if (website == "") {
            alert('Website is required!');
            return; // Exit early if no website is provided
        } 

        if (username == "") {
            alert('Username is required!');
            return; // Exit early if no username is provided
        }

        if (!qAnswers.q1 || !qAnswers.q2 || !qAnswers.q3 || !qAnswers.q4 || !qAnswers.q5) {
            alert('All five security questions must be answered.');
            return; // Exit early if any security question is unanswered
        }

        // Update passphrase based on the answers provided for q1 to q5
        const passphraseGenerated = Object.values(qAnswers).join("");

        console.log("Passphrase is " + passphraseGenerated);
        
        const hashedPassword = bcrypt.hashSync(passphraseGenerated, salt);
        console.log(hashedPassword);
        // Update the passphrase state
        setPassphrase(hashedPassword);

        const passphraseData = {
            passphrase: CryptoJS.AES.encrypt(hashedPassword, key).toString(),
            user: CryptoJS.AES.encrypt(currentUser, key).toString(),
            username: CryptoJS.AES.encrypt(username, key).toString(),
            website: CryptoJS.AES.encrypt(website, key).toString(),
        salt: CryptoJS.AES.encrypt(salt, key).toString(),
        q1: CryptoJS.AES.encrypt(String(questions.q1 || ""), key).toString(),
        q2: CryptoJS.AES.encrypt(String(questions.q2 || ""), key).toString(),
        q3: CryptoJS.AES.encrypt(String(questions.q3 || ""), key).toString(),
        q4: CryptoJS.AES.encrypt(String(questions.q4 || ""), key).toString(),
        q5: CryptoJS.AES.encrypt(String(questions.q5 || ""), key).toString(),
        };

        //adds to local database
        //console.log(passphraseData);

        try {
            await db.passphrases.add(passphraseData);
            alert(`Password for ${website} has been added`);
          } catch (error) {
            console.error('Error adding passphrase:', error);
          }
        window.location.reload();
    };

    return (
        <div className='createDiv'>
            <div className='header'>
                <h1>Passphrase Generator</h1>
            </div>
            <ReturnToMain />
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

            <button className='save' onClick={handleSubmit}>Save Data</button>
        </div>
    );
};

export default CreatePassphrase;
