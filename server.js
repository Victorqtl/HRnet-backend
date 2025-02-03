const express = require('express');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid')
const app = express();
const PORT = 3000;
const cors = require('cors');


app.use(cors());
app.use(express.json());

async function readEmployees() {
    try {
        const data = await fs.readFile('employees.json', 'utf8')
        return JSON.parse(data)
    } catch (err) {
        return []
    }
}

async function writeEmployees(employees) {
    await fs.writeFile('employees.json', JSON.stringify(employees, null, 2))
}

app.get('/employees', async (req, res) => {
    try {
        const employees = await readEmployees()
        res.json(employees)
    } catch (err) {
        res.status(500).send('Error reading employee data')
    }

})

app.post('/employees', async (req, res) => {
    try {
        const employees = await readEmployees()
        const newEmployee = {
            id: uuidv4(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        employees.push(newEmployee)
        await writeEmployees(employees)
        res.status(201).json(newEmployee)
    } catch (err) {
        res.status(500).send('Error creating employee')
    }

});

app.put('/employees/:id', async (req, res) => {
    try {
        const employees = await readEmployees()
        const employeeId = req.params.id
        const updatedData = req.body
        const index = employees.findIndex(emp => emp.id === employeeId)

        if (index === -1) {
            return res.status(404).send('Employee not found')
        }

        employees[index] = {
            ...employees[index],
            ...updatedData,
            updatedAt: new Date().toISOString()
        }

        await writeEmployees(employees)
        res.status(200).json(employees[index])
    } catch (err) {
        res.status(500).send('Error updating employee')
    }
});

app.delete('/employees/:id', async (req, res) => {
    try {
        const employees = await readEmployees();
        const employeeId = req.params.id
        const updatedEmployees = employees.filter(emp => emp.id !== employeeId)

        if (employees.length === updatedEmployees) {
            return res.status(404).send('Employee not found')
        }

        await writeEmployees(updatedEmployees)
        res.status(200).send('Employee successfully removed')
    } catch (err) {
        res.status(500).send('Error deleting employee')
    }
});


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
})