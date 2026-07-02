const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD = 'quesososo123';

const fs = require("fs");

console.log("PUBLIC EXISTS:", fs.existsSync(path.join(__dirname, "public")));
console.log("PUBLIC FILES:", fs.readdirSync(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory state. This is what display.html shows and what control.html edits.
let state = {
  name: 'Main System',
  description: 'Control panel connected and waiting for instructions.',
  status: 'OK',
  reason: 'Everything is running normally.'
};

// display.html polls this every few seconds
app.get('/api/state', (req, res) => {
  res.json(state);
});

// Lightweight endpoint for external keep-alive/uptime services (cron-job.org, UptimeRobot, etc.)
// Cheap on purpose: no state lookup, no JSON parsing, just proves the server is awake.
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// control.html uses this to log in
app.post('/api/login', (req, res) => {
  const { password } = req.body || {};
  if (password === PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Incorrect password' });
  }
});

// control.html uses this to update the state
// Password is sent with every update (no persistent server-side session)
app.post('/api/update', (req, res) => {
  const { password, name, description, status, reason } = req.body || {};

  if (password !== PASSWORD) {
    return res.status(401).json({ success: false, message: 'Incorrect password' });
  }

  if (typeof name === 'string' && name.trim() !== '') state.name = name;
  if (typeof description === 'string' && description.trim() !== '') state.description = description;
  if (typeof status === 'string' && status.trim() !== '') state.status = status;
  if (typeof reason === 'string' && reason.trim() !== '') state.reason = reason;

  res.json({ success: true, state });
});

app.get("/display", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "display.html"));
});

app.get("/control", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "control.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`  -> Display: http://localhost:${PORT}/display.html`);
  console.log(`  -> Control: http://localhost:${PORT}/control.html`);
});
