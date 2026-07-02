app.use(express.static(path.join(__dirname, "public")));

app.get("/display.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "display.html"));
});

app.get("/control.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "control.html"));
});
