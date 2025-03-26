import bcrypt from 'bcryptjs';
import { useRouter } from 'next/router';
import { default as React, useEffect, useState } from 'react';
import { ReturnToMain } from '../components/Menu';
import { SensitiveInput } from '../components/TextBoxComponent';
import { db } from '../db';

export const GetPassword = () => {
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
    //const input = "";

    const websiteButton = {
        marginBottom: '10px', /* Adds space below each button */
        display: 'block', /* Ensures buttons are on separate lines */
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const isAuthenticated = localStorage.getItem("authenticated");
            if (!isAuthenticated) {
                router.push("/LoginPage");
            }
        }
        //console.log(localStorage.getItem("currentUser"));
        const currentUserFromLocalStorage = localStorage.getItem("currentUser");
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
                //console.log(userData);
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
            setUserPassphrases(allPassphrases.filter(entry => entry.user === currUser));
            const websites = userPassphrases.map(entry => entry.website);
            setWebsiteList(websites);
            //console.log(allPassphrases);
            //console.log(currUser);
            //console.log(userPassphrases);
        } catch (error) {
            console.error('Failed to fetch websites:', error);
        }
    };

    const handleWebsiteClick = async (website) => {
        try {
            setCurrentWebsite(website);
            const accountInfo = await db.passphrases.where('website').equalsIgnoreCase(website).toArray();
            //console.log(accountInfo);
            const { passphrase, user, username, web, salt, q1, q2, q3, q4, q5 } = accountInfo[0];  // Get the first matching entry
            const question1 = allQs.find((quest) => quest.QNum === q1).QContent; //finds questions from all questions
            const question2 = allQs.find((quest) => quest.QNum === q2).QContent;
            const question3 = allQs.find((quest) => quest.QNum === q3).QContent;
            const question4 = allQs.find((quest) => quest.QNum === q4).QContent;
            const question5 = allQs.find((quest) => quest.QNum === q5).QContent;

            // Set the username and the questions list to state
            setUsername(username);
            setQuestionList([question1, question2, question3, question4, question5]);
            setHashedPass(passphrase);
            setSalt(salt);
            //console.log(salt);
        } catch (error) {
            console.error('Failed to fetch Account Details:', error);
        }

    }
    const handlePasswordInput = (userInput) => {
        setUserInput(userInput);
    }

    const handlePasswordCheck = async () => {
        //const hashedInput = bcrypt.hashSync(userInput, salt);

        const isMatch = bcrypt.compareSync(userInput, hashedPass);

        //console.log("User Input:", userInput);
        //console.log("Salt:", salt);
        //console.log("Hashed Input:", hashedInput);
        //console.log("Stored Hashed Pass:", hashedPass);

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
            <ReturnToMain />
            <h1>Retrieve Password</h1>
            <h2>Sites with Passphrases</h2>
            <ul>
                {websiteList.length === 0 ?  (
                    <p>No Entries</p>
                ) : (
                websiteList.map((website, index) => (
                    <button style={websiteButton}
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
                    <button style={websiteButton} onClick={handlePasswordCheck}>Check</button>
                    <button style={websiteButton} onClick={() => router.push("/create")}>Forgot Password? (this will delete password and you can remake it)</button>
                    <button style={websiteButton} onClick={handleDelete}>Delete</button>
                </>
            )}

        </div>
    );
};

export default GetPassword;
