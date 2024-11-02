const fs = require('fs');
const path = require('path');
// const { exec } = require('child_process');

const { exec, execSync } = require('child_process');
const { spawn } = require('child_process');


const axios = require('axios');


const TelegramBot = require('node-telegram-bot-api');

const botToken = "7733063138:AAHoFxBExeeWnGT0wRq-0dQOSySGi4Bekt4"; // Your Telegram bot token
const chatId = "1419187298"; // Your ch
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

// module.exports = {
//     sendAlert,
//     sendSuccessAlert, // Export the new success alert function
//     criticalSuccessRateDrop,
//     programFailure,
// };


const sockedSession = (req, res, io) => {
    const { country, operator, scriptName } = req.body;
    // const sessionName = `program_${country}_${operator}_${scriptName}`;
    const sessionName = `${scriptName}_${country}_${operator}`;
    
    // Construct the log file path dynamically
    const logFilePath = path.join(__dirname, '../scripts', `${sessionName}_output.log`);
    console.log(`Log file path: ${logFilePath}`);
    
    // Escape spaces in the script path
    const scriptPath = `~/Documents/instenship/Dynamic\\ SMS\\ Management\\ Web\\ Application/sms-dashboard-project/backend/scripts/${scriptName}.py`;
    console.log(`Script path: ${scriptPath}`);
    
    // Command to execute in the screen session
    const command = `python3 ${scriptPath} ${country} ${operator} > ${logFilePath} 2>&1; sleep 600`;
    
    // Execute the command to start the screen session
    exec(`screen -dmS ${sessionName} bash -c "${command}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error starting session: ${error.message}`);
            return res.status(500).json({ error: 'Failed to start session' });
        }
        
        // Emit a message when the session starts successfully
        if (io) {
            io.emit('sessionData', { message: `Started session ${sessionName}` });
        }
        
        return res.status(200).json({ message: `Session ${sessionName} started successfully`, log: logFilePath });
    });
};




const startSession = (req, res, io) => {
    const { country, operator, scriptName } = req.body;
    const sessionName = `${scriptName}_${country}_${operator}`;
    const logFilePath = path.join(__dirname, '../scripts', `${sessionName}_output.log`);

    console.log(`Log file path: ${logFilePath}`);
    const scriptPath = path.join(__dirname, '../scripts', `${scriptName}.py`);
    console.log(`Log script path: ${scriptPath}`);

    // Prepare the command to execute
    const command = `python3 "${scriptPath}" ${country} ${operator} ${scriptName} > "${logFilePath}" 2>&1`;

    // Execute the command
    exec(command, (error) => {
        if (error) {
            console.error(`Error starting session: ${error.message}`);
            return res.status(500).json({ error: 'Failed to start session' });
        }

        // Emit a message when the session starts successfully
        if (io) {
            io.emit('sessionData', { message: `Started session ${sessionName}` });
        }

        // Start watching the log file for real-time updates
        startWatchingLog(io, country, operator, sessionName, logFilePath);

        return res.status(200).json({ message: `Session ${sessionName} started successfully`, log: logFilePath });
    });
};

// Function to watch the log file for completion messages
// const startWatchingLog = (io, country, operator, sessionName, logFilePath) => {
//     const monitorInterval = setInterval(() => {
//         fs.readFile(logFilePath, 'utf8', (err, data) => {
//             if (err) {
//                 console.error(`Error reading log file: ${err.message}`);
//                 clearInterval(monitorInterval); // Stop monitoring on error
//                 return;
//             }

//             // Check for completion message
//             if (data.includes(`SMS session for Country: ${country}, Operator: ${operator} completed.`)) {
//                 console.log(`Session ${sessionName} completed.`);
//                 clearInterval(monitorInterval); // Stop monitoring

//                 // Check if the process is still running
//                 exec(`pgrep -f "${sessionName}"`, (checkError, stdout) => {
//                     if (checkError) {
//                         console.error(`Error checking process: ${checkError.message}`);
//                         return; // Skip stopping if there's an error
//                     }

