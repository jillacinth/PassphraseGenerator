// pages/index.js
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Menu } from '../components/Menu';
//import '../styles/styles.css';


const Home = () => {
  const router = useRouter();

  useEffect(() => {
      if (typeof window !== "undefined") {
          const isAuthenticated = localStorage.getItem("authenticated");
          if (!isAuthenticated) {
              router.push("/LoginPage");
          }
      }
      console.log(localStorage.getItem("currentUser"));
  }, []);
  return (
    <div>
      <div className='header'>
        <h1>Passphrase Generator</h1>
      </div>
      <Menu />
    </div>
  );
}



export default Home;
