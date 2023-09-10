// server.js

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Task = require("./TaskSchema");

const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");

// Replace with your MongoDB connection string
const mongoURI = "mongodb://localhost/kanbanboard";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(cors());

async function getTask(req, res, next) {
  let task;
  try {
    task = await Task.findById(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.task = task;
  next();
}

// Create a new task
app.post("/create/task", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Get all tasks
app.get("/get/task", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single task by ID
app.get("/task/:id", getTask, (req, res) => {
  res.json(res.task);
});

// Update a task
app.patch("/update/:id", getTask, async (req, res) => {
  if (req.body.title != null) {
    res.task.title = req.body.title;
  }
  if (req.body.description != null) {
    res.task.description = req.body.description;
  }
  if (req.body.status != null) {
    res.task.status = req.body.status;
  }
  try {
    const updatedTask = await res.task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a task
app.delete("/delete/:id", getTask, async (req, res) => {
  try {
    await res.task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Define a route for moving a task to "Doing"
app.put("/moveToDoing/task/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Fetch the task from your database using the taskId
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update the task's status to "Doing"
    task.status = "Doing";

    // Save the updated task back to the database
    await task.save();

    // Return a success response
    return res.status(200).json({ message: "Task moved to Doing", task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});
// Define a route for moving a task to "Done"
app.put("/moveToDone/task/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Fetch the task from your database using the taskId
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update the task's status to "Doing"
    task.status = "Done";

    // Save the updated task back to the database
    await task.save();

    // Return a success response
    return res.status(200).json({ message: "Task moved to Done", task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});
// Define a route for moving a task to "Doing"
app.put("/moveToDo/task/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Fetch the task from your database using the taskId
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update the task's status to "Doing"
    task.status = "To Do";

    // Save the updated task back to the database
    await task.save();

    // Return a success response
    return res.status(200).json({ message: "Task moved to Do", task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
