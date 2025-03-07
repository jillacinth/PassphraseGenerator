import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { TextInput } from '../components/TextBoxComponent';

export const LoginPage = () => {
    const router = useRouter(); // Use Next.js router
    const [usernameInput, setUsername] = useState("");
    const [users, setUsers] = useState([]);
    const [allQs, setAllQs] = useState([]);
    const [securityQs, setSecurityQs] = useState({
        q1: { QNum: null, question: ""},
        q2: { QNum: null, question: ""},
        q3: { QNum: null, question: ""},
        q4: { QNum: null, question: ""},
        q5: { QNum: null, question: ""},
    });

    const divStyle = {
        marginBottom: '20px',
        backgroundColor: '#f0f0f0',
    };
    
    const buttonStyle = { 
        backgroundColor: '#6272a4',
        color: 'white',
        borderRadius: '6px',
        border: 'none',
        cursor: "pointer",
        fontSize: "16px",
        transition: "background 0.3s"
    };

    // Fetch users from the database (assuming your backend is already set up)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8081/Users');
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await response.json();
                //console.log(userData);
                setUsers(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUsers();
    }, []); // Empty array default

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

    // Handle input change for username
    const handleUsernameChange = (usernameInput) => {
        setUsername(usernameInput);
    };

    useEffect(() => {
        console.log("Updated securityQs: ", securityQs);
    }, [securityQs]);  // This will run whenever securityQs is updated
    

    // Handle login logic
    const handleLogin = () => {
        // Log the username entered by the user
        console.log("Entered Username: ", usernameInput);
    
        if (users && users.length > 0) {
            const user = users.find((user) => user.Username === usernameInput);
    
            // Log the found user to verify
            console.log("Found User: ", user);
    
            if (user) {
                // Access and log the specific columns
                setSecurityQs((prev) => ({
                    ...prev,
                    ["q1"]: {QNum: user.Q1, question: allQs.find((quest) => quest.QNum === user.Q1).QContent},
                    ["q2"]: {QNum: user.Q2, question: allQs.find((quest) => quest.QNum === user.Q2).QContent},
                    ["q3"]: {QNum: user.Q3, question: allQs.find((quest) => quest.QNum === user.Q3).QContent},
                    ["q4"]: {QNum: user.Q4, question: allQs.find((quest) => quest.QNum === user.Q4).QContent},
                    ["q5"]: {QNum: user.Q5, question: allQs.find((quest) => quest.QNum === user.Q5).QContent},
                }));
    
                //router.push("/dashboard");  // Redirect to dashboard or another page
            } else {
                console.log("User not found");
                alert("User not found. Please try again or create a new account.");
            }
        } else {
            console.log("No users found or data is empty.");
        }
    };
    

    return (
        <div style={divStyle}>
            <h1>Login or Create New user</h1>
            <TextInput 
                label="Enter Your Username" 
                placeholder="Type here" 
                onChange={handleUsernameChange} 
                value={usernameInput} // Bind the username to input field
            />

            <button style={buttonStyle} onClick={handleLogin}>Login</button>
            <button style={buttonStyle} onClick={() => router.push("/create")}>Create New User</button><br />
        </div>
    );
};

export default LoginPage;
