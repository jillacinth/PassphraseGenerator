import { useRouter } from "next/router";
import React from "react";

export const Menu = () => {
    const router = useRouter(); // Use Next.js router

    return (
        <div>
            <button onClick={() => router.push("/getPassword")}>Go to GetPassword</button> <br></br>
            <button onClick={() => router.push("/create")}>Go to Create Passphrase</button><br></br>
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
