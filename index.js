const express = require("express");

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname + "/public/"));
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n\n[server] Server started on PORT:${PORT}`);
});
