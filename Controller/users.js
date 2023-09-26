const users = require("../JsonData/users.json");
const fs = require("fs");
const path = require("path");
const pathToUsers = path.join(__dirname, "../JsonData/users.json");

//to write the user data
function updatUserData(users) {
  fs.writeFileSync(pathToUsers, JSON.stringify(users, null, 2));
}

exports.usersList = (req, res) => {
  res.json(users);
};

exports.singleUser = (req, res) => {
  const userid = parseInt(req.params.id);
  const user = users.find((user) => user.id === userid);

  if (!user) {
    return res
      .status(404)
      .json({ error: `User  ID no. ${userid} not found....` });
  }
  res.json(user);
};

exports.createUser = (req, res) => {
  const { id, name, email } = req.body;
  if (!id || !name || !email) {
    return res
      .status(400)
      .json({ error: "Please provide id, name, and email" });
  }

  const newUser = { id, name, email };
  users.push(newUser);
  updatUserData(users);

  return res.status(201).json({ success: "User created successfully" });
};

exports.deleteUser = (req, res) => {
  const userid = parseInt(req.params.id);
  const indexOfUser = users.findIndex((user) => user.id === userid);

  if (indexOfUser === -1) {
    return res
      .status(404)
      .json({ error: `User  ID no.${userid} not found....` });
  }

  users.splice(indexOfUser, 1);
  updatUserData(users);
  return res
    .status(201)
    .json({ success: `User  ID no.${userid} deleted successfully...` });
};


exports.updateUser = (req,res) =>{
    const userId = parseInt(req.params.id);
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Please provide name and email" });
  }

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ error: `User  ID no. ${userId} not found` });
  }

  user.name = name;
  user.email = email;
  updatUserData(users);

  return res.status(201).json({ success: `User  ID no.${userId} updated successfully...` });

}