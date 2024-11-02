// const express = require('express');
// const router = express.Router();

// const {
//     startSession,
//     stopSession,
//     restartSession,
//     getAllSessions
// } = require('../controllers/sessionController');

// // Start a new SMS session
// router.post('/start', startSession);

// // Stop an existing SMS session
// router.post('/stop', stopSession);

// // Restart an SMS session
// router.post('/restart', restartSession);

// // Get the status of all sessions
// router.get('/', getAllSessions);
// router.get('/active', getActiveSessions);

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const sessionController = require('../controllers/sessionController');
// const { io } = require('../server');

// // Define your session controller or functions here


// // Pass io from the app instance
// router.post('/start', (req, res) => {
//     const { io } = req.app; // Get io from the app instance
//     sessionController.startSession(req, res, io);
// });

// router.post('/stop', (req, res) => {
//     const { io } = req.app; // Get io from the app instance
//     sessionController.stopSession(req, res);
// });

// router.post('/restart', (req, res) => {
//     const { io } = req.app; // Get io from the app instance
//     sessionController.restartSession(req, res, io);
// });

// router.get('/active', (req, res) => {
//     const { io } = req.app; // Get io from the app instance
//     sessionController.getActiveSessions(req, res);
// });

// router.post('/attach', (req, res) => {
//     const { io } = req.app; // Get io from the app instance
//     sessionController.attachSession(req, res, io);
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController'); // Adjust the path if necessary

// Route to start a session
router.post('/start', (req, res) => {
    const io = req.app.get('io'); // Retrieve io from app
    sessionController.startSession(req, res, io);
});

// Route to stop a session
router.post('/socket', (req, res) => {
    const io = req.app.get('io'); // Retrieve io from app
    sessionController.sockedSession(req, res, io);
});


router.post('/stop', sessionController.stopSession);
router.post('/add-high-priority-session', sessionController.addHighPrioritySession);
router.post('/remove-high-priority-session', sessionController.removeHighPrioritySession);

// Route to restart a session
// router.post('/restart', sessionController.restartSession1);
// router.post('/pause', sessionController.pauseSession1);



// API endpoint to pause the session
router.post('/pauseSession', (req, res) => {
    const { sessionName } = req.body;
    if (typeof sessionName === 'string') {
        sessionController.restartSession1(sessionName);
        res.json({ message: `Session ${sessionName} paused.` });
    } else {
        console.error('sessionName is not a string:', sessionName);
        res.status(400).json({ error: 'Invalid sessionName' });
    }
});

// API endpoint to resume the session
router.post('/resumeSession', (req, res) => {
    const { sessionName } = req.body;
    if (typeof sessionName === 'string') {
        sessionController.restartSession1(sessionName);
        res.json({ message: `Session ${sessionName} resumed.` });
    } else {
        console.error('sessionName is not a string:', sessionName);
        res.status(400).json({ error: 'Invalid sessionName' });
    }
});


// Route to get active sessions
router.get('/active', sessionController.getActiveSessions);

// Route to attach a session
// router.post('/attach', (req, res) => {
//     const io = req.app.get('io'); // Retrieve io from app
//     sessionController.attachSession(req, res, io);
// });
// router.post('/start', (req, res) => {
//     const io = req.app.get('io'); // Access io instance from app locals
//     io.emit('message', 'Session has started');
    
//     res.status(200).json({ message: 'Session started successfully' });
// });

router.get('/log-output', sessionController.getLogOutput);
// Route to start a session

// router.post('/start-session', (req, res) => {
//     const io = req.app.get('io'); // Retrieve io from app
//     sessionController.startSession1(req, res, io);
// });

router.post('/start-session', (req, res) => {
    const io = req.app.get('io'); // Retrieve io from app
    sessionController.startSession1(req, res, io); // Pass io to startSession1
});


// router.post('/stop-session', (req, res) => {
//     const io = req.app.get('io'); // Retrieve io from app
//     sessionController.stopSession1(req, res, io);
// });

// Stop an existing session
// router.post('/stop-session', (req, res) => {
//     const { containerName } = req.body;

//     // Remove the session from activeSessions
//     if (activeSessions[containerName]) {
//         delete activeSessions[containerName];
        
//         // Emit an event to inform clients that a session has stopped
//         io.emit('logUpdate', { containerName, logMessage: `Session stopped for ${containerName}` });
        
//         return res.status(200).json({ message: 'Session stopped successfully.' });
//     } else {
//         return res.status(404).json({ message: 'Session not found.' });
//     }
// });
module.exports = router;