//                     if (stdout.trim()) {
//                         // Stop the process if it exists
//                         exec(`pkill -f "${sessionName}"`, (stopError) => {
//                             if (stopError) {
//                                 // Only log if the error is NOT "no such process"
//                                 if (!stopError.message.includes("no such process")) {
//                                     console.error(`Error stopping session: ${stopError.message}`);
//                                 }
//                             } else {
//                                 console.log(`Session ${sessionName} stopped successfully.`);
//                             }
//                         });
//                     } else {
//                         console.log(`No running processes found for session ${sessionName}.`);
//                     }
//                 });

//                 // Emit completion message
//                 if (io) {
//                     io.emit('sessionData', { message: `Session ${sessionName} completed successfully.` });
//                 }
//             }
//         });
//     }, 5000); // Check every 5 seconds
// };


const startWatchingLog = (io, country, operator, sessionName, logFilePath) => {
    const monitorInterval = setInterval(() => {
        fs.readFile(logFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading log file: ${err.message}`);
                clearInterval(monitorInterval); // Stop monitoring on error
                return;
            }

            // Check for completion message
            if (data.includes(`SMS session for Country: ${country}, Operator: ${operator} completed.`)) {
                console.log(`Session ${sessionName} completed.`);
                clearInterval(monitorInterval); // Stop monitoring

                // Send success alert
                sendSuccessAlert(sessionName);

                // Check if the process is still running
                exec(`pgrep -f "${sessionName}"`, (checkError, stdout) => {
                    if (checkError) {
                        console.error(`Error checking process: ${checkError.message}`);
                        return; // Skip stopping if there's an error
                    }

                    if (stdout.trim()) {
                        // Stop the process if it exists
                        exec(`pkill -f "${sessionName}"`, (stopError) => {
                            if (stopError) {
                                // Only log if the error is NOT "no such process"
                                if (!stopError.message.includes("no such process")) {
                                    console.error(`Error stopping session: ${stopError.message}`);
                                }
                            } else {
                                console.log(`Session ${sessionName} stopped successfully.`);
                            }
                        });
                    } else {
                        console.log(`No running processes found for session ${sessionName}.`);
                    }
                });

                // Emit completion message
                if (io) {
                    io.emit('sessionData', { message: `Session ${sessionName} completed successfully.` });
                }
            }
        });
    }, 5000); // Check every 5 seconds
};

const watchLogFile = (io, logFilePath, sessionName) => {
    fs.watch(logFilePath, (eventType) => {
        if (eventType === 'change') {
            fs.readFile(logFilePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Error reading log file: ${err.message}`);
                    return;
                }
                io.emit('logUpdate', { sessionName, log: data });
            });
        }
    });
};



