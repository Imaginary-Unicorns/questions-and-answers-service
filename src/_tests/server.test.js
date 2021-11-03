const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/server');
const testQuestions = require('../fixtures/testQuestions.json');
const testAnswers = require('../fixtures/testAnswers.json');
const {
  Question, Answer,
} = require('../db/index');

beforeEach((done) => {
  mongoose.connect('mongodb://localhost:27017/jest',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done());
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

test('GET /qa/questions/:product_id', async () => {
  const q1 = testQuestions.results[0];
  const q2 = testQuestions.results[1];
  const a1 = testAnswers.results[0];
  const a2 = testAnswers.results[1];

  const questionOne = new Question({
    question_id: q1.question_id,
    product_id: testQuestions.product_id,
    question_body: q1.question_body,
    question_date: q1.question_date,
    asker_name: q1.asker_name,
    question_helpfullness: q1.question_helpfulness,
    reported: q1.reported,
    asker_email: 'whatever@fakemail.com',
  });
  const questionTwo = new Question({
    question_id: q2.question_id,
    product_id: testQuestions.product_id,
    question_body: q2.question_body,
    question_date: q2.question_date,
    asker_name: q2.asker_name,
    question_helpfullness: q2.question_helpfulness,
    reported: q2.reported,
    asker_email: 'hello@fakemail.com',
  });
  const answerOne = new Answer({
    answer_id: a1.answer_id,
    question_id: testAnswers.question,
    body: a1.body,
    date: a1.date,
    answerer_name: a1.answerer_name,
    helpfullness: a1.helpfulness,
    reported: a1.reported,
    answerer_email: 'whatever@fakemail.com',
  });
  const answerTwo = new Answer({
    answer_id: a2.answer_id,
    question_id: testAnswers.question,
    body: a2.body,
    date: a2.date,
    answerer_name: a2.answerer_name,
    helpfullness: a2.helpfulness,
    reported: a2.reported,
    answerer_email: 'womp@fakemail.com',
  });

  await questionOne.save();
  await questionTwo.save();
  await answerOne.save();
  await answerTwo.save();

  await supertest(app).get(`/qa/questions/${testQuestions.product_id}`)
    .expect(200)
    .then((res) => {
      const { results } = res.body;
      expect(results.length).toBe(2);
      expect(results[0].question_id).toBe(q1.question_id);
      expect(results[0].asker_name).toBe(q1.asker_name);
      expect(results[1].question_body).toBe(q2.question_body);
      expect(results[1].question_date).toBe(q2.question_date);
    });
});

test('GET /qa/questions/:question_id/answers', async () => {
  const a1 = testAnswers.results[0];
  const a2 = testAnswers.results[1];

  const answerOne = new Answer({
    answer_id: a1.answer_id,
    question_id: testAnswers.question,
    body: a1.body,
    date: a1.date,
    answerer_name: a1.answerer_name,
    helpfullness: a1.helpfulness,
    reported: a1.reported,
    answerer_email: 'whatever@fakemail.com',
  });
  const answerTwo = new Answer({
    answer_id: a2.answer_id,
    question_id: testAnswers.question,
    body: a2.body,
    date: a2.date,
    answerer_name: a2.answerer_name,
    helpfullness: a2.helpfulness,
    reported: a2.reported,
    answerer_email: 'womp@fakemail.com',
  });
  await answerOne.save();
  await answerTwo.save();

  await supertest(app).get(`/qa/questions/${testAnswers.question}/answers`)
    .expect(200)
    .then((res) => {
      const { results } = res.body;
      expect(results.length).toBe(2);
      expect(results[0].answer_id).toBe(a1.answer_id);
      expect(results[0].body).toBe(a1.body);
      expect(results[1].date).toBe(a2.date);
      expect(results[1].answerer_name).toBe(a2.answerer_name);
    });
});
