//create database
//Used this tutorial https://dexie.org/docs/Tutorial/React
import Dexie from 'dexie';

export const db = new Dexie('PassphraseDatabase');
db.version(1).stores({
  passphrases: "++num, passphrase, user, username, website, salt, q1, q2, q3, q4, q5",
  passwords: "++num, password, user, username, website"
});