
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { mongoose, pool } = require('./config/db'); // Ensure your DB connection is set up correctly
const sessionRoutes = require('./routes/sessionRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Store io in app.locals for access in routes if needed
app.set('io', io);

// Use routes
app.use('/api/sessions', sessionRoutes);
app.use('/api', authRoutes);

// Basic route for health check
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('startSession', (data) => {
        console.log(`Starting SMS session for Country: ${data.country}, Operator: ${data.operator}`);
        // Emit logUpdate messages as needed during the session
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});