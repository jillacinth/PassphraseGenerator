import { useRouter } from 'next/router';
import { default as React } from 'react';
import { ReturnToMain } from '../components/Menu';
import { PassphraseRetrieve } from '../components/RetrieveData';

export const GetPassword = () => {
    const router = useRouter(); // Use Next.js router

    return (
        <div>
            <div className='header'>
                <h1>Passphrase Generator</h1>
            </div>
            <ReturnToMain />
            <PassphraseRetrieve />
        </div>
    );
};

export default GetPassword;
