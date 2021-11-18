/* eslint-disable no-await-in-loop */
require('newrelic');
const express = require('express');
// const { connectDb } = require('../db/index');
const {
  // Product, Answers,
  Question, Answer, Photos,
} = require('../db/index');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static('public'));
module.exports = app;

// -----GET QUESTIONS-----
app.get('/qa/questions/:product_id', async (req, res) => {
  const { params, query } = req;
  let count = 5;
  let page = 0;
  if (query.count) {
    count = query.count;
  }
  if (query.page) {
    page = query.page - 1;
  }
  const response = {
    product_id: params.product_id,
    results: [],
  };

  (async () => {
    const questions = await Question.find({ product_id: params.product_id, reported: false })
      .limit(count)
      .skip(page * count);
    if (!questions) {
      res.json({ success: false, message: 'Product has no questions' });
      return;
    }

    for (let i = 0; i < questions.length; i += 1) {
      const questionId = questions[i].question_id;
      const question = {
        question_id: questionId,
        question_body: questions[i].question_body,
        question_date: questions[i].question_date,
        asker_name: questions[i].asker_name,
        question_helpfulness: questions[i].question_helpfullness,
        reported: questions[i].reported,
      };
      const answers = {};
      // eslint-disable-next-line max-len
      const findAnswers = await Answer.find({ question_id: questionId.toString(), reported: false });

      for (let j = 0; j < findAnswers.length; j += 1) {
        const id = findAnswers[j].answer_id;
        let photos = [];
        const findPhotos = await Photos.find({ answer_id: id.toString() });
        if (findPhotos.length) {
          photos = findPhotos[0].urls;
        }
        const transformedAnswer = {
          id,
          body: findAnswers[j].body,
          date: findAnswers[j].date,
          answerer_name: findAnswers[j].answerer_name,
          helpfulness: findAnswers[j].helpfullness,
          photos,
        };
        answers[id] = transformedAnswer;
      }

      question.answers = answers;
      response.results.push(question);
    }
    res.status(200).send(response);
  })()
    .catch((err) => {
      res.status(500).send(err);
    });
});
// async function questionQuery() {
//   const questions = await Question.find({ product_id: params.product_id, reported: false })
//     .limit(count)
//     .skip(page * count);

//   const withAnswers = questions.map(async (q) => {
//     const questionId = q.question_id;
// const question = {
//   question_id: questionId,
//   question_body: q.question_body,
//   question_date: q.question_date,
//   asker_name: q.asker_name,
//   question_helpfulness: q.question_helpfullness,
//   reported: q.reported,
// };
//     const answers = {};
// eslint-disable-next-line max-len
// const findAnswers = await Answer.find({ question_id: q.question_id.toString(), reported: false });
// findAnswers.forEach(async (answer) => {
//   console.log('answer', answer);
//   const id = answer.answer_id;
//   let photos = {};
//   const findPhotos = await Photos.find({ answer_id: id.toString() });
//   if (findPhotos) {
//     photos = findPhotos;
//   } else {
//     photos.urls = [];
//   }
//   const transformedAnswer = {
//     id,
//     body: answer.body,
//     date: answer.date,
//     answerer_name: answer.answerer_name,
//     helpfulness: answer.helpfullness,
//     photos: photos.urls,
//   };
//   answers[id] = transformedAnswer;
// });
// question.answers = answers;
//     return question;
//   });
//   return withAnswers;
// }

// async function send() {
//   try {
//     await questionQuery()
//       .then((questions) => {
//         Promise.all(questions)
//           .then((results) => {
//             response.results = results;
//             res.status(200).send(response);
//           });
//       });
//   } catch (err) {
//     res.status(500).send(err);
//   }
// }
// send();

// -----GET ANSWERS-----
app.get('/qa/questions/:question_id/answers', (req, res) => {
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
    results: [],
  };

  (async () => {
    const answers = await Answer.find({ question_id: questionId, reported: false })
      .limit(count)
      .skip(page * count);
    if (!answers) {
      res.json({ success: false, message: 'Question has no answers' });
      return;
    }

    for (let i = 0; i < answers.length; i += 1) {
      const id = answers[i].answer_id;
      let photos = [];
      const findPhotos = await Photos.find({ answer_id: id.toString() });
      if (findPhotos.length) {
        photos = findPhotos[0].urls;
      }
      const transformedAnswer = {
        answer_id: id,
        body: answers[i].body,
        date: answers[i].date,
        answerer_name: answers[i].answerer_name,
        helpfulness: answers[i].helpfullness,
        photos,
      };
      response.results.push(transformedAnswer);
    }
    res.status(200).send(response);
  })()
    .catch((err) => {
      res.status(500).send(err);
    });
});
// async function answerQuery() {
//   const findAnswers = await Answer.find({ question_id: questionId, reported: false })
//     .limit(count)
//     .skip(page * count)
//     .exec();

