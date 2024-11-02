// src/components/SessionList.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveSessions } from '../slices/sessionSlice';

const SessionList = () => {
    const dispatch = useDispatch();
    const { activeSessions, loading, error } = useSelector((state) => state.sessions);
    const [logOutput, setLogOutput] = useState([]); // State to hold log output

    useEffect(() => {
        dispatch(fetchActiveSessions());

        // Set up an interval to refresh sessions every 10 seconds
        const intervalId = setInterval(() => {
            dispatch(fetchActiveSessions());
        }, 10000);

        // Initialize WebSocket connection
        const socket = new WebSocket('ws://localhost:5001');

        socket.onmessage = (event) => {
            setLogOutput(prevLogs => [...prevLogs, event.data]); // Append new log to existing logs
        };

        // Clean up on component unmount
        return () => {
            clearInterval(intervalId);
            socket.close();
        };
    }, [dispatch]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">Error fetching sessions: {error}</div>;

    return (
        <div className="active-sessions-container">
            <h2 className="title">Active Sessions</h2>
            {activeSessions.length > 0 ? (
                <ul className="sessions-list">
                    {activeSessions.map((session, index) => (
                        <li key={index} className="session-item">
                            <div className="session-details">
                                <strong className="session-name">{session.name}</strong>
                                <span className="session-timestamp">Active since {session.timestamp}</span>
                                <span className="session-status">({session.status})</span>
                            </div>
                            <div className="socket-info">
                                {session.socketCount} Socket(s) in {session.socketPath}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-sessions-message">No active sessions found.</p>
            )}
            {logOutput.length > 0 && (
                <div className="log-output">
                    <h3>Log Output</h3>
                    <pre>{logOutput.join('\n')}</pre>
                </div>
            )}
        </div>
    );
};

export default SessionList;
