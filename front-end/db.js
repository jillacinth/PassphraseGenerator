//create database
//Used this tutorial https://dexie.org/docs/Tutorial/React
import Dexie from 'dexie';

export const db = new Dexie('PassphraseDatabase');
db.version(1).stores({
  passphrases: "website, passphrase, salt, q1, q2, q3, q4, q5" 
  //website is primary key
});