import CryptoJS from 'crypto-js';
import cryptoRandomString from 'crypto-random-string';
import React, { useState } from 'react';
import secureLocalStorage from "react-secure-storage";
import { ReturnToMain } from '../components/Menu';
import { TextInput } from '../components/TextBoxComponent';
import { db } from '../db';

export const GeneratePassword = () => {
    //const router = useRouter(); // Use Next.js router
    const [website, setWebsite] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const currentUser = typeof window !== "undefined" ? secureLocalStorage.getItem("currentUser") : "";
    const [passOptions, setPassOptions] = useState({
        capital: false,
        nums: false,
        special: false,
        length: null,
    });
    const key = secureLocalStorage.getItem("key");
      
    const handleWebsiteChange = (answer) => {
        setWebsite(answer);
    };
    

    const handleUsernameChange = (answer) => {
        setUsername(answer);
    };

    const handleCapital = () => {
        setPassOptions((prev) => ({
            ...prev, 
            capital: !prev.capital,
        }));;
    };

    const handleNum = () => {
        setPassOptions((prev) => ({
            ...prev, 
            nums: !prev.nums,
        }));
    };

    const handleSpecial = () => {
        setPassOptions((prev) => ({
            ...prev, 
            special: !prev.special,
        }));
    };

    const handleLength = (e) => {
        let len = parseInt(e.target.value, 10); // Convert to an integer
        if (isNaN(len) || len <= 0) {
            len = 12; // Default length if invalid
        }
        setPassOptions((prev) => ({ ...prev, length: len }));
    };
    
    

    const handleGenerate = async (e) => {
        let result = '';
        let characters = 'abcdefghijklmnopqrstuvwxyz';

        if (!passOptions.length || isNaN(passOptions.length) || passOptions.length < 1) {
            alert("Please specify a valid password length.");
            return;
        } else if (passOptions.length > 100){
            alert("Specified length is too long");
            return;
        }
        //alert(passOptions.length);
        const len = passOptions.length;
    
        if (passOptions.capital) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (passOptions.nums) characters += '0123456789';
        if (passOptions.special) characters += '~`!@#$%^&*()-_+={}[]|\\;:"<>,./?';
    
        result = cryptoRandomString({ length: len, characters: characters });
        setPassword(result);
    };

    const handleSubmit = async (e) => {        
        e.preventDefault();

        if (await db.passwords.where('user').equals(currentUser).count() > 0) {
            const allPasswords = await db.passwords.toArray();
            const decryptedEntries = allPasswords.map(entry => ({
            password: CryptoJS.AES.decrypt(entry.password, key).toString(CryptoJS.enc.Utf8),
            user: CryptoJS.AES.decrypt(entry.user, key).toString(CryptoJS.enc.Utf8),
            username: CryptoJS.AES.decrypt(entry.username, key).toString(CryptoJS.enc.Utf8),
            website: CryptoJS.AES.decrypt(entry.website, key).toString(CryptoJS.enc.Utf8),
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

        if (password == "") {
            alert("Generate a Password!");
            return;
        }

        const randPassData = {
            password: CryptoJS.AES.encrypt(password, key).toString(), // need to encrypt this
            user: CryptoJS.AES.encrypt(currentUser, key).toString(),
            username: CryptoJS.AES.encrypt(username, key).toString(),
            website: CryptoJS.AES.encrypt(website, key).toString(),
        };

        console.log(randPassData);
        await db.passwords.add(randPassData);
        alert(`Password for ${website} has been added`);
        window.location.reload();
    };

    return (
        <div className='createDiv'>
            <div className='header'>
                <h1>Passphrase Generator</h1>
            </div>
            <ReturnToMain />
            <h2>Random Password Generator</h2>
            <TextInput label="Website" placeholder="Type here" onChange={handleWebsiteChange}/>
            <TextInput label="Username/Email" placeholder="Type here" onChange={handleUsernameChange}/>
            <input type='checkbox' checked={passOptions.capital} onChange={handleCapital}/>Capitalization<br />
            <input type='checkbox' checked={passOptions.nums} onChange={handleNum}/>Numbers<br />
            <input type='checkbox' checked={passOptions.special} onChange={handleSpecial}/>Special Characters<br />
            <label htmlFor='passwordLength'>Password Length</label>
            <input type="number" id="passwordLength" placeholder='Type here' onChange={handleLength}/><br />
            <button onClick={handleGenerate}>Generate Password</button> <br />
            { password && (
                <>
                <div style={{textAlign: 'center'}} className='blockDiv'>{password}</div>
                <button className='save' onClick={handleSubmit}>Save Data</button>
                </>
            )}

            
        </div>
    );
};

export default GeneratePassword;
