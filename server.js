const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Online Connection (Apna Atlas connection string yahan paste karein)
const MONGO_URI = 'mongodb+srv://akashoad20_db_user:s9faBHrsi88NbLK3@cluster0.q3grr7z.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('🚀 MongoDB Atlas Connected Successfully!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// User Schema & Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Signup API Route
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered!' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ 
            success: true, 
            message: 'VIP Registration Successful!', 
            data: { username: newUser.username, email: newUser.email, createdAt: newUser.createdAt } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`✨ Server running on http://localhost:${PORT}`);
});