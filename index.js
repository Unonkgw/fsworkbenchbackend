const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');

app.use(express.json());


  const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "itelective"
  });
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return;
    }
    console.log("Connected to the database");
    connection.release();
  });





app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));



app.get('/viewmeals', async (req, res) => {
    try {
        const myquery = "SELECT * from meal;"
        db.query(myquery, (err, result) => {
            if (err) {
                console.log("sql error:", err);
            }
            else{
                res.send(result)
            }
        });
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=adobo');
        const data = await response.json();
        res.json(data);
    }
    catch(error){
        console.error(error)
        res.status(500).json({error: "Recipe not found"})
    }
});

app.get('/getmeal/:idmeal', async (req, res) => {
    const idmeal = req.params.idmeal;
    try {
        const myquery = "SELECT * from meal WHERE idmeal = ?;"
        db.query(myquery, [idmeal], (err, result) => {
            if (err) {
                console.log("sql error:", err);
            }
            else{
                res.send(result)
            }
        });
    }
    catch(error){
        console.error(error)
        res.status(500).json({error: "SQL error"})
    }
  });


  app.put('/updatemeal', (req, res) => {
    const {idmeal, mealname, mealcategory, mealarea, mealinstructions} = req.body;
    const myquery = "UPDATE meal SET meal = ?, category = ?, area = ?, instructions = ? where idmeal = ?;"
    db.query(myquery, [mealname, mealcategory, mealarea, mealinstructions, idmeal], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
              return res.status(200).json({message: "Updated successfully", success: true, data: result});
        }
    });
});











app.post('/insertmeal', (req, res) => {

    const {mealname, mealcategory, mealarea, mealinstructions} = req.body;
    const myquery = "INSERT INTO meal (meal, category, area, instructions) VALUES (?,?,?,?);"
    db.query(myquery, [mealname, mealcategory, mealarea, mealinstructions], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
              console.log(result);
        }
    });
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});