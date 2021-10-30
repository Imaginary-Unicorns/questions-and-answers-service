const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = () => mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const { Schema } = mongoose;

const answerSchema = new Schema({
  answer_id: Number,
  question_id: String,
  body: String,
  date: Date,
  answerer_name: String,
  helpfullness: Number,
  reported: Boolean,
  photos: [String],
  answerer_email: String,
});

const answersSchema = new Schema({
  question: String, // this is an id number but its coming in as a string from the csv file
  results: [answerSchema],
});

const questionSchema = new Schema({
  question_id: Number,
  product_id: String,
  question_body: String,
  question_date: Date,
  asker_name: String,
  question_helpfullness: Number,
  reported: Boolean,
  asker_email: String,
  answers: {},
});

const productSchema = new Schema({
  product_id: String,
  results: [questionSchema],
});

const photoSchema = new Schema({
  answer_id: String,
  urls: [String],
});

const Answer = mongoose.model('Answer', answerSchema, 'answers');
const Answers = mongoose.model('Answers', answersSchema, 'answerGroups');
const Question = mongoose.model('Question', questionSchema, 'questions');
const Product = mongoose.model('Product', productSchema, 'products');
const Photos = mongoose.model('Photos', photoSchema, 'photos');

module.exports = {
  Product,
  Question,
  Answer,
  Answers,
  Photos,
  connectDb,
};
