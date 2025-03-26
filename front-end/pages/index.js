// pages/index.js
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Menu } from '../components/Menu';


const Home = () => {
  const router = useRouter();
  
  const header = {
    marginBottom: '50px',
    backgroundColor: '#6272a4',
    color: 'white',
    fontFamily: 'sans-serif',
    paddingTop: '15px',
    paddingBottom: '15px',
    margin: 'auto',
    textAlign: 'center',
};

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
      <div style={header}>
        <h1>Passphrase Generator</h1>
      </div>
      <Menu />
    </div>
  );
}



export default Home;
