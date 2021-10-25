const express = require('express');
const { connectDb } = require('./db/index');
// const { Question, Answer } = require('./db/index');
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
