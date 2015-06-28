import request from 'superagent-bluebird-promise';

const API_BASE = 'http://api.bigoven.com';
const API_KEY = process.env.BIGOVEN_API_KEY;

export async function getRecipes(keywords) {
  let query = {
    pg: 1,
    rpp: 25
  };
  if (keywords) {
    query.title_kw = keywords;
  }
  return get('/recipes', query).then((res) => {
    return res.body;
  });
}

export async function getRecipe(id) {
  return get(`/recipe/${id}`).then((res) => {
    return res.body;
  }).then((recipe) => {
    let result = normalizeRecipe(recipe);
    return result;
  });
}

function normalizeRecipe(recipe) {
  return {
    name: recipe.Title.trim(),
    ingredients: recipe.Ingredients.map((ing) => ing.Name.trim()),
    steps: recipe.Instructions.split('.').map((step) => {
      return step.trim() + '.'
    }).filter((step) => {
      return step !== '.';
    }).map((step) => {
      return {
        message: step
      };
    })
  };
}

export async function getFirstRecipe(keywords) {
  return getRecipes(keywords).then((res) => {
    return res.Results[0];
  }).then((res) => {
    return getRecipe(res.RecipeID);
  });
}

async function get(path, query) {
  let req = request.get(`${API_BASE}${path}`);
  req.query({
    api_key: API_KEY
  });
  if (query) {
    req.query(query);
  }
  req.set('Accept', 'application/json');
  return req.promise();
}
