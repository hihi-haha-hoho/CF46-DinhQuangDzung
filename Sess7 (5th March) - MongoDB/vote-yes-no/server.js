const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const _ = require("lodash");
const mongoose = require("mongoose");
const QuestionModel = require("./models/question");

mongoose.connect(
  "mongodb://localhost:27017/vote",
  { useNewUrlParser: true },
  (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Connected to MongoDB server...");
  }
);

// client gửi lên với header application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// client gửi lên với header application/json
app.use(express.json());

app.use(express.static("public"));

app.get("/ask", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/ask/index.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/home/index.html"));
});

app.get("/question/:idQuestion", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/detail/index.html"));
});

app.get("/detail/:idQuestion", async (req, res) => {
  try {
    const { idQuestion } = req.params;
    const foundQuestion = await QuestionModel.findById(idQuestion);

    if (!foundQuestion) {
      return res.status(404).send({ success: 0, data: null });
    }
    res.send({ success: 1, data: foundQuestion });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: 0, data: null });
  }
});

app.post("/create-question", async (req, res) => {
  try {
    const newQuestion = {
      content: req.body.content,
    };
    const saveQuestion = await QuestionModel.create(newQuestion);

    res.send({
      success: 1,
      data: saveQuestion,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: 0,
      data: null,
    });
  }
});

app.get("/random-question", async (req, res) => {
  try {
    const questions = await QuestionModel.aggregate().sample(1);
    
    if (!questions[0]) {
      return res.status(404).send({ success: 0, data: null });
    }

    res.send({ success: 1, data: questions[0] });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: 0,
      data: null,
    });
  }
});

// app.put("/add-vote/:idQuestion", async (req, res) => {
//   try {
//     const { idQuestion } = req.params;
//     const { type } = req.body;

//     const foundQuestion = await QuestionModel.findById(idQuestion);

//     if (!foundQuestion) {
//       return res.status(404).send({
//         success: 0,
//         data: null,
//       });
//     }

//     foundQuestion[type]++;
//     await foundQuestion.save();

//     res.send({
//       success: 1,
//       data: foundQuestion,
//     });
//   } catch {
//     console.log(err);
//     res.status(500).send({
//       success: 0,
//       data: null,
//     });
//   }
// });

app.put("/add-vote/:idQuestion", async (req, res) => {
  try {
    const { idQuestion } = req.params;
    const { type } = req.body;

    const foundQuestion = await QuestionModel.findByIdAndUpdate(
      idQuestion,
      {
        $inc: { [type]: 1 },
      },
      { new: true }
    );

    if (!foundQuestion) {
      return res.status(404).send({
        success: 0,
        data: null,
      });
    }

    res.send({
      success: 1,
      data: foundQuestion,
    });
  } catch {
    console.log(err);
    res.status(500).send({
      success: 0,
      data: null,
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/404/index.html"));
});

app.delete("/question/:idQuestion", async (req, res) => {
  const { idQuestion } = req.params;
  const deleteQuestion = await QuestionModel.findByIdAndDelete(idQuestion);

  if (!deleteQuestion) {
    return res.status(404).send({
      success: 0,
      data: null,
    });
  }

  res.send({
    success: 1,
    data: deleteQuestion,
    message: "Question deleted",
  });
});

app.listen(8080, (err) => {
  if (err) throw err;
  console.log("Server started...");
});
