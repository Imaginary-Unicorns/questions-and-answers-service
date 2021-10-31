const express = require('express');
const { connectDb } = require('./db/index');
const {
  // Product, Answers,
  Question, Answer, Photos,
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

// -----GET QUESTIONS-----
app.get('/qa/questions', async (req, res) => {
  const { query } = req;
  let count = 5;
  let page = 0;
  if (query.count) {
    count = query.count;
  }
  if (query.page) {
    page = query.page - 1;
  }
  const response = {
    product_id: query.product_id,
  };

  async function questionQuery() {
    const questions = await Question.find({ product_id: query.product_id })
      .limit(count)
      .skip(page * count)
      .exec();

    const withAnswers = questions.map(async (q) => {
      const questionId = q.question_id;
      const question = {
        question_id: questionId,
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
        let photos = {};
        const findPhotos = await Photos.findOne({ answer_id: id.toString() });
        if (findPhotos) {
          photos = findPhotos;
        } else {
          photos.urls = [];
        }
        const transformedAnswer = {
          id,
          body: answer.body,
          date: answer.date,
          answerer_name: answer.answerer_name,
          helpfulness: answer.helpfullness,
          photos: photos.urls,
        };
        answers[id] = transformedAnswer;
      });
      question.answers = answers;
      return question;
    });
    return withAnswers;
  }

  async function send() {
    try {
      await questionQuery()
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
  send();
});

// -----GET ANSWERS-----
app.get('/qa/questions/:question_id?/answers', (req, res) => {
  const questionId = req.params.question_id.toString();
  const { query } = req;
  let count = 5;
  let page = 0;
  if (query.count) {
    count = query.count;
  }
  if (query.page) {
    page = query.page - 1;
  }
  const response = {
    question: questionId,
    page,
    count,
  };

  async function answerQuery() {
    const findAnswers = await Question.find({ question_id: questionId })
      .limit(count)
      .skip(page * count)
      .exec();

    const results = findAnswers.map(async (answer) => {
      const id = answer.answer_id;
      let photos = {};
      const findPhotos = await Photos.findOne({ answer_id: id.toString() });
      if (findPhotos) {
        photos = findPhotos;
      } else {
        photos.urls = [];
      }
      const transformedAnswer = {
        answer_id: id,
        body: answer.body,
        date: answer.date,
        answerer_name: answer.answerer_name,
        helpfulness: answer.helpfullness,
        photos: photos.urls,
      };
      return transformedAnswer;
    });
    return results;
  }

  async function send() {
    try {
      await answerQuery()
        .then((answers) => {
          Promise.all(answers)
            .then((results) => {
              response.results = results;
              res.status(200).send(response);
            });
        });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  }
  send();
});
