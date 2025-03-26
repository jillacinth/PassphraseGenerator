import { useRouter } from "next/router";
import React from "react";

export const Menu = () => {
    const router = useRouter(); // Use Next.js router

    const divStyle = {
        marginTop: '25px',
        marginBottom: '200px',
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontFamily: 'sans-serif',
        paddingTop: '50px',
        paddingBottom: '50px',
        width: '80%',
        margin: 'auto',
      }
    
      const buttonStyle = { 
        backgroundColor: 'transparent',
        color: '#6272a4',
        borderRadius: '6px',
        border: 'none',
        cursor: "pointer",
        fontSize: "24px",
        transition: "background 0.3s"
      }

    const handleLogout = () => {
        localStorage.removeItem("authenticated");
        localStorage.removeItem("currentUser");
        router.push("/LoginPage");
    };

    return (
        <div style={divStyle}>
            <button style={buttonStyle} onClick={() => router.push("/getPassword")}>Retrieve Password</button> <br></br>
            <button style={buttonStyle} onClick={() => router.push("/CreatePassphrase")}>Create Passphrase</button><br></br>
            <button style={buttonStyle} onClick={handleLogout}>Logout</button><br></br>
        </div>
    );
};

export const ReturnToMain = () => {
    const router = useRouter(); // Use Next.js router
    const buttonStyle = { 
        marginTop: '10px',
        backgroundColor: '#f0f0f0',
        color: '#6272a4',
        borderRadius: '6px',
        border: 'none',
        cursor: "pointer",
        fontSize: "16px",
        transition: "background 0.3s"
    }

    return (
        <div>
            <button style={buttonStyle} onClick={() => router.push("/")}>Return to Main</button>
        </div>
    );
};

//export default Menu;
