const express = require('express');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid')

const app = express();
const PORT = 3000;

const cors = require('cors');
app.use(cors());

app.use(express.json());

app.get('/employees', async (req, res) => {
    try {
        const data = await fs.readFile('employees.json', 'utf8')
        res.json(JSON.parse(data))
    } catch (err) {
        res.status(500).send('Error reading employee data')
    }

})

app.post('/employees', async (req, res) => {
    try {
        const data = await fs.readFile('employees.json', 'utf8')
        const employees = JSON.parse(data);

        const newEmployee = {
            id: uuidv4(),
            ...req.body,
            createdAt: new Date().toISOString()
        };

        employees.push(newEmployee)

        await fs.writeFile('employees.json', JSON.stringify(employees, null, 2))

        res.status(201).json(newEmployee)
    } catch (err) {
        res.status(500).send('Error creating employee')
    }

})

app.delete('/employees/:id', async (req, res) => {
    try {
        const data = await fs.readFile('employees.json', 'utf-8')
        let employees = JSON.parse(data)

        const employeeId = req.params.id
        employees = employees.filter(emp => emp.id !== employeeId)

        await fs.writeFile('employees.json', JSON.stringify(employees, null, 2))
        res.status(200).send('Employee successfully removed')
    } catch (err) {
        res.status(500).send('Error deleting employee')
    }
})

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
})