//important note: connect to njit network or vpn
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "sql1.njit.edu",
    port: "3306",
    user: "pk577",
    password: "Data147159!!",
    database: "pk577",
})

app.get('/', (re, res) => {
    return res.json("From Backend Side");
})

app.get('/SecurityQs', (req, res) =>{
    const sql = "SELECT * FROM SecurityQs";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/RandomSecurityQs', (req, res) =>{
    const sql = "SELECT * FROM SecurityQs ORDER BY RAND() LIMIT 1";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/Users', (req, res) =>{
    const sql = "SELECT * FROM MSUsers";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

//creates passwords for new users
app.post('/save-passphrase', (req, res) => {
    const {user, passphrase, salt, q1, q2, q3, q4, q5, } = req.body;

    const sql = `INSERT INTO MSUsers (Username, HashPass, HashSalt, Q1, Q2, Q3, Q4, Q5) VALUES ('${user.username}', '${passphrase.answer}', '${salt.pswdSalt}', ${q1?.QNum || 'NULL'}, ${q2?.QNum || 'NULL'}, ${q3?.QNum || 'NULL'}, ${q4?.QNum || 'NULL'}, ${q5?.QNum || 'NULL'})`;

    const values = [
        user.username,
        passphrase.answer,
        salt.pswdSalt,
        q1?.QNum || null,
        q2?.QNum || null,
        q3?.QNum || null,
        q4?.QNum || null,
        q5?.QNum || null,
    ];
    
    console.log('SQL values:', values);

    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})


app.listen(8081, () => {
    console.log("listening");
})