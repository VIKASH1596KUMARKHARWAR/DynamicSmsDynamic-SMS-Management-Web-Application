const User = require('../models/User'); // Make sure this imports your User model correctly
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const botToken = "7733063138:AAHoFxBExeeWnGT0wRq-0dQOSySGi4Bekt4"; // Your Telegram bot token
const chatId = "7733063138"; // Your chat ID

const sendMessageToTelegram = (message) => {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    axios.post(url, {
        chat_id: chatId,
        text: message,
    })
    .then((response) => {
        console.log("Message sent:", response.data);
    })
    .catch((error) => {
        console.error("Error sending message:", error);
    });
};

// User Registration
app.post('/register', async (req, res) => {
    const { username, password, mobileNumber } = req.body;

    // Validate mobile number (you can add more sophisticated validation)
    if (!/^\d{10}$/.test(mobileNumber)) {
        return res.status(400).send('Invalid mobile number');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user instance
    const newUser = new User({ username, password: hashedPassword, mobileNumber });
    
    try {
        await newUser.save(); // Save user to the database
        sendMessageToTelegram("A new user has registered! Username: " + username); // Send notification to Telegram
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send('Internal server error');
    }
});

// Login User
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user in the database
    const user = await User.findOne({ username });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }
    
    const token = jwt.sign({ username }, 'YOUR_SECRET_KEY', { expiresIn: '1h' }); // Replace with your secret key
    sendMessageToTelegram("A user has logged in! Username: " + username); // Send notification to Telegram
    res.json({ token });
});
