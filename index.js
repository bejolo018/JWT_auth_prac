const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config')

//Import Routes
const authRoute = require('./routes/auth');


// Connect to DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true },  () => {
    console.log('connected to db!')
})

//Middleware
app.use(express.json())

// Route Middlewares
app.use('/api/user', authRoute)

app.listen(5000, () => console.log('Server up and running'))