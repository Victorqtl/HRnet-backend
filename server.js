const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser')

const app = express();
const PORT = 3000;

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());

app.get('/employees', (req, res) => {
    fs.readFile('employees.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error rading employee data')
        }
        res.send(JSON.parse(data))
    })
})

app.post('/employees', (req, res) => {
    const newEmployee = req.body;

    fs.readFile('employees.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading employee data')
        }

        const employees = JSON.parse(data);
        employees.push(newEmployee)
        fs.writeFile('employees.json', JSON.stringify(employees, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).send('Error saving employee data')
            }
            res.status(201).send(newEmployee)
        })
    })
})

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
})