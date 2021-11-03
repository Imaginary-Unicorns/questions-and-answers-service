/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const {
  connectDb,
  // Product,
  // Question,
  // Answer,
  // Answers,
  Photos,
} = require('./index');

const stream = fs.createReadStream(path.join(__dirname, './csv/xai.csv'));
// const file = 'i';
let currentId = '0';
let currentUrls = [];

// PHOTOS CSV LOAD
connectDb()
  .then(() => {
    let count = 0;
    stream.pipe(csv())
      .on('data', (data) => {
        if (data.answer_id === currentId) {
          currentUrls.push(data.url);
        } else if (currentId === '0') {
          currentUrls.push(data.url);
          currentId = data.answer_id;
        } else {
          count += 1;
          const newPhotos = new Photos({
            answer_id: currentId,
            urls: currentUrls,
          });
          newPhotos.save((err) => {
            if (err) {
              console.log('error');
            }
          });
          currentId = data.answer_id;
          currentUrls = [data.url];
        }
      })
      .on('end', () => {
        console.log('done with photos: ', count, currentId, currentUrls);
      });
  });

// ELT--TRANSFROM DB in progress
// connectDb()
//   .then(async () => {
//     const answers = await Answers.find();
//     answers.forEach((question) => {
//       count += 1;
//       question.results.forEach(async (answer) => {
//         const id = answer.answer_id.toString();
//         const p = await Photos.find({ answer_id: id });
//       });
//     });
//   })
//   .then(() => {
//     console.log(count);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// ANSWERS CSV LOAD
// connectDb()
//   .then(() => {
//     let count = 0;
//     stream.pipe(csv())
//       .on('data', async (data) => {
//         count += 1;
//         const photoId = data.id.toString();
//         const photos = await Photos.findOne({ answer_id: photoId });
//         const newAnswer = new Answer({
//           answer_id: data.id,
//           question_id: data.question_id,
//           body: data.body,
//           date: data.date_written,
//           answerer_name: data.answerer_name,
//           helpfullness: data.helpful,
//           reported: data.reported,
//           photos: photos.urls,
//           answerer_email: data.answerer_email,
//         });
//         newAnswer.save();
//       })
//       .on('end', () => {
//         console.log('done with answers: ', count, file);
//       });
//   });

// FIRST ATTEMPT AT ANSWERS
//       newAnswer.photos = results.urls;
//       Answers.findOneAndUpdate({ question: data.question_id },
//         { $push: { results: newAnswer } },
//         { new: true, upsert: true },
//         (error, product) => {
//           if (product) { count += 1; console.log('1'); }
//           if (error) throw err;
//         });
//     });

// SECOND ATTEMPT AT ANSWERS
// if (data.question_id === currentId) {
//   currentAnswers.push(newAnswer);
// } else {
//   count += 1;
//   const newAnswers = new Answers({
//     question: currentId,
//     results: currentAnswers,
//   });
//   newAnswers.save((err) => {
//     if (err) {
//       console.log('error');
//     }
//     console.log('yes');
//   });
//   currentId = data.question_id;
//   currentAnswers = [newAnswer];
// }
//     })
//     .on('end', () => {
//       console.log('done with answers', count);
//     });
// });

// connectDb()
//   .then(() => {
//     let count = 0;
//     stream.pipe(csv())
//       .on('data', (data) => {
//         count += 1;
//         const newQuestion = new Question({
//           question_id: data.id,
//           product_id: data.product_id,
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
//           (err) => {
//             if (err) throw err;
//           });
//       })
//       .on('end', () => {
//         console.log('done with questions: ', count);
//       });
//   });
