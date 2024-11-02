import { createSlice } from '@reduxjs/toolkit';

const programControlSlice = createSlice({
    name: 'programControl',
    initialState: {
        sessions: [],
    },
    reducers: {
        addSession: (state, action) => {
            state.sessions.push(action.payload);
        },
        removeSession: (state, action) => {
            state.sessions = state.sessions.filter(session => session.id !== action.payload);
        },
    },
});

export const { addSession, removeSession } = programControlSlice.actions;
export default programControlSlice.reducer;
