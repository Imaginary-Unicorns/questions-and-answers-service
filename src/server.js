const express = require('express');
const { connectDb } = require('./db/index');
// const { Product, Question, Answer, Answers } = require('./db/index');
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

// app.get('/qa/questions', (req, res) => {
//   const { params } = req;
//   let response = null;
//   Product.findOne({ product_id: params.product_id }, (err, product) => {
//     if (err) throw err;
//     response = product;
//     response.results.map((question) => {
//       Answers.findOne({ })
//     })
//   });
// });
