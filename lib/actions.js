import * as sessions from '../sessions';
import { get } from '../recipes';

export function _getSession(req, res, next) {
  if (!req.body.sid) {
    return res.json({
      error: 'No session id specified in `sid`.'
    });
  }
  let session = sessions.get(req.body.sid);
  if (!session) {
    return res.json({
      error: 'Session does not exist.'
    });
  }
  req.session = session;
  next();
}

export function getRecipe(req, res) {
  let recipe = get(req.body.recipe);
  if (!recipe) {
    return res.json({
      message: `I couldn't find a recipe matching ${req.body.recipe}.`
    });
  }
  req.session.recipe = recipe;
  res.json({
    message: `I found a recipe for ${recipe.name}.`
  });
}
