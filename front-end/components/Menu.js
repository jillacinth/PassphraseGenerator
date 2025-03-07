import { useRouter } from "next/router";
import React from "react";

export const Menu = () => {
    const router = useRouter(); // Use Next.js router

    const handleLogout = () => {
        localStorage.removeItem("authenticated");
        router.push("/LoginPage");
    };

    return (
        <div>
            <button onClick={() => router.push("/getPassword")}>Retrieve Password</button> <br></br>
            <button onClick={() => router.push("/CreatePassphrase")}>Create Passphrase</button><br></br>
            <button onClick={handleLogout}>Logout</button><br></br>
        </div>
    );
};

export const ReturnToMain = () => {
    const router = useRouter(); // Use Next.js router

    return (
        <div>
            <button onClick={() => router.push("/")}>Return to Main</button>
        </div>
    );
};

//export default Menu;
