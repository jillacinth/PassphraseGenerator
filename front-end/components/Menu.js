import { useRouter } from "next/router";
import React from "react";

export const Menu = () => {
    const router = useRouter(); // Use Next.js router

    const handleLogout = () => {
        localStorage.removeItem("authenticated");
        localStorage.removeItem("currentUser");
        router.push("/LoginPage");
    };

    return (
        <div className="menu">
            <button className="mainMenu" onClick={() => router.push("/getPassword")}>Retrieve Password</button> <br></br>
            <button className="mainMenu" onClick={() => router.push("/CreatePassphrase")}>Create Passphrase</button><br></br>
            <button className="mainMenu" onClick={() => router.push("/GeneratePassword")}>Generate Password</button><br></br>
            <button className="mainMenu" onClick={handleLogout}>Logout</button><br></br>
        </div>
    );
};

export const ReturnToMain = () => {
    const router = useRouter(); // Use Next.js router


    return (
        <div>
            <button className="returnMain" onClick={() => router.push("/")}>Return to Main</button>
        </div>
    );
};

//export default Menu;
