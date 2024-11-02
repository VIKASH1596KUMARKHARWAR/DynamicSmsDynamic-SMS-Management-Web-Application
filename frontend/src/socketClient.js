// socketClient.js

import { io } from "socket.io-client"; // Import the Socket.IO client

// Replace with your server URL
const socket = io('http://localhost:5001'); 

// Listen for the connection event
socket.on('connect', () => {
    console.log('Socket connected:', socket.id); // Log the socket ID when connected
});

// Listen for the disconnect event
socket.on('disconnect', () => {
    console.log('Socket disconnected');
});

// Listen for custom log updates from the server
socket.on('logUpdate', (logMessage) => {
    console.log(logMessage); // Log the message sent from the backend
});

// Function to start a session
function startSession(country, operator) {
    const sessionData = { country, operator };
    socket.emit('startSession', sessionData); // Emit event to start the session
}

// Export the socket and function for use in other parts of your app
export { socket, startSession };
