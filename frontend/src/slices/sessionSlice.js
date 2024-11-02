import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch active sessions
export const fetchActiveSessions = createAsyncThunk('sessions/fetchActive', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('http://localhost:5001/api/sessions/active'); // Adjust the endpoint if needed
        const activeSessionsString = response.data.activeSessions;

        // Parse the string response into an array of objects
        const activeSessionsArray = parseActiveSessionsString(activeSessionsString);
        return activeSessionsArray;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Function to parse the active sessions string
const parseActiveSessionsString = (sessionsString) => {
    const sessionsArray = [];
    const lines = sessionsString.split('\n');

    lines.forEach(line => {
        const match = line.match(/(\d+)\.([^\t]+)\s+\(([^)]+)\)\s+\(([^)]+)\)/);
        if (match) {
            sessionsArray.push({
                id: match[1], // assuming the ID is the first number
                name: match[2], // program name
                timestamp: match[3], // timestamp
                status: match[4], // status
                socketCount: 1, // hardcoding this for now; adjust if needed
                socketPath: '/run/screen/S-vikash', // hardcoding; replace with dynamic data if available
            });
        }
    });

    return sessionsArray;
};


const sessionSlice = createSlice({
    name: 'sessions',
    initialState: {
        activeSessions: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActiveSessions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActiveSessions.fulfilled, (state, action) => {
                state.loading = false;
                state.activeSessions = action.payload;
            })
            .addCase(fetchActiveSessions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default sessionSlice.reducer;
