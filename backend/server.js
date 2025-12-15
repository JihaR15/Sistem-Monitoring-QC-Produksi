const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let masterData = {
    groups: ['SD', 'SMP', 'SMA', 'Mahasiswa'],
    shifts: [1, 2, 3],
    lines: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
};

let operationalData = []; 

app.get('/api/master', (req, res) => {
    res.json(masterData);
});

app.get('/api/data', (req, res) => {
    res.json(operationalData);
});

app.post('/api/data', (req, res) => {
    const { group, shift, line, suhu, berat, kualitas } = req.body;
    
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
    console.log("Data masuk:", newData);
    res.status(201).json({ message: "Data saved", data: newData });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});