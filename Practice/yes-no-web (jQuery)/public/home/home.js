let questionId = "";

$(function () {
  // console.log("page loaded");
  renderQuestion();

  $("#other-question").on("click", function () {
    renderQuestion();
  });

  $(".voteBtn").on("click", function () {    
    const choice = $(this).attr("data-type");      
    vote(choice);      
  });
});

const vote = async (type) => {
  const res = await $.ajax({
    url: `http://localhost:8080/add-vote/${questionId}`,
    method: "PUT",
    data: { type: type },
  });
  if (res.success) {
    window.location.href = `/question/${res.data._id}`;
  }
};

const getRandomQuestion = async () => {
  const res = await $.ajax({
    url: "http://localhost:8080/random-question",
  });
  const questionData = res.data;
  questionId = questionData._id;
  return questionData;
};

const renderQuestion = async () => {
  const randomQuestion = await getRandomQuestion();
  $("#question-container").html(randomQuestion.content);
};
