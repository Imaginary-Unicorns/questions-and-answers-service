/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const {
  connectDb,
  // Product, Question, Answer, Answers,
  Photos,
} = require('./index');

const stream = fs.createReadStream(path.join(__dirname, './csv/answers_photos.csv'));

connectDb()
  .then(() => {
    stream.pipe(csv())
      .on('data', (data) => {
        Photos.findOneAndUpdate({ answer_id: data.answer_id },
          { $push: { urls: data.url } },
          { new: true, upsert: true },
          (err) => {
            if (err) throw err;
          });
      })
      .on('end', () => {
        console.log('done with photos: ');
      });
  });
// connectDb()
//   .then(() => {
//     let count = 0;
//     fs.createReadStream(path.join(__dirname, '/questions.csv'))
//       .pipe(csv())
//       .on('data', (data) => {
//         const newQuestion = new Question({
//           question_id: data.id,
//           question_body: data.body,
//           question_date: data.date_written,
//           asker_name: data.asker_name,
//           question_helpfullness: data.helpful,
//           reported: data.reported,
//           asker_email: data.asker_email,
//           answers: {},
//         });
//         Product.findOneAndUpdate({ product_id: data.product_id },
//           { $push: { results: newQuestion } },
//           { new: true, upsert: true },
//           (err, product) => {
//             if (product) { count += 1; console.log('1'); }
//             if (err) throw err;
//           });
//       })
//       .on('end', () => {
//         console.log('done with questions: ', count);
//       });
//   });
// connectDb()
//   .then(() => {
//     fs.createReadStream(path.join(__dirname, '/test-answers.csv'))
//       .pipe(csv())
//       .on('data', (data) => {
//         const newAnswer = new Answer({
//           answer_id: data.id,
//           body: data.body,
//           date: data.date_written,
//           answerer_name: data.answerer_name,
//           helpfullness: data.helpful,
//           reported: data.reported,
//           photos: [],
//           answerer_email: data.answerer_email,
//         });
//         const photoId = data.id.toString();
//         Photos.findOne({ answer_id: photoId }, 'urls', (err, results) => {
//           if (err) throw err;
//           if (results) {
//             console.log('results', results.urls);
//             newAnswer.photos = results.urls;
//           }
//           Answers.findOneAndUpdate({ question: data.question_id },
//             { $push: { results: newAnswer } },
//             { new: true, upsert: true },
//             (error, answer) => {
//               if (answer) { console.log('1'); }
//               if (error) throw error;
//             });
//         });
//       })
//       .on('end', () => {
//         console.log('done with answers');
//       });
//   });
