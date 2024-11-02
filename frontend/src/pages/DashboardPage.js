import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const validSessions = [
    { country: "Uzbekistan", operator: "UzMobile", scriptName: "program1" },
    { country: "Ukraine", operator: "3Mob", scriptName: "program1" },
    { country: "Tajikistan", operator: "MegaFonTTMobile", scriptName: "program2" },
    { country: "India", operator: "RelianceWestBengal", scriptName: "program2" },
    { country: "India", operator: "TataDOCOMOMaharashtra", scriptName: "program2" },
    { country: "India", operator: "ViIndiaMaharashtra&Goa", scriptName: "program2" },
    { country: "India", operator: "AirTelGujarat", scriptName: "program2" }
];

const DashboardPage = () => {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(validSessions[0]);
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io('http://localhost:5001');

        socketRef.current.on('logUpdate', ({ containerName, logMessage }) => {
            console.log('Received log update:', { containerName, logMessage });
            const messages = logMessage.split('\n').filter(line => line.trim() !== '');

            setSessions((prevSessions) => {
                const sessionIndex = prevSessions.findIndex(session => session.containerName === containerName);
                if (sessionIndex !== -1) {
                    const updatedLogs = [...prevSessions[sessionIndex].logs, ...messages];
                    return prevSessions.map((session, index) =>
                        index === sessionIndex ? { ...session, logs: updatedLogs } : session
                    );
                } else {
                    return [...prevSessions, { containerName, logs: messages }];
                }
            });
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const startSession = async () => {
        const sessionData = {
            country: selectedSession.country,
            operator: selectedSession.operator,
            scriptName: selectedSession.scriptName,
        };

        try {
            const response = await axios.post('http://localhost:5001/api/sessions/start-session', sessionData);
            const { containerName } = response.data;

            setSessions((prevSessions) => [
                ...prevSessions, 
                { containerName, logs: [] }
            ]);

            socketRef.current.emit('startSession', { ...sessionData, containerName });

        } catch (error) {
            console.error('Error starting session:', error);
        }
    };

    const stopSession = async (containerName) => {
        try {
            // Send only the containerName to stop the session
            await axios.post('http://localhost:5001/api/sessions/stop-session', { containerName });
            // Remove the session from the state
            setSessions((prevSessions) => prevSessions.filter(session => session.containerName !== containerName));
            socketRef.current.emit('stopSession', { containerName }); // Emit event to stop logging on the server
        } catch (error) {
            console.error('Error stopping session:', error);
        }
    };

    console.log('Current Sessions:', sessions); // Debug log

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <h2>Select Session:</h2>
            <select 
                onChange={(e) => setSelectedSession(validSessions[e.target.selectedIndex])} 
                value={selectedSession.country} 
                className="session-select"
            >
                {validSessions.map((session, index) => (
                    <option key={index} value={session.country}>
                        {`${session.country} - ${session.operator} (${session.scriptName})`}
                    </option>
                ))}
            </select>
            <button onClick={startSession} className="start-session-button">
                Start SMS Session
            </button>
            <h2>Sessions:</h2>
            <div className="sessions-list">
                {sessions.length > 0 ? (
                    sessions.map(({ containerName, logs }) => (
                        <div key={containerName} className="session-log-container">
                            <h3 className="session-title">Session: {containerName}</h3>
                            {logs.length > 0 ? (
                                logs.map((log, index) => (
                                    <p key={index} className="log-message">{log}</p>
                                ))
                            ) : (
                                <p className="no-logs">No logs yet.</p>
                            )}
                            <button onClick={() => stopSession(containerName)} className="stop-session-button">
                                Stop Logging
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No active sessions.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
