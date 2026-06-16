// backend/index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
    res.json({ message: '¡Hola desde el Backend en Express!' });
});

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});