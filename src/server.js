const express = require('express');
const { connectDb } = require('./db/index');
const {
  Product,
  // Question, Answer,
  Answers,
} = require('./db/index');
require('dotenv').config();

const app = express();

app.use(express.json());

connectDb()
  .then(async () => {
    app.listen(4000, () => {
      // eslint-disable-next-line no-console
      console.log('Listening on port 4000...');
    });
  });

app.get('/qa/questions', (req, res) => {
  const { params } = req;
  let response = null;
  Product.findOne({ product_id: params.product_id }, (err, product) => {
    if (err) throw err;
    response = product;
    response.results.forEach((question) => {
      const q = question;
      Answers.findOne({ question: question.question_id }, (answers) => {
        if (err) throw err;
        q.answers = answers.results;
      });
    });
    res.status(200).send(response);
  });
});
// eslint-disable-next-line max-len
// const answers = response.results.map((question) => Answers.findOne({ question: question.question_id }));
// Promise.all(answers)
//   .then((eachAnswer) => {
//     eachAnswer.forEach((answer) => {
//       const a = {
//         id: answer.answer_id,
//         body: answer.body,
//         date: answer.date,
//         answerer_name: answer.answerer_name,
//         helpfulness: answer.helpfulness,
//         photos: answer.photos,
//       };
//       question.answers[a.id] = a;
//     });
//   });

app.get('/qa/questions/:question_id?/answers', (req, res) => {
  const { params } = req;
  Answers.findOne({ question: params.question_id }, (err, answers) => {
    res.status(200).send(JSON.stringify(answers));
  });
});
