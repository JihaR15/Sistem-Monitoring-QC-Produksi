const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(bodyParser.json());

const loadData = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify([]));
        return [];
    }
    const data = fs.readFileSync(DB_FILE);
    return JSON.parse(data);
};

const saveData = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

let operationalData = loadData();

let masterData = {
    groups: ['SD', 'SMP', 'SMA', 'Mahasiswa'],
    shifts: [1, 2, 3],
    lines: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
};

app.get('/api/master', (req, res) => {
    res.json(masterData);
});

app.get('/api/data', (req, res) => {
    res.json(operationalData);
});

app.post('/api/data', (req, res) => {
    const { group, shift, line, suhu, berat, kualitas } = req.body;
    
    if(!group || !shift || !line) {
        return res.status(400).json({message: "Data tidak lengkap"});
    }
    
    const newData = {
        id: operationalData.length + 1,
        date: new Date().toISOString().split('T')[0],
        group,
        shift: parseInt(shift),
        line,
        suhu: parseInt(suhu),
        berat: parseFloat(berat),
        kualitas
    };

    operationalData.push(newData);
    saveData(operationalData);
    console.log("Data masuk:", newData);
    res.status(201).json({ message: "Data saved", data: newData });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});