const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const CardModel = require("./models/flashcard");

const app = express();

const PORT = 5000;

mongoose.connect(
  "mongodb://localhost:27017/flashcard-web-class",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
    }
    console.log("MongoDB Server started...");
  }
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.post("/api/flashcards", async (req, res) => {
  const newCard = req.body;

  const saveCard = await CardModel.create(newCard);

  res.send({ success: 1, data: saveCard, message: "Card created" });
});

app.get("/api/flashcards/random", async (req, res) => {
  try {
    const { category } = req.query;
    let randomCards = [];
    if (category === "all") {
      randomCards = await CardModel.aggregate().sample(1);
    } else {
      randomCards = await CardModel.aggregate().match({ category }).sample(1);
    }

    if (!randomCards.length) {
      return res.status(404).send({ success: 0 });
    }

    res.send({
      success: 1,
      data: randomCards[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: 0 });
  }
});

app.get("/api/flashcards/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const foundCard = await CardModel.findById(id);

    if (!foundCard) {
      return res.send({ success: 0 });
    }
    res.send({
      success: 1,
      data: foundCard,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: 0 });
  }
});

app.put("/api/flashcards/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedCard = await CardModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCard) {
      return res.send({ success: 0, data: null });
    }
    res.send({ success: 1, data: updatedCard });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: 0 });
  }
});

app.get("/api/flashcards/random", async (req, res) => {
  try {
    const { category } = req.query;
    let randomCards = [];
    if (category === "all") {
      randomCards = await CardModel.aggregate().sample(1);
    } else {
      randomCards = await CardModel.aggregate().match({ category }).sample(1);
    }

    if (!randomCards.length) {
      return res.status(404).send({ success: 0 });
    }

    res.send({
      success: 1,
      data: randomCards[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: 0 });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/html/home.html"));
});

app.get("/create", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/html/create.html"));
});

app.get("/edit/flashcards/:id", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/html/edit.html"));
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server started at port ${PORT}...`);
});
