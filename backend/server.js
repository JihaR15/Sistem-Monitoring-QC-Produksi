const express = require('express');
const cors = require('cors');
const dataController = require('./controllers/dataController');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/master', dataController.getMasterData);
app.get('/api/data', dataController.getOperationalData);
app.post('/api/data', dataController.addOperationalData);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
