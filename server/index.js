const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let users = [];
let tasks = [];

// REGISTER
app.post("/api/auth/register", (req, res) => {
  const { email, password } = req.body;

  const userExists = users.find((u) => u.email === email);

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = {
    id: Date.now(),
    email,
    password,
  };

  users.push(user);

  res.json({
    message: "Registered successfully",
    token: "token-" + user.id,
  });
});

// LOGIN
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({
    message: "Login success",
    token: "token-" + user.id,
  });
});

// TASKS
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const task = {
    id: Date.now(),
    title: req.body.title,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter((t) => t.id !== id);
  res.json({ message: "Deleted" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
app.post("/api/ai/generate-plan", (req, res) => {
  const { tasks } = req.body;

  if (!tasks || tasks.length === 0) {
    return res.status(400).json({ message: "No tasks provided" });
  }

  // SIMPLE AI LOGIC (no external API yet)
  const plan = tasks.map((task, index) => {
    if (index % 3 === 0) {
      return `🌅 Morning: Study ${task.title}`;
    } else if (index % 3 === 1) {
      return `☀️ Afternoon: Review ${task.title}`;
    } else {
      return `🌙 Night: Practice ${task.title}`;
    }
  });

  res.json({
    message: "AI Plan Generated",
    plan,
  });
});