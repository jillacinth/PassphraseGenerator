//important note: connect to njit network or vpn
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

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

/* make a user one
app.get('/SecurityQs', (req, res) =>{
    const sql = "SELECT * FROM SecurityQs";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})
*/

app.listen(8081, () => {
    console.log("listening");
})