import * as sessions from './sessions';
import { performAction } from './action_performer';
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

export function _message(req, res, next) {
  let messages = session.messages;
  if (!messages) {
    session.messages = messages = [];
  }
  res.message = function(message, opts = {}) {
    messages.push(message);
    res.json(Object.assign({
      message
    }), opts);
  };
}

export function _getRecipe(req, res, next) {
  let recipe = req.session.recipe;
  if (!recipe) {
    return res.json({
      message: `You aren't currently going through a recipe.`
    });
  }
  req.recipe = recipe;
  next();
}

export function getRecipe(req, res) {
  let recipe = get(req.body.recipe || 'Hard-Boiled Eggs');
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

export function repeat(req, res) {
  let messages = session.messages;
  if (messages.length > 0) {
    res.message(messages[messages.length - 1]);
  } else {
    res.message('Nothing to repeat.');
  }
}

export function getIngredients(req, res) {
  let recipe = req.recipe;
  let ingredients = recipe.ingredients.join(', ');
  return res.message(`The ingredients for the recipe are: ${ingredients}`);
}

export function nextStep(req, res) {
  let recipe = req.recipe;
  let lastStepIndex = req.session.lastStepIndex;
  if (typeof lastStepIndex === 'undefined') {
    lastStepIndex = 0;
  } else {
    lastStepIndex++;
  }
  if (lastStepIndex >= recipe.steps.length) {
    return res.message(`You've completed your dish.`, {
      complete: true
    });
  }
  let step = req.session.lastStep = recipe.steps[lastStepIndex];
  req.session.lastStepIndex = lastStepIndex;
  res.message(step.message);
}

export async function runAction(req, res) {
  let lastStep = req.session.lastStep;
  if (!lastStep) {
    return res.message(`There's nothing that needs to be done.`);
  }
  let action = lastStep.action;
  let result = await performAction(action);
  res.json({
  });
}
