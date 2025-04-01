import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/router';
import { default as React, useEffect, useState } from 'react';
import secureLocalStorage from "react-secure-storage";
import { SensitiveInput } from '../components/TextBoxComponent';
import { db } from '../db';

export const PassphraseRetrieve = () => {
    const router = useRouter(); // Use Next.js router
    const [websiteList, setWebsiteList] = useState([]);
    const [questionList, setQuestionList] = useState([]);
    const [username, setUsername] = useState("");
    const [allQs, setAllQs] = useState([]);
    const [currentWebsite, setCurrentWebsite] = useState("");
    const [userInput, setUserInput] = useState("");
    const [salt, setSalt] = useState("");
    const [hashedPass, setHashedPass] = useState("");
    const [currUser, setCurrentUser] = useState("");
    const [userPassphrases, setUserPassphrases] = useState([]);
    const [allDecrypted, setAllDecrypted] = useState([]);
    const key = secureLocalStorage.getItem('key');

    //const input = "";
    useEffect(() => {
        const currentUserFromLocalStorage = secureLocalStorage.getItem("currentUser");
        setCurrentUser(currentUserFromLocalStorage);
        //console.log(`current user is ${currUser}`);
        handleFetchWebsites();
    }, [])

    useEffect(() => {
        if (currUser) {
            //console.log(`Current user after update: ${currUser}`);  // Log after currUser is updated
            handleFetchWebsites();
        }
    }, [currUser]); 

    useEffect(() => {
        if (userPassphrases) {
            //console.log(`Current user after update: ${currUser}`);  // Log after currUser is updated
            handleFetchWebsites();
        }
    }, [userPassphrases]); 

    useEffect(() => {
        const fetchQs = async () => {
            try {
                const response = await fetch('http://localhost:8081/SecurityQs');
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const qs = await response.json();
                setAllQs(qs);
            } catch (error) {
                console.error("Error fetching question data:", error);
            }
        };

        fetchQs();
    }, []); // Empty array default
    
    const handleFetchWebsites = async () => {
        try {
            // Fetch all entries from the passphrases table
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
              const userPassphrases = decryptedEntries.filter(entry => entry.user === currUser);
              setAllDecrypted(userPassphrases);

              // get just the websites
              const websites = userPassphrases.map(entry => entry.website);
      
              // Update state
              setUserPassphrases(userPassphrases);
              setWebsiteList(websites);
        } catch (error) {
            console.error('Failed to fetch websites:', error);
        }
    };

    const handleWebsiteClick = async (website) => {
        try {
            setCurrentWebsite(website);
    
            // Ensure allDecrypted is available
            if (!allDecrypted || allDecrypted.length === 0) {
                console.error("No decrypted data available.");
                return;
            }
    
            // Find account info by website
            const accountInfo = allDecrypted.find(entry => entry.website === website);
            if (!accountInfo) {
                console.error("No account found for website:", website);
                return;
            }
    
            // Destructure properties safely
            const { passphrase, user, username, website: web, salt, q1, q2, q3, q4, q5 } = accountInfo;
            console.log(accountInfo);
    
            // Find security questions
            const question1 = accountInfo.q1;
            const question2 = accountInfo.q2;
            const question3 = accountInfo.q3;
            const question4 = accountInfo.q4;
            const question5 = accountInfo.q5;
    
            // Set state
            setUsername(username);
            setQuestionList([question1, question2, question3, question4, question5]);
            setHashedPass(passphrase);
            setSalt(salt);
        } catch (error) {
            console.error("Failed to fetch Account Details:", error);
        }
    };

    const handlePasswordInput = (userInput) => {
        setUserInput(userInput);
    }

    const handlePasswordCheck = async () => {
        //const hashedInput = bcrypt.hashSync(userInput, salt);

        const isMatch = bcrypt.compareSync(userInput, hashedPass);

        if (isMatch)  {
            alert("That passphrase is correct");
        } else {
            alert("Passphrase is incorrect");
        }


    }

    const handleDelete = async () => {
        console.log(`Current website: ${currentWebsite}`);  // Check if website is set correctly
        console.log(`Hashed pass: ${hashedPass}`);          // Check if hashedPass is set correctly
        
        try {
            await db.passphrases
                .where('salt')
                .equals(salt)  // Matches the passphrase
                .delete();  // Deletes the matching entry
            console.log(`Deleted entry for ${currentWebsite}`);
            //window.location.reload();
        } catch (error) {
            console.error("Failed to delete entry:", error);
        }
    };
    

    return (
        <div>
            <h2>Passphrases</h2>
            <ul className='blockDiv'>
                {websiteList.length === 0 ?  (
                    <p>No Entries</p>
                ) : (
                websiteList.map((website, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleWebsiteClick(website)} 
                        className="website-button"
                    >
                        {website}
                    </button>
                )))}
            </ul>
            {currentWebsite && questionList.length >= 5 && (
                <>
                    <SensitiveInput 
                        label={ <> Username for {currentWebsite}: {username} <br /> 
                        Question 1: {questionList[0]} <br /> 
                        Question 2: {questionList[1]} <br /> 
                        Question 3: {questionList[2]} <br /> 
                        Question 4: {questionList[3]} <br /> 
                        Question 5: {questionList[4]}` 
                        </>
                        }
                        placeholder="Type Here" 
                        onChange={handlePasswordInput} 
                        value={userInput}
                    />
                    <button onClick={handlePasswordCheck}>Check</button>
                    <button onClick={() => router.push("/create")}>Forgot Password? (this will delete password and you can remake it)</button>
                    <button onClick={handleDelete}>Delete</button>
                </>
            )}
        </div>
    );
};

export const PasswordRetrieve = () => {
    const key = secureLocalStorage.getItem("key");



    return (
        <div>
            <h2>Generated Passwords</h2>
            <ul className='blockDiv'>
                {websiteList.length === 0 ?  (
                    <p>No Entries</p>
                ) : (
                websiteList.map((website, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleWebsiteClick(website)} 
                        className="website-button"
                    >
                        {website}
                    </button>
                )))}
            </ul>
            {currentWebsite && questionList.length >= 5 && (
                <>
                    <SensitiveInput 
                        label={ <> Username for {currentWebsite}: {username} <br /> 
                        Question 1: {questionList[0]} <br /> 
                        Question 2: {questionList[1]} <br /> 
                        Question 3: {questionList[2]} <br /> 
                        Question 4: {questionList[3]} <br /> 
                        Question 5: {questionList[4]}` 
                        </>
                        }
                        placeholder="Type Here" 
                        onChange={handlePasswordInput} 
                        value={userInput}
                    />
                    <button onClick={handlePasswordCheck}>Check</button>
                    <button onClick={() => router.push("/create")}>Forgot Password? (this will delete password and you can remake it)</button>
                    <button onClick={handleDelete}>Delete</button>
                </>
            )}
        </div>
    );
}