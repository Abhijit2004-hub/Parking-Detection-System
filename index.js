const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const { connectDB } = require('./Models/db');

require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 8080;

connectDB();

app.use(bodyParser.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use('/api', AuthRouter);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});