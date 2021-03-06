/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    questions: {
      executor: 'ramping-arrival-rate',
      startRate: 25,
      timeUnit: '1s',
      preAllocatedVUs: 25,
      maxVUs: 500,
      stages: [
        { duration: '30s', target: 100 },
        // { duration: '1m', target: 40 },
        { duration: '1m', target: 200 },
        // { duration: '1m', target: 80 },
        { duration: '1m', target: 300 },
        // { duration: '1m', target: 120 },
        { duration: '1m', target: 500 },
        // { duration: '1m', target: 200 },
        { duration: '1m', target: 0 },
      ],
    },
  },
};

// eslint-disable-next-line func-names
export default function () {
  const BASE_URL = 'http://127.0.0.1:4000';
  const response = http.get(`${BASE_URL}/qa/questions/1000000/`);
  check(response, { 'status 200': (res) => res.status === 200 });
  // const responses = http.batch([
  //   ['GET', `${BASE_URL}/qa/questions/1/`, null, { tags: { name: 'Questions' } }],
  //   ['GET', `${BASE_URL}/qa/questions/2/`, null, { tags: { name: 'Questions' } }],
  //   ['GET', `${BASE_URL}/qa/questions/3/`, null, { tags: { name: 'Questions' } }],
  //   ['GET', `${BASE_URL}/qa/questions/4/`, null, { tags: { name: 'Questions' } }],
  //   ['GET', `${BASE_URL}/qa/questions/5/`, null, { tags: { name: 'Questions' } }],
  //   ['GET', `${BASE_URL}/qa/questions/6/`, null, { tags: { name: 'Questions' } }],
  //   ['GET', `${BASE_URL}/qa/questions/7/`, null, { tags: { name: 'Questions' } }],
  //   ['GET', `${BASE_URL}/qa/questions/8/`, null, { tags: { name: 'Questions' } }],
  //   ['GET', `${BASE_URL}/qa/questions/9/`, null, { tags: { name: 'Questions' } }],
  //   ['GET', `${BASE_URL}/qa/questions/10/`, null, { tags: { name: 'Questions' } }],
  //   ['GET', `${BASE_URL}/qa/questions/11/`, null, { tags: { name: 'Questions' } }],
  //   ['GET', `${BASE_URL}/qa/questions/12/`, null, { tags: { name: 'Questions' } }],
  //   ['GET', `${BASE_URL}/qa/questions/13/`, null, { tags: { name: 'Questions' } }],
  //   ['GET', `${BASE_URL}/qa/questions/14/`, null, { tags: { name: 'Questions' } }],
  // ]);

  sleep(1);
}