//   const results = findAnswers.map(async (answer) => {
//     const id = answer.answer_id;
//     let photos = {};
//     const findPhotos = await Photos.find({ answer_id: id.toString() });
//     if (findPhotos) {
//       photos = findPhotos;
//     } else {
//       photos.urls = [];
//     }
//     const transformedAnswer = {
//       answer_id: id,
//       body: answer.body,
//       date: answer.date,
//       answerer_name: answer.answerer_name,
//       helpfulness: answer.helpfullness,
//       photos: photos.urls,
//     };
//     return transformedAnswer;
//   });
//   return results;
// }

// async function send() {
//   try {
//     await answerQuery()
//       .then((answers) => {
//         Promise.all(answers)
//           .then((results) => {
//             response.results = results;
//             res.status(200).send(response);
//           });
//       });
//   } catch (err) {
//     res.status(500).send(err);
//   }
// }
// send();

// -----POST QUESTION-----
app.post('/qa/questions', (req, res) => {
  const { body } = req;

  async function save() {
    const lastQuestion = await Question.find().sort({ _id: -1 }).limit(1).exec();
    const id = lastQuestion[0].question_id + 1;

    const newQuestion = new Question({
      question_id: id,
      product_id: body.product_id,
      question_body: body.body,
      question_date: Date.now(),
      asker_name: body.name,
      question_helpfullness: 0,
      reported: false,
      asker_email: body.email,
    });
    newQuestion.save();
  }
  async function send() {
    try {
      await save()
        .then(() => {
          res.status(201).send('CREATED');
        });
    } catch (err) {
      res.status(500).send(err);
    }
  }
  send();
});
// -----POST ANSWER-----
app.post('/qa/questions/:question_id/answers', (req, res) => {
  const { body } = req;
  const questionId = req.params.question_id;
  let photos;
  if (body.photos.length) {
    photos = body.photos;
  } else {
    photos = [];
  }

  async function save() {
    const lastAnswer = await Answer.find().sort({ _id: -1 }).limit(1).exec();
    const id = lastAnswer[0].answer_id + 1;
    const newAnswer = new Answer({
      answer_id: id,
      question_id: questionId,
      body: body.body,
      date: Date.now(),
      answerer_name: body.name,
      helpfullness: 0,
      reported: false,
      answerer_email: body.email,
    });
    newAnswer.save();

    if (photos.length) {
      const newPhotos = new Photos({
        answer_id: id,
        urls: photos,
      });
      newPhotos.save();
    }
  }
  async function send() {
    try {
      await save()
        .then(() => {
          res.status(201).send('CREATED');
        });
    } catch (err) {
      res.status(500).send(err);
    }
  }
  send();
});
// -----PUT QUESTION HELPFUL-----
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  const questionId = req.params.question_id;
  if (req.body.product_id) {
    const productId = req.body.product_id.toString();
    (async () => {
      const id = await Question.find({ product_id: productId, question_id: questionId }, '_id');
      Question.findByIdAndUpdate(id, { $inc: { question_helpfullness: 1 } },
        { new: true })
        .then(() => {
          res.status(204).send();
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    })()
      .catch((err) => {
        res.status(500).send(err);
      });
  } else {
    Question.findOneAndUpdate({ question_id: questionId },
      { $inc: { helpfullness: 1 } },
      { new: true })
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
});
// -----PUT QUESTION REPORT-----
app.put('/qa/questions/:question_id/report', (req, res) => {
  const questionId = req.params.question_id;
  if (req.body.product_id) {
    const productId = req.body.product_id.toString();
    (async () => {
      const id = await Question.find({ product_id: productId, question_id: questionId }, '_id');
      Question.findByIdAndUpdate(id, { $set: { reported: true } },
        { new: true })
        .then(() => {
          res.status(204).send();
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    })()
      .catch((err) => {
        res.status(500).send(err);
      });
  } else {
    Question.findOneAndUpdate({ question_id: questionId },
      { $set: { reported: true } },
      { new: true })
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
});
// -----PUT ANSWER HELPFUL-----
app.put('/qa/questions/:answer_id/helpful', (req, res) => {
  const id = req.params.answer;
  Answer.findOneAndUpdate({ answer_id: id },
    { $inc: { helpfullness: 1 } },
    { new: true })
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
// -----PUT ANSWER REPORT-----
app.put('/qa/questions/:answer_id/report', (req, res) => {
  const id = req.params.answer_id;
  Answer.findOneAndUpdate({ answer_id: id },
    { $set: { reported: true } },
    { new: true })
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
