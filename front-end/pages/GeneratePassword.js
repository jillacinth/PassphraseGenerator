import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ReturnToMain } from '../components/Menu';
import { TextInput } from '../components/TextBoxComponent';
import cryptoRandomString from 'crypto-random-string';

export const GeneratePassword = () => {
    const router = useRouter(); // Use Next.js router
    const [website, setWebsite] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const currentUser = typeof window !== "undefined" ? localStorage.getItem("currentUser") : "";
    const [passOptions, setPassOptions] = useState({
        capital: false,
        nums: false,
        special: false,
        length: null,
    })

    useEffect(() => {
          if (typeof window !== "undefined") {
              const isAuthenticated = localStorage.getItem("authenticated");
              if (!isAuthenticated) {
                  router.push("/LoginPage");
              }
          }
      }, [])
      
    const handleWebsiteChange = (answer) => {
        setWebsite(answer);
    };
    

    const handleUsernameChange = (answer) => {
        setUsername(answer);
    };

    const handleCapital = () => {
        setPassOptions((prev) => ({
            ...prev, 
            capital: true,
        }));;
    };

    const handleNum = () => {
        setPassOptions((prev) => ({
            ...prev, 
            nums: true,
        }));
    };

    const handleSpecial = () => {
        setPassOptions((prev) => ({
            ...prev, 
            special: true,
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
            encPassword: password, // need to encrypt this
            user: currentUser,
            username: username,
            website: website,
        };

        console.log(randPassData);
        //await db.randomPass.add(randPassData);
        alert(`Password for ${website} has been added`);
        //window.location.reload();
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
            <input type="number" placeholder='Password Length' onChange={handleLength}/><br />
            <button onClick={handleGenerate}>Generate Password</button> <br />
            <div>{password}</div>
            <button className='save' onClick={handleSubmit}>Save Data</button>
        </div>
    );
};

export default GeneratePassword;
