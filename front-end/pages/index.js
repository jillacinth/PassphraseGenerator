// pages/index.js
import React from 'react';
import { Menu } from '../components/Menu';
//import '../styles/styles.css';


const Home = () => {
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
