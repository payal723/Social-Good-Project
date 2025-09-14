// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");


const app = express();
app.use(cors());
app.use(express.json());


// --- API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/users', require('./routes/users'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));





/* ---------- Serve React build ---------- */
const buildPath = path.join(__dirname, 'frontend', 'build');
app.use(express.static(buildPath));

app.get('*', (req, res) =>
  res.sendFile(path.join(buildPath, 'index.html'))
);

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));