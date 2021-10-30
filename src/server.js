const express = require('express');
const { connectDb } = require('./db/index');
const {
  // Product,
  Question, Answer, Photos,
  // Answers,
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

app.get('/qa/questions', async (req, res) => {
  const { query } = req;
  const response = {
    product_id: query.product_id,
  };

  async function dbQuery() {
    const questions = await Question.find({ product_id: query.product_id });
    const withAnswers = questions.map(async (q) => {
      const question = {
        question_id: q.question_id,
        question_body: q.question_body,
        question_date: q.question_date,
        asker_name: q.asker_name,
        question_helpfulness: q.question_helpfullness,
        reported: q.reported,
      };
      const answers = {};
      const findAnswers = await Answer.find({ question_id: q.question_id.toString() });
      findAnswers.forEach(async (answer) => {
        const id = answer.answer_id;
        const photos = await Photos.findOne({ answer_id: id.toString() });
        const transformedAnswer = {
          id,
          body: answer.body,
          date: answer.date,
          answerer_name: answer.answerer_name,
          helpfulness: answer.helpfullness,
          photos,
        };
        console.log(transformedAnswer);
        answers[id] = transformedAnswer;
      });
      question.answers = answers;
      return question;
    });
    return withAnswers;
  }

  async function send() {
    try {
      await dbQuery()
        .then((questions) => {
          Promise.all(questions)
            .then((results) => {
              response.results = results;
              res.status(200).send(response);
            });
        });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  }
  await send();
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

// app.get('/qa/questions/:question_id?/answers', (req, res) => {
//   const { params } = req;
//   Answers.findOne({ question: params.question_id }, (err, answers) => {
//     res.status(200).send(JSON.stringify(answers));
//   });
// });