const getLogOutput = (req, res) => {
    const { country, operator, scriptName } = req.query; // Get parameters from query string
    const sessionName = `${scriptName}_${country}_${operator}`;
    
    // Construct the log file path
    const logFilePath = path.join(__dirname, '../scripts', `${sessionName}_output.log`);
    console.log(`Log file path: ${logFilePath}`);

    // Check if the log file exists
    fs.access(logFilePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`Log file does not exist: ${logFilePath}`);
            return res.status(404).json({ error: 'Log file not found' });
        }

        // Read the log file
        fs.readFile(logFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading log file: ${err.message}`);
                return res.status(500).json({ error: 'Failed to read log file' });
            }

            // Return the log file contents
            return res.status(200).json({ log: data });
        });
    });
};


// Array to hold high-priority session names
const highPrioritySessions = new Set();

// Controller to add a session as high-priority
const addHighPrioritySession = (req, res) => {
    const { country, operator, scriptName } = req.body;
    const sessionName = `${scriptName}_${country}_${operator}`;

    highPrioritySessions.add(sessionName);
    console.log(`Session ${sessionName} marked as high-priority.`);
    return res.status(200).json({ message: `Session ${sessionName} marked as high-priority.` });
};

// Controller to remove a session from high-priority list
const removeHighPrioritySession = (req, res) => {
    const { country, operator, scriptName } = req.body;
    const sessionName = `${scriptName}_${country}_${operator}`;

    if (highPrioritySessions.has(sessionName)) {
        highPrioritySessions.delete(sessionName);
        console.log(`Session ${sessionName} removed from high-priority list.`);
        return res.status(200).json({ message: `Session ${sessionName} removed from high-priority list.` });
    } else {
        return res.status(404).json({ error: `Session ${sessionName} is not marked as high-priority.` });
    }
};




const stopSession = (req, res) => {
    const { country, operator, scriptName } = req.body;
    const sessionName = `${scriptName}_${country}_${operator}`;

    // Check if session is high-priority
    if (highPrioritySessions.has(sessionName)) {
        console.log(`Cannot stop high-priority session: ${sessionName}`);
        return res.status(403).json({ error: `Cannot stop high-priority session: ${sessionName}` });
    }

    // List and stop sessions as before if not high-priority
    exec(`screen -ls | grep "${sessionName}"`, (listError, stdout) => {
        if (listError || !stdout) {
            console.error(`No active session found for ${sessionName}`);
            return res.status(404).json({ error: `No active session found for ${sessionName}` });
        }

        const sessions = stdout.trim().split('\n').map(line => line.split('.')[0].trim());

        let stoppedCount = 0;
        sessions.forEach((pid, index) => {
            exec(`screen -S ${pid} -X quit`, (stopError) => {
                if (stopError) {
                    console.error(`Error stopping session with PID ${pid}: ${stopError.message}`);
                } else {
                    console.log(`Session with PID ${pid} stopped successfully.`);
                    stoppedCount++;
                }

                if (index === sessions.length - 1) {
                    const message = `Stopped ${stoppedCount} session(s) for ${sessionName}.`;
                    return res.status(200).json({ message });
                }
            });
        });
    });
};



const getActiveSessions = (req, res) => {
    const command = 'screen -ls';

    exec(command, (error, stdout, stderr) => {
        if (error) {
            // Check if the error message indicates no active sessions
            if (stdout.includes('No Sockets found')) {
                return res.status(200).json({ message: 'No active sessions available' });
            }

            // Log the error and return a generic internal error message
            console.error(`Error fetching active sessions:`, error.message);
            console.error(`stderr: ${stderr}`); // Log stderr output for debugging
            return res.status(500).json({ error: 'Failed to fetch active sessions due to an internal error' });
        }

        // If there are sessions, return them
        res.status(200).json({ activeSessions: stdout.trim() });
    });
};
// Automatically manage and attach sessions
const attachSession = (req, res, io) => {
    const { sessionName, country, operator, scriptName } = req.body;

    if (!sessionName || !country || !operator || !scriptName) {
        return res.status(400).json({ error: 'sessionName, country, operator, and scriptName are required' });
    }

    exec(`screen -ls`, (err, stdout) => {
        if (err) {
            console.error("Error listing screens:", err.message);
            return res.status(500).json({ error: 'Failed to list sessions' });
        }

        if (stdout.includes(sessionName)) {
            console.log(`Session ${sessionName} is already running.`);
            return res.status(400).json({ error: `Session ${sessionName} is already running` });
        }

        const command = `screen -dmS ${sessionName} python3 ./scripts/${scriptName}.py ${country} ${operator}`;

        exec(command, (error) => {
            if (error) {
                console.error(`Error starting session ${sessionName}:`, error.message);
                return res.status(500).json({ error: 'Failed to start session' });
            }
            io.emit('sessionData', { message: `Started session ${sessionName}` });

            const logFilePath = './sms_script.log';
            fs.watchFile(logFilePath, (curr, prev) => {
                fs.readFile(logFilePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error('Error reading log file:', err);
                        return;
                    }
                    io.emit('sessionData', { output: data });
                });
            });

            res.json({ message: `Successfully started session ${sessionName}` });
        });
    });
};




const runningSessions = {}; 


// Start Session-no pause screen doen
// const startSession1 = (req, res, io) => {
//     const { country, operator, scriptName } = req.body;
//     const sessionName = `program_${country}_${operator}_${scriptName}`;
//     const logFilePath = path.join(__dirname, '../scripts', `${sessionName}_output.log`);
    
//     console.log(`Log file path: ${logFilePath}`);
//     const scriptPath = path.join(__dirname, '../scripts', `${scriptName}.py`);
//     console.log(`Log script path: ${scriptPath}`);

//     // Command to run the Python script in a screen session
//     const command = `screen -dmS ${sessionName} bash -c 'python3 "${scriptPath}" ${country} ${operator} ${scriptName} >> "${logFilePath}" 2>&1'`;

//     // Execute the command
//     exec(command, (error) => {
//         if (error) {
//             console.error(`Error starting session: ${error.message}`);
//             return res.status(500).json({ error: 'Failed to start session' });
//         } 

//         // Store session info
//         runningSessions[sessionName] = { logFilePath };

//         // Emit event to notify about session start
//         if (io) {
//             io.emit('sessionData', { message: `Started session ${sessionName}` });
//         }
//         return res.status(200).json({ message: `Session ${sessionName} started successfully`, log: logFilePath });
//     });
// };



// const startSession1 = (req, res, io) => {
//     const { country, operator, scriptName } = req.body;
//     const sessionName = `${scriptName}_${country}_${operator}`;
//     const logFilePath = path.join(__dirname, '../scripts', `${sessionName}_output.log`);
//     const scriptPath = path.join(__dirname, '../scripts', `${scriptName}.py`);

//     console.log(`Log file path: ${logFilePath}`);
//     console.log(`Log script path: ${scriptPath}`);

//     // Command to run the Python script in a screen session
//     const command = `screen -dmS ${sessionName} bash -c 'python3 "${scriptPath}" ${country} ${operator} ${scriptName} >> "${logFilePath}" 2>&1'`;

//     // Execute the command
//     exec(command, (error) => {
//         if (error) {
//             console.error(`Error starting session: ${error.message}`);
//             return res.status(500).json({ error: 'Failed to start session' });
//         }

//         // Store session info
//         runningSessions[sessionName] = { logFilePath };

//         // Emit event to notify about session start
//         if (io) {
//             io.emit('sessionData', { message: `Started session ${sessionName}` });
//         }

//         return res.status(200).json({ message: `Session ${sessionName} started successfully`, log: logFilePath });
//     });
// };

// const startSession1 = (req, res, io) => {
//     const { country, operator, scriptName } = req.body;
//     const sessionName = `${scriptName}_${country}_${operator}`;
//     const logFilePath = path.join(__dirname, '../scripts', `${sessionName}_output.log`);
//     const scriptPath = path.join(__dirname, '../scripts', `${scriptName}.py`);

//     console.log(`Log file path: ${logFilePath}`);
//     console.log(`Log script path: ${scriptPath}`);

//     // Command to run the Python script in a screen session
//     const command = `screen -dmS ${sessionName} bash -c 'python3 "${scriptPath}" ${country} ${operator} ${scriptName} >> "${logFilePath}" 2>&1'`;

//     // Execute the command
//     exec(command, (error) => {
//         if (error) {
//             console.error(`Error starting session: ${error.message}`);
//             return res.status(500).json({ error: 'Failed to start session' });
//         }

//         // Store session info
//         runningSessions[sessionName] = { logFilePath };

//         // Emit event to notify about session start
//         if (io) {
//             io.emit('sessionData', { message: `Started session ${sessionName}` });
//         }

//         // Start reading the log file for new data
//         readLogFile(logFilePath, io, sessionName);

//         return res.status(200).json({ message: `Session ${sessionName} started successfully`, log: logFilePath });
//     });
// };

// // Function to read the log file and emit new data
// const readLogFile = (logFilePath, io, sessionName) => {
//     let previousLength = 0; // Track the length of the file to detect new content

//     setInterval(() => {
//         fs.stat(logFilePath, (err, stats) => {
//             if (err) {
//                 console.error(`Error checking log file: ${err.message}`);
//                 return;
//             }

//             if (stats.size > previousLength) {
//                 const stream = fs.createReadStream(logFilePath, { start: previousLength });
//                 stream.on('data', (chunk) => {
//                     const newData = chunk.toString();
//                     // Emit the new log data to the client
//                     io.emit('logData', { sessionName, data: newData });
//                 });
//                 stream.on('end', () => {
//                     previousLength = stats.size; // Update the previous length to the new length
//                 });
//             }
//         });
//     }, 1000); // Check every second
// };



// const startSession1 = (req, res, io) => {
//     const { country, operator, scriptName } = req.body;
//     const sessionName = `${scriptName}_${country}_${operator}`;
//     const logFilePath = path.join(__dirname, '../scripts', `${sessionName}_output.log`);
//     const scriptPath = path.join(__dirname, '../scripts', `${scriptName}.py`);

//     console.log(`Log file path: ${logFilePath}`);
//     console.log(`Log script path: ${scriptPath}`);

//     // Command to run the Python script in a screen session
//     const command = `screen -dmS ${sessionName} bash -c 'python3 "${scriptPath}" "${country}" "${operator}" "${scriptName}" >> "${logFilePath}" 2>&1'`;

//     // Execute the command
//     exec(command, (error) => {
//         if (error) {
//             console.error(`Error starting session: ${error.message}`);
//             return res.status(500).json({ error: 'Failed to start session' });
//         }

//         // Store session info
//         runningSessions[sessionName] = { logFilePath };

//         // Emit event to notify about session start
//         if (io) {
//             io.emit('sessionData', { message: `Started session ${sessionName}` });
//         }

//         // Start reading the log file for new data
//         readLogFile(logFilePath, io, sessionName);

//         return res.status(200).json({ message: `Session ${sessionName} started successfully`, log: logFilePath });
//     });
// };

// // Function to read the log file and emit new data
// const readLogFile = (logFilePath, io, sessionName) => {
//     let previousSize = 0; // Keep track of the previous size of the log file

//     // Use fs.watch to monitor the log file for changes
//     fs.watch(logFilePath, (eventType) => {
//         if (eventType === 'change') {
//             fs.stat(logFilePath, (err, stats) => {
//                 if (err) {
//                     console.error(`Error reading log file stats: ${err}`);
//                     return;
//                 }

//                 const currentSize = stats.size;
//                 if (currentSize > previousSize) {
//                     // Read new data from the log file
//                     const stream = fs.createReadStream(logFilePath, { start: previousSize, end: currentSize });
//                     stream.on('data', (chunk) => {
//                         const logData = chunk.toString();
//                         io.emit('logUpdate', logData); // Emit the new log data
//                     });
//                     stream.on('end', () => {
//                         previousSize = currentSize; // Update the previous size
//                     });
//                 }
//             });
//         }
//     });
// };

const startSession1 = (req, res, io) => {
    const { country, operator, scriptName } = req.body;
    const sessionName = `${scriptName}_${country}_${operator}`;
    const logFilePath = path.join(__dirname, '../scripts', `${sessionName}_output.log`);
    const scriptPath = path.join(__dirname, '../scripts', `${scriptName}.py`);

    console.log(`Log file path: ${logFilePath}`);
    console.log(`Log script path: ${scriptPath}`);

    // Command to run the Python script in a screen session
    const command = `screen -dmS ${sessionName} bash -c 'python3 "${scriptPath}" "${country}" "${operator}" "${scriptName}" >> "${logFilePath}" 2>&1'`;

    // Execute the command
    exec(command, (error) => {
        if (error) {
            console.error(`Error starting session: ${error.message}`);
            return res.status(500).json({ error: 'Failed to start session' });
        }

        // Store session info
        runningSessions[sessionName] = { logFilePath };

        // Emit event to notify about session start
        if (io) {
            io.emit('sessionData', { message: `Started session ${sessionName}` });
        }

        // Start reading the log file for new data
        readLogFile(logFilePath, io, sessionName);

        return res.status(200).json({ message: `Session ${sessionName} started successfully`, log: logFilePath });
    });
};

const readLogFile = (logFilePath, io, sessionName) => {
    let previousSize = 0; // Keep track of the previous size of the log file

    // Ensure the log file exists before watching
    fs.access(logFilePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`Log file does not exist: ${logFilePath}`);
            return;
        }

        // Use fs.watch to monitor the log file for changes
        fs.watch(logFilePath, (eventType) => {
            if (eventType === 'change') {
                fs.stat(logFilePath, (err, stats) => {
                    if (err) {
                        console.error(`Error reading log file stats: ${err}`);
                        return;
                    }

                    const currentSize = stats.size;
                    if (currentSize > previousSize) {
                        // Read new data from the log file
                        const stream = fs.createReadStream(logFilePath, { start: previousSize, end: currentSize });
                        stream.on('data', (chunk) => {
                            const logData = chunk.toString();
                            io.emit('logUpdate', { containerName: sessionName, logMessage: logData }); // Emit the new log data
                        });
                        stream.on('end', () => {
                            previousSize = currentSize; // Update the previous size
                        });
                    }
                });
            }
        });
    });
};



const pauseSession1 = (sessionName) => {
    console.log(`Attempting to pause session: ${sessionName}`); // Debugging log
    exec(`screen -ls | grep ${sessionName}`, (err, stdout) => {
        if (err) {
            console.error(`Error finding session: ${err.message}`);
            return;
        }
        
        // Check if there is output; if not, the session might not exist
        if (!stdout) {
            console.error(`No session found with the name: ${sessionName}`);
            return;
        }
        
        // Get the first matching line and extract the PID
        const lines = stdout.trim().split('\n');
        const sessionInfo = lines[0]; // Get the first line
        const pid = sessionInfo.split('.')[0].trim(); // Extract PID from the session info

        console.log(`Found PID: ${pid}`); // Debugging log

        // Check if the PID is valid
        if (!pid || isNaN(pid)) {
            console.error(`No valid PID found for session: ${sessionName}`);
            return;
        }

        // Execute the command to pause the session
        exec(`kill -SIGSTOP ${pid}`, (err) => {
            if (err) {
                console.error(`Error pausing session: ${err.message}`);
            } else {
                console.log(`Session ${sessionName} paused.`);
            }
        });
    });
};

// Function to resume the session
const restartSession1 = (sessionName) => {
    console.log(`Attempting to resume session: ${sessionName}`); // Debugging log
    exec(`screen -ls | grep ${sessionName}`, (err, stdout) => {
        if (err) {
            console.error(`Error finding session: ${err.message}`);
            return;
        }
        const pid = stdout.split('.')[0].trim();
        console.log(`Found PID: ${pid}`); // Debugging log
        exec(`kill -SIGCONT ${pid}`, (err) => {
            if (err) console.error(`Error resuming session: ${err.message}`);
            else console.log(`Session ${sessionName} resumed.`);
        });
    });
};


// const stopSession1 = (req, res) => {
//     const { country, operator, scriptName } = req.body;
//     const sessionName = `${scriptName}_${country}_${operator}`;

//     // Check if the session is running
//     if (!runningSessions[sessionName]) {
//         return res.status(404).json({ error: `Session ${sessionName} not found or already stopped` });
//     }

//     // Command to terminate the screen session by its name
//     const command = `screen -S ${sessionName} -X quit`;

//     exec(command, (error) => {
//         if (error) {
//             console.error(`Error stopping session: ${error.message}`);
//             // Log the error in the log file
//             const logFilePath = path.join(__dirname, '../scripts', `${sessionName}_output.log`);
//             fs.appendFileSync(logFilePath, `\nError: Failed to stop session ${sessionName} at ${new Date().toISOString()}\n`);
//             // Send alert notification about the failure
//             sendAlert(`Error: Failed to stop session ${sessionName}.`);
//             return res.status(500).json({ error: 'Failed to stop session' });
//         }

//         // Send an alert notification about the session stop
//         sendAlert(`Alert: Session ${sessionName} has been stopped.`);

//         // Log the interruption
//         const logFilePath = path.join(__dirname, '../scripts', `${sessionName}_output.log`);
//         fs.appendFileSync(logFilePath, `\nSession ${sessionName} has been interrupted and stopped at ${new Date().toISOString()}\n`);

//         // Clean up the session entry
//         delete runningSessions[sessionName];

//         return res.status(200).json({ message: `Session ${sessionName} stopped successfully` });
//     });
// };

const stopSession1 = (req, res) => {
    const { sessionName } = req.body;

    // Log currently running sessions for debugging
    console.log('Current running sessions:', Object.keys(runningSessions));

    // Check if the session exists in runningSessions
    if (!runningSessions[sessionName]) {
        return res.status(404).json({ message: `Session ${sessionName} not found or already stopped.` });
    }

    // Command to stop the screen session
    const command = `screen -S ${sessionName} -X quit`;

    // Execute the command to stop the session
    exec(command, (error) => {
        if (error) {
            console.error(`Error stopping session: ${error.message}`);
            return res.status(500).json({ error: 'Failed to stop session' });
        }

        // Remove the session from runningSessions
        delete runningSessions[sessionName];

        // Emit event to notify about session stop
        if (io) {
            io.emit('sessionData', { message: `Stopped session ${sessionName}` });
        }

        return res.status(200).json({ message: `Session ${sessionName} stopped successfully` });
    });
};


// const pauseSession1 = (req, res) => {

//     const { country, operator, scriptName } = req.body;
//     const sessionName = `program_${country}_${operator}_${scriptName}`;

//     // Check if the session is running
//     const childProcess = runningSessions[sessionName];

//     if (!childProcess) {
//         return res.status(404).json({ error: `Session ${sessionName} not found` });
//     }

//     try {
//         // Pause the process
//         childProcess.kill('SIGSTOP');
//         console.log(`Session ${sessionName} paused successfully.`);
//         return res.status(200).json({ message: `Session ${sessionName} paused successfully` });
//     } catch (error) {
//         console.error(`Error pausing session: ${error.message}`);
//         return res.status(500).json({ error: 'Failed to pause session' });
//     }
// };



// Resume Session

// const restartSession1 = (req, res) => {
//     const { country, operator, scriptName } = req.body;
//     const sessionName = `program_${country}_${operator}_${scriptName}`;

//     // Check if the session is running
//     const childProcess = runningSessions[sessionName];

//     if (!childProcess) {
//         return res.status(404).json({ error: `Session ${sessionName} not found` });
//     }

//     try {
//         // Resume the process
//         childProcess.kill('SIGCONT');
//         console.log(`Session ${sessionName} resumed successfully.`);
//         return res.status(200).json({ message: `Session ${sessionName} resumed successfully` });
//     } catch (error) {
//         console.error(`Error resuming session: ${error.message}`);
//         return res.status(500).json({ error: 'Failed to resume session' });
//     }
// };


// Export all functions
module.exports = {
    startSession,
    sockedSession,pauseSession1,
    stopSession,
    addHighPrioritySession,
    removeHighPrioritySession,
    restartSession1,
    getActiveSessions,
    getLogOutput,
    attachSession,
    startSession1, 
    stopSession1
};
