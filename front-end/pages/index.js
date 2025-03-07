// pages/index.js
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Menu } from '../components/Menu';


const Home = () => {
  const router = useRouter();

  useEffect(() => {
      if (typeof window !== "undefined") {
          const isAuthenticated = localStorage.getItem("authenticated");
          if (!isAuthenticated) {
              router.push("/LoginPage");
          }
      }
  }, []);
  return (
    <div>
      <h1>Passphrase Generator</h1>
      <Menu />
    </div>
  );
}



export default Home;
