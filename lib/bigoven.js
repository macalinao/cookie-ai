import request from 'superagent-bluebird-promise';

const API_BASE = 'http://api.bigoven.com';
const API_KEY = process.env.BIGOVEN_API_KEY;

async function get(path, query) {
  let req = request.get(`${API_BASE}`);
}
