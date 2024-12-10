require('dotenv').config();
const express = require ("express");
const mongoose = require("mongoose")
const workoutRoutes = require("./routes/workouts")
const userRoutes = require("./routes/userRoutes")
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
app.use(express.json())
app.use("/api/workouts",workoutRoutes)
app.use("/api/user",userRoutes)
port = process.env.port
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(port, ()=> {
            console.log(" DB is connected & server is running on",port)
        });

    }).catch((error)=>{
        console.log(error)
    })



