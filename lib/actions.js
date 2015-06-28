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

export function nextStep(req, res) {
  let recipe = req.session.recipe;
  if (!recipe) {
    return res.json({
      message: `You aren't currently going through a recipe.`
    });
  }

  let lastStepIndex = req.session.lastStepIndex;
  if (typeof lastStepIndex === 'undefined') {
    lastStepIndex = 0;
  } else {
    lastStepIndex++;
  }
  if (lastStepIndex >= recipe.steps.length) {
    return res.json({
      message: `You've completed your dish.`,
      complete: true
    });
  }
  let step = req.session.lastStep = recipe.steps[lastStepIndex];
  req.session.lastStepIndex = lastStepIndex;

  res.json({
    message: step.message
  });
}

export async function runAction(req, res) {
  let lastStep = req.session.lastStep;
  if (!lastStep) {
    return res.json({
      message: `There's nothing that needs to be done.`
    });
  }
  let action = lastStep.action;
  let result = await performAction(action);
  res.json({
  });
}
