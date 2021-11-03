// const {
//   connectDb,
//   Product, Answers, Question,
//   Answer, Photos,
// } = require('./index');

// connectDb();

// const getAnswers = async (id, callback) => {
//   const answers = {};
//   const findAnswers = await Answer.find({ question_id: id.toString() });
//   findAnswers.forEach((answer) => {
//     const answerId = answer.answer_id;
//     const photos = Photos.findOne({ answer_id: answerId.toString() });
//     const transformedAnswer = {
//       id: answerId,
//       body: answer.body,
//       date: answer.date,
//       answerer_name: answer.answerer_name,
//       helpfulness: answer.helpfullness,
//       photos,
//     };
//     answers[id] = transformedAnswer;
//   });
//   callback(answers);
// };

// module.exports = {
//   getAnswers,
// };
