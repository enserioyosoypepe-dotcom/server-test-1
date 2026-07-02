const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD = "quesososo123";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let state = {
  name: "Main System",
  description: "Control panel connected and waiting for instructions.",
  status: "OK",
  reason: "Everything is running normally."
};

// ---------- RUTAS DE PRUEBA ----------
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/debug", (req, res) => {
  res.json({
    dirname: __dirname,
    staticFolder: path.join(__dirname, "public")
  });
});

// Fuerza el envío de los HTML
app.get("/display.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "display.html"));
});

app.get("/control.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "control.html"));
});

// ---------- API ----------
app.get("/api/state", (req, res) => {
  res.json(state);
});

app.post("/api/login", (req, res) => {
  const { password } = req.body || {};

  if (password === PASSWORD) {
    return res.json({ success: true });
  }

  res.status(401).json({
    success: false,
    message: "Incorrect password"
  });
});

app.post("/api/update", (req, res) => {
  const {
    password,
    name,
    description,
    status,
    reason
  } = req.body || {};

  if (password !== PASSWORD) {
    return res.status(401).json({
      success: false,
      message: "Incorrect password"
    });
  }

  if (typeof name === "string" && name.trim())
    state.name = name;

  if (typeof description === "string" && description.trim())
    state.description = description;

  if (typeof status === "string" && status.trim())
    state.status = status;

  if (typeof reason === "string" && reason.trim())
    state.reason = reason;

  res.json({
    success: true,
    state
  });
});

// ---------- INICIAR SERVIDOR ----------
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Display: http://localhost:${PORT}/display.html`);
  console.log(`Control: http://localhost:${PORT}/control.html`);
});
