const Workout = require("../models/Workoutmodel")


const createWorkout = async (req, res) => {
    // Destructure workout data from the request body
    const { title, date, exercises } = req.body;

    try {
        // Create a new workout, associating it with the authenticated user
        const workout = await Workout.create({
            userId: req.userId,  // Get userId from the decoded JWT token (authMiddleware)
            title,
            date,
            exercises,
        });

        // Respond with the created workout
        res.status(201).json({ workout });
    } catch (error) {
        // Handle any errors and send the error message
        res.status(400).json({ error: error.message });
    }
};
const addWorkout = async (req, res) => {
    const { title, name, setsAndReps } = req.body;  // Assuming title, exercise name, and setsAndReps data are sent
    
    // Get the current date at midnight (to check workouts for today)
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Assuming the user ID is available in req.userId from the auth middleware
    const userId = req.userId; // Add the user ID here

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        // Check if a workout already exists for today
        let workout = await Workout.findOne({ date: currentDate, userId: userId });

        if (workout) {
            // Workout exists for today, so update it
            const exerciseIndex = workout.exercises.findIndex(
                (exercise) => exercise.name === name
            );

            if (exerciseIndex >= 0) {
                // If the exercise already exists, add new sets to it
                workout.exercises[exerciseIndex].setsAndReps.push(...setsAndReps);
            } else {
                // Otherwise, create a new exercise for the workout
                workout.exercises.push({
                    name,
                    setsAndReps: setsAndReps,
                });
            }

            // Save the updated workout
            await workout.save();
            res.status(200).json(workout);
        } else {
            // No workout exists for today, so create a new one
            workout = new Workout({
                userId, // Include the userId when creating the workout
                title,
                date: currentDate,
                exercises: [
                    {
                        name,
                        setsAndReps: setsAndReps,
                    },
                ],
            });

            // Save the new workout
            await workout.save();
            res.status(201).json(workout);
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Failed to add/update workout" });
    }
};

const displayWorkout = async (req, res) => {
    try {
        let dateFilter = {};  // Initialize the filter for the query

        // Check if 'date' query parameter is provided
        if (req.query.date) {
            // Parse the provided date to ensure correct formatting
            const date = new Date(req.query.date);
            date.setHours(0, 0, 0, 0);  // Set time to 00:00 to match the full day

            // Set the filter to fetch workouts for the specific date
            dateFilter = { date: { $gte: date, $lt: new Date(date).setDate(date.getDate() + 1) } };
        } else {
            // If no date is provided, fetch workouts for today
            const today = new Date();
            today.setHours(0, 0, 0, 0);  // Set time to 00:00

            // Set the filter to fetch workouts for today
            dateFilter = { date: { $gte: today, $lt: new Date(today).setDate(today.getDate() + 1) } };
        }

        // Fetch the workouts based on the date filter and the user, and populate the userId field with user's name
        const workouts = await Workout.find({ userId: req.userId, ...dateFilter })
            .populate('userId', 'name')  // Populate the userId field with the 'name' field from the User model
            .sort({ date: -1 });

        if (workouts.length === 0) {
            return res.status(404).json({ message: "No workouts found for this date" });
        }

        res.json({ message: "Workouts fetched successfully", workouts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching workouts" });
    }
};

module.exports = { createWorkout,
    addWorkout,
    displayWorkout
 };