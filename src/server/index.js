const app = require('./server');
const { connectDb } = require('../db/index');

connectDb()
  .then(async () => {
    app.listen(4000, () => {
      // eslint-disable-next-line no-console
      console.log('Listening on port 4000...');
    });
  })
  .catch((err) => {
    console.log('Connection error: ', err);
  });
