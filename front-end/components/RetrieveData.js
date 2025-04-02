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
    
    const safeDecrypt = (ciphertext, key) => {
        try {
            const decrypted = CryptoJS.AES.decrypt(ciphertext, key);
            const utf8Text = decrypted.toString(CryptoJS.enc.Utf8);
            if (utf8Text === "") {
                throw new Error("Decryption result is empty or malformed.");
            }
            return utf8Text;
        } catch (error) {
            //console.error("Decryption failed for ciphertext", ciphertext, error);
            return "";  // Return an empty string or a default value if decryption fails
        }
    };
    
    const handleFetchWebsites = async () => {
        try {
            const allPassphrases = await db.passphrases.toArray();
            //console.log(allPassphrases);
            const decryptedEntries = allPassphrases.map(entry => {
                return {
                    passphrase: safeDecrypt(entry.passphrase, key),
                    user: safeDecrypt(entry.user, key),
                    username: safeDecrypt(entry.username, key),
                    website: safeDecrypt(entry.website, key),
                    salt: safeDecrypt(entry.salt, key),
                    q1: safeDecrypt(entry.q1, key),
                    q2: safeDecrypt(entry.q2, key),
                    q3: safeDecrypt(entry.q3, key),
                    q4: safeDecrypt(entry.q4, key),
                    q5: safeDecrypt(entry.q5, key),
                };
            });
            
    
            const userPassphrases = decryptedEntries.filter(entry => entry.user === currUser);
            setAllDecrypted(userPassphrases);
    
            const websites = userPassphrases.map(entry => entry.website);
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
    
            // Find security questions
            const question1 = accountInfo.q1;
            const question2 = accountInfo.q2;
            const question3 = accountInfo.q3;
            const question4 = accountInfo.q4;
            const question5 = accountInfo.q5;
            console.log(allDecrypted);
    
            // Set state
            setUsername(accountInfo.username);
            setQuestionList([question1, question2, question3, question4, question5]);
            setHashedPass(accountInfo.passphrase);
            setSalt(accountInfo.salt);
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
        try {
            // Fetch all entries from the database and decrypt them
            const allEntries = await db.passphrases.toArray();
            
            // Find the matching entry based on the website
            const entryToDelete = allEntries.find(entry => {
                const decryptedWebsite = CryptoJS.AES.decrypt(entry.website, key).toString(CryptoJS.enc.Utf8);
                return decryptedWebsite === currentWebsite;
            });
    
            if (entryToDelete) {
                // Delete the matching entry using the 'num' field (the primary key)
                await db.passphrases.delete(entryToDelete.num);  // Use 'num' as the key for deletion
                console.log(`Deleted entry for ${currentWebsite}`);
                setCurrentUser("");
            } else {
                console.log(`No matching entry found for ${currentWebsite}`);
            }
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
                    <div>
                        <button 
                            key={index} 
                            onClick={() => handleWebsiteClick(website)} 
                            className="website-button"
                        >
                            {website}
                        </button>
                        <br />
                    </div>
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
                        Question 5: {questionList[4]} 
                        </>
                        }
                        placeholder="Type Here" 
                        onChange={handlePasswordInput} 
                        value={userInput}
                    />
                    <button onClick={handlePasswordCheck}>Check</button> <br />
                    <button onClick={handleDelete}>Delete</button>
                </>
            )}
        </div>
    );
};

export const PasswordRetrieve = () => {
    const key = secureLocalStorage.getItem("key");
    const [currUser, setCurrentUser] = useState("");
    const [currentWebsite, setCurrentWebsite] = useState("");
    const [userPass, setUserPass] = useState([]);
    const [websiteList, setWebsiteList] = useState([]);
    const [username, setUsername] = useState("");
    const [sitePassword, setSitePassword] = useState("");

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
        if (userPass) {
            //console.log(`Current user after update: ${currUser}`);  // Log after currUser is updated
            handleFetchWebsites();
        }
    }, [userPass]); 

    const safeDecrypt = (ciphertext, key) => {
        try {
            const decrypted = CryptoJS.AES.decrypt(ciphertext, key);
            const utf8Text = decrypted.toString(CryptoJS.enc.Utf8);
            if (utf8Text === "") {
                throw new Error("Decryption result is empty or malformed.");
            }
            return utf8Text;
        } catch (error) {
            //console.error("Decryption failed for ciphertext", ciphertext, error);
            return "";  // Return an empty string or a default value if decryption fails
        }
    };
    
    const handleFetchWebsites = async () => {
        try {
            const allPasswords = await db.passwords.toArray();
            const decryptedEntries = allPasswords.map(entry => ({
                password: safeDecrypt(entry.password, key),
                user: safeDecrypt(entry.user, key),
                username: safeDecrypt(entry.username, key),
                website: safeDecrypt(entry.website, key),
            }));
    
            const userPasswords = decryptedEntries.filter(entry => entry.user === currUser);
            // get just the websites
            const websites = userPasswords.map(entry => entry.website);
    
            // Update states
            setUserPass(userPasswords);
            setWebsiteList(websites);
            //(userPass);
      } catch (error) {
          console.error('Failed to fetch websites:', error);
      }

    };

    const handleWebsiteClick = async (website) => {
        try {
            setCurrentWebsite(website);
    
            if (!userPass || userPass.length === 0) {
                console.error("No decrypted data available.");
                return;
            }
    
            // Find account info by website
            const accountInfo = userPass.find(entry => entry.website === website);
            if (!accountInfo) {
                console.error("No account found for website:", website);
                return;
            }
            //console.log(accountInfo);
    
            setSitePassword(accountInfo.password);
        } catch (error) {
            console.error("Failed to fetch Account Details:", error);
        }
    };

    const HandleHidePass = async () => {
        setSitePassword("");
    };

    const handleDelete = async (website) => {
        try {
            // Fetch all entries from the database and decrypt them
            const allEntries = await db.passwords.toArray();
            
            // Find the matching entry based on the website
            const entryToDelete = allEntries.find(entry => {
                const decryptedWebsite = CryptoJS.AES.decrypt(website, key).toString(CryptoJS.enc.Utf8);
                return decryptedWebsite === currentWebsite;
            });
    
            if (entryToDelete) {
                // Delete the matching entry using the 'num' field (the primary key)
                await db.passwords.delete(entryToDelete.num);  // Use 'num' as the key for deletion
                console.log(`Deleted entry for ${currentWebsite}`);
            } else {
                console.log(`No matching entry found for ${currentWebsite}`);
            }
        } catch (error) {
            console.error("Failed to delete entry:", error);
        }
    };

    return (
        <div>
        <h2>Generated Passwords</h2>
        {userPass.length === 0 ? (
            <p>No Entries</p>
        ) : (
            <div>
                <div> 
                {sitePassword && (
                    <>
                    <div className='blockDiv'>
                        Password for {currentWebsite}: {sitePassword}
                    </div>
                    <button onClick={HandleHidePass}>Hide Password</button>
                    </>
                )}
                </div>
                <table className="password-table">
                    <thead>
                        <tr>
                            <th>Website</th>
                            <th>Username</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userPass.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.website}</td>
                                <td>{entry.username}</td>
                                <td>
                                    <button onClick={() => handleWebsiteClick(entry.website)}>
                                        View Password
                                    </button>
                                    <button onClick={() => handleDelete(entry.website)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
    );
}