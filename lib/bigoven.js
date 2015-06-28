import request from 'superagent-bluebird-promise';

const API_BASE = 'http://api.bigoven.com';
const API_KEY = process.env.BIGOVEN_API_KEY;

export async function getRecipes(keywords) {
  return get('/recipes', {
    title_kw: keywords
  });
}

export async function getRecipe(id) {
  return get(`/recipe/${id}`);
}

async function get(path, query) {
  let req = request.get(`${API_BASE}${path}`);
  req.query({
    api_key: API_KEY
  });
  if (query) {
    req.query(query);
  }
  return req.promise();
}
