const TelegramBot = require('node-telegram-bot-api');
const botToken = 'YOUR_TELEGRAM_BOT_TOKEN'; // Replace with your bot token
const chatId = 'YOUR_CHAT_ID'; // Replace with your chat ID
const bot = new TelegramBot(botToken);

// Function to send alerts
const sendAlert = (message) => {
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

// Function to send success alerts
const sendSuccessAlert = (sessionName) => {
    sendAlert(`Success alert: Session ${sessionName} completed successfully.`);
};

// Example: Call this function when a critical success rate drop occurs
const criticalSuccessRateDrop = (successRate) => {
    if (successRate < THRESHOLD) { // Define your threshold
        sendAlert(`Critical alert: Success rate dropped to ${successRate}%`);
    }
};

// Example: Call this function when a program fails or crashes
const programFailure = (programName) => {
    sendAlert(`Critical alert: Program ${programName} has failed or crashed.`);
};

module.exports = {
    sendAlert,
    sendSuccessAlert, // Export the new success alert function
    criticalSuccessRateDrop,
    programFailure,
};
