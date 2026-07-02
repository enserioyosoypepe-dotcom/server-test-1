const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/display.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "display.html"));
});

app.get("/control.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "control.html"));
});
