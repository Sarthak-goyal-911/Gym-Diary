const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Name of the exercise (e.g., Bench Press, Squat)
    },
    setsAndReps: [
        {
            set: {
                type: Number, // Set number
                required: true,
            },
            reps: {
                type: Number, // Number of reps for this set
                required: true,
            },
            load: {
                type: Number, // Load (weight) for this set
                required: false, // Optional field if load isn't applicable
            },
        },
    ],
});

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming you have a User model
        required: true,
    },
    title: {
        type: String,
        required: true, // Title of the workout (e.g., "Chest Day")
    },
    date: {
        type: Date,
        required: true, // Date of the workout
    },
    exercises: [exerciseSchema], // Array of exercises
}, { timestamps: true });
module.exports = mongoose.model('workout', workoutSchema);