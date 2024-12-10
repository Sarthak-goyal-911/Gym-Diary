const express = require('express');
const workout = require("../models/Workoutmodel")
const Workoutcontrollers = require("../controllers/workoutControlllers")
const router = express.Router()
const protected = require("../middleware/Auth")
router.get("/",(req,res)=>[
    res.send("hanji")
])
router.post("/create",protected.authMiddleware,Workoutcontrollers.createWorkout)
router.post("/add",protected.authMiddleware,Workoutcontrollers.addWorkout)
router.get("/display",protected.authMiddleware,Workoutcontrollers.displayWorkout )
module.exports = router