var express = require("express");
var app = express();
var cors = require("cors");

app.set("port", process.env.PORT || 4000);

var Datastore = require("nedb");
db = new Datastore({ filename: "highscore" });
db.loadDatabase();

app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
  res.send(
    "A simple service to store and retrieve high score for my ping-pong web app"
  );
});

app.get("/getHighScore", (req, res) => {
  db.find({ type: "highscore" }, (err, docs) => {
    if (err) res.send(err);
    else {
      if (docs[0]) {
        const { name, score } = docs[0];
        res.json({ name, score });
      } else res.send("Could not find the high score :(");
    }
  });
});

app.post("/updateHighScore", (req, res) => {
  console.log(req.body)
  const { name, score } = req.body;
  if (name && score) {
    db.find({ type: "highscore" }, (err, docs) => {
      if (docs[0])
        db.update(
          { type: "highscore" },
          { name, score, type: "highscore" },
          {}
        );
      else {
        db.insert({ name, score, type: "highscore" });
      }
    });
    res.send("Successfully update high score!");
  } else {
    res.send("Could not update the highscore :(");
  }
});

app.listen(app.get("port"), () => {
  console.log("Ping pong highscore server listening on port ", app.get("port"));
});
