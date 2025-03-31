import bcrypt from 'bcryptjs';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ReturnToMain } from '../components/Menu';
import { SALT } from '../components/salt';
import { SecurityQuestion, TextInput } from '../components/TextBoxComponent';
import { db } from '../db';


export const CreatePassphrase = () => {
    const router = useRouter(); // Use Next.js router
    const [website, setWebsite] = useState("");
    const [username, setUsername] = useState("");
    const [passphrase, setPassphrase] = useState("");
    const salt = SALT;
    const [q1, setQ1] = useState(0);
    const [q2, setQ2] = useState(0);
    const [q3, setQ3] = useState(0);
    const [q4, setQ4] = useState(0);
    const [q5, setQ5] = useState(0);
    const [qAnswer1, setQAnswer1] = useState("");
    const [qAnswer2, setQAnswer2] = useState("");
    const [qAnswer3, setQAnswer3] = useState("");
    const [qAnswer4, setQAnswer4] = useState("");
    const [qAnswer5, setQAnswer5] = useState("");
    const currentUser = typeof window !== "undefined" ? localStorage.getItem("currentUser") : "";


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
    

    const handleSecurityAnswerChange = (index, QNum, answer) => {


        //different questions
        switch (index) {
            case 1:
                setQ1(QNum);
                setQAnswer1(answer);
                break;
            case 2:
                setQ2(QNum);
                setQAnswer2(answer);
                break;
            case 3:
                setQ3(QNum);
                setQAnswer3(answer);
                break;
            case 4:
                setQ4(QNum);
                setQAnswer4(answer);
                break;
            case 5:
                setQ5(QNum);
                setQAnswer5(answer);
                break;
            default:
                break;
        }
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

        if (qAnswer1 == "" || qAnswer2 == "" || qAnswer3 == "" || qAnswer4 == "" || qAnswer5 == "") {
            alert('All five security questions must be answered.');
            return; // Exit early if any security question is unanswered
        }

        // Update passphrase based on the answers provided for q1 to q5
        const passphraseGenerated = [qAnswer1, qAnswer2, qAnswer3, qAnswer4, qAnswer5]
        .map((ans) => ans || "")  // Use current answers
        .join(""); // Concatenate answers
        
        const hashedPassword = bcrypt.hashSync(passphraseGenerated, salt);

        // Update the passphrase state
        setPassphrase(hashedPassword);

        //console.log(passphraseGenerated);
        //console.log(hashedPassword);


        if (website == "") {
            console.error('Website is required!');
            return; // Exit early if no website is provided
        }

        const passphraseData = {
            passphrase: passphrase, // Assuming this is already hashed
            user: currentUser,
            username: username,
            website: website,
            salt: salt,
            q1: q1,
            q2: q2,
            q3: q3,
            q4: q4,
            q5: q5
        };

        console.log(passphraseData);
        //const allUsers = await db.passphrases.toArray();
        //console.log(allUsers);

        //adds to local database
        await db.passphrases.add(passphraseData);
        //allUsers = await db.passphrases.toArray();
        //console.log(allUsers);
        alert(`Password for ${website} has been added`);
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
