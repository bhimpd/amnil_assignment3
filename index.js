const express = require("express");
const app = express();
const port = 5001;

// Middleware to parse JSON request bodies
app.use(express.json());

// Load the users data
const fs = require("fs");
const usersFilePath = "./users.json";
// res.setHeader('Content-Type', 'application/json');

//to read the user data
function getuserdata() {
  const data = fs.readFileSync(usersFilePath);
  return JSON.parse(data);
}

//to write the user data
function updatUserData(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

//creating the data of the user
app.post("/users", (req, res) => {
  const { id, name, email } = req.body;
  if (!id || !name || !email) {
    return res
      .status(400)
      .json({ error: "Please provide id, name, and email" });
  }

  const users = getuserdata();
  const newUser = { id, name, email };
  users.push(newUser);
  updatUserData(users);

  return res.status(201).json({ success: "User created successfully" });
});

// Define a route to get all users
app.get("/users", (req, res) => {
  // Read the user data from the JSON file
  const users = getuserdata();
  res.json(users);
});

//to get the specific users id...
app.get("/users/:id", (req, res) => {
  const userid = parseInt(req.params.id);
  const users = getuserdata();
  const user = users.find((user) => user.id === userid);

  if (!user) {
    return res.status(404).json({ error: `User  ID no. ${userid} not found....` });
  }
  res.json(user);
});

//to delete the specific user id..
app.delete("/users/:id", (req, res) => {
  const users = getuserdata();
  const userid = parseInt(req.params.id);
  const indexOfUser = users.findIndex((user) => user.id === userid);

  if (indexOfUser === -1) {
    return res.status(404).json({ error: `User  ID no.${userid} not found....`});
  }

  users.splice(indexOfUser, 1);
  updatUserData(users);
  return res.status(201).json({ success: `User  ID no.${userid} deleted successfully...` });
});

// Update a user by ID
app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Please provide name and email" });
  }

  const users = getuserdata();
  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ error: `User  ID no. ${userId} not found` });
  }

  user.name = name;
  user.email = email;
  updatUserData(users);

  return res.status(201).json({ success: `User  ID no.${userId} updated successfully...` });

});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
