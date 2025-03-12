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
    const input = "";

    useEffect(() => {
        if (typeof window !== "undefined") {
            const isAuthenticated = localStorage.getItem("authenticated");
            if (!isAuthenticated) {
                router.push("/LoginPage");
            }
        }
    }, [])
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
            const currentUser = localStorage.getItem("currentUser");
            const allPassphrases = await db.passphrases.toArray();
            const userPassphrases = allPassphrases.filter(entry => entry.user === currentUser);
            const websites = userPassphrases.map(entry => entry.website);
            setWebsiteList(websites);
        } catch (error) {
            console.error('Failed to fetch websites:', error);
        }
    };

    const handleWebsiteClick = async (website) => {
        try {
            setCurrentWebsite(website);
            const accountInfo = await db.passphrases.where('website').equalsIgnoreCase(website).toArray();
            console.log(accountInfo[0]);
            const { passphrase, use, username, web, salt, q1, q2, q3, q4, q5 } = accountInfo[0];  // Get the first matching entry
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
            console.log(passphrase);
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

    return (
        <div>
            <ReturnToMain />
            <h1>Retrieve Password</h1>
            <h2>Sites with Passphrases</h2>
            <button onClick={handleFetchWebsites}>Show Websites</button>
            <ul>
                {websiteList.map((website, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleWebsiteClick(website)} 
                        className="website-button"
                    >
                        {website}
                    </button>
                ))}
            </ul>
            <SensitiveInput 
                label={"Username for " + currentWebsite + ": " + username + "\n" + questionList[0] + ", " + questionList[1] + ", " + questionList[2] +  ", " + questionList[3] + ", " + questionList[4]}
                placeholder="Type Here" onChange={handlePasswordInput} value={userInput}
            />
            <button onClick={handlePasswordCheck}>Check</button> <br></br>
            <button onClick={() => router.push("/create")}>Forgot Password? (this will delete password and you can remake it)</button><br />

        </div>
    );
};

export default GetPassword;
