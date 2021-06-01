const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect(
  "mongodb+srv://admin:OmaJ0pQiatc56h8C@cluster0.wznbh.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);
mongoose.set("useCreateIndex", true);
mongoose.connection.on("error", (error) => console.log(error));
mongoose.connection.once("open", () =>
  console.log("[server] MongoDB connected\n")
);
mongoose.Promise = global.Promise;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");

const router = require("./routes/routes");

app.use(router);
app.use(express.static(__dirname + "/public/"));
app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));

app.route("/*").all((req, res) => {
  res.status(404).send({
    message: "Page not found",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n\n[server] Server started on PORT:${PORT}`);
});
