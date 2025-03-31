import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ReturnToMain } from '../components/Menu';
import { TextInput } from '../components/TextBoxComponent';



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

        const randPassData = {
            encPassword: encPass, // Assuming this is already hashed
            user: currentUser,
            username: username,
            website: website,
        };

        console.log(randPassData);
        await db.randomPass.add(randPassData);
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
            <input type='checkbox' />Capitalization<br />
            <input type='checkbox' />Numbers<br />
            <input type='checkbox' />Special Characters<br />
            <input type="number" placeholder='Password Length' /><br />
            <button>Generate Password</button> <br />
            <button className='save' onClick={handleSubmit}>Save Data</button>
        </div>
    );
};

export default GeneratePassword;
