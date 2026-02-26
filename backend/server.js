const express = require('express');
const cors = require('cors');
const os = require('os');

const PORT = process.env.PORT || 3000;
const app = express();
// Health + API check endpoints (for k8s + frontend)
app.get("/api", (req, res) => {
  res.json({ message: "API is working" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, service: "backend" });
});



app.use(cors());
app.use(express.json());

// Simple health endpoints
app.get('/healthz', (_req, res) => res.status(200).send('ok'));
app.get('/readyz', (_req, res) => res.status(200).send('ready'));

// API endpoint the frontend calls
app.get('/api/ping', (_req, res) => {
    res.json({
        ok: true,
        message: 'pong',
        service: 'backend',
        time: new Date().toISOString(),
        hostname: os.hostname()
    });
});

const server = app.listen(PORT, () => {
    console.log(`[backend] listening on http://0.0.0.0:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('[backend] SIGTERM received, shutting down…');
    server.close(() => process.exit(0));
});
