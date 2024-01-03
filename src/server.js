require('dotenv').config();
console.log(process.env.MONGODB_URI);

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

const userSchema = new mongoose.Schema({
  email: String,
  passwordHash: String,
});

const User = mongoose.model('User', userSchema);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new User({
      email: req.body.email,
      passwordHash: hashedPassword
    });

    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).send(error);
  }
});

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const validPassword = await bcrypt.compare(req.body.password, user.passwordHash);
      if (validPassword) {
        res.status(200).json({ message: "Login successful!" });
      } else {
        res.status(400).json({ error: "Invalid password" });
      }
    } else {
      res.status(401).json({ error: "User does not exist" });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "An error occurred during the login process." });
  }
});