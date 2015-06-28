import * as sessions from './sessions';
import { get } from './recipes';

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

export function nextStep(req, res) {
  let recipe = req.session.recipe;
  if (!recipe) {
    return res.json({
      message: `You aren't currently going through a recipe.`
    });
  }
  let stepIndex = req.session.stepIndex;
  if (typeof stepIndex === 'undefined') {
    stepIndex = 0;
  } else {
    stepIndex++;
  }
  if (stepIndex >= recipe.steps.length) {
    return res.json({
      message: `You've completed your dish.`,
      complete: true
    });
  }
  let step = recipe.steps[stepIndex];
  req.session.stepIndex = stepIndex;
  res.json({
    message: step.message
  });
}
