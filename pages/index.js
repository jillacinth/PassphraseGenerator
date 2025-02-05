// pages/index.js
import React from 'react';
import { ExampleComponent } from '../components/ExampleComponent';
import { TextInput } from '../components/TextBoxComponent';


const Home = () => {
  const handleInputChange = (value) => {
    console.log("Input Value:", value);
  };  
  return (
    <div>
      <h1>Welcome to Next.js and React</h1>
      <TextInput label="Enter Text" placeholder="Type here" onChange={handleInputChange} />
      <ExampleComponent />
    </div>
  )
}



export default Home;
