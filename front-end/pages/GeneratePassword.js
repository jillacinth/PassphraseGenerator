import React, { useEffect } from 'react';


export const GeneratePassword = () => {
      useEffect(() => {
          if (typeof window !== "undefined") {
              const isAuthenticated = localStorage.getItem("authenticated");
              if (!isAuthenticated) {
                  router.push("/LoginPage");
              }
          }
      }, [])


    return (
        <div className='createDiv'>
            <div className='header'>Passphrase Generator</div>
            will fill later
        </div>
    );
};

export default GeneratePassword;
