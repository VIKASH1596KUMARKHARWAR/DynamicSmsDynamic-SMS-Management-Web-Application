const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, 'YOUR_SECRET_KEY', (err, user) => { // Replace with your secret key
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user; // Attach user info to request
        next(); // Call next middleware or route handler
    });
};


app.post('/api/control-session', authenticateToken, (req, res) => {
    // Only authenticated users can reach here
    res.send('Session controlled successfully');
});