const User = require("../models/UserSchema");

exports.getUsers = (req, res) => {
  User.find((err, user) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(user);
  });
};

exports.getUser = (req, res) => {
  console.log(req);
  let email = req.params.email;
  User.find({ email: email }, (err, user) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(user);
  });
};

exports.newUser = (req, res) => {
  const newUser = new User(req.body);
  newUser.save(err => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(newUser);
  });
};

exports.updateUser = (req, res) => {
  let role = req.body.role;
  let email = req.params.email;
  User.findOneAndUpdate({ email: email }, { nombre: nom }, (err, user) => {
    if (err) return res.status(500).send(err);
    return res.send(user);
  });
};

exports.deleteUser = (req, res) => {
  User.findAndRemove({ email: req.params.email }, (err, user) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(user._id);
  });
};
