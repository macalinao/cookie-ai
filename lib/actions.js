import * as bigoven from './bigoven';
import * as sessions from './sessions';
import { performAction } from './action_performer';
import * as recipes from './recipes';

export function _getSession(req, res, next) {
  if (!req.body.sid) {
    return res.json({
      error: 'No session id specified in `sid`.'
    });
  }
  let session = sessions.get(req.body.sid);
  if (!session) {
    session = sessions.createWithSid(req.body.sid);
  }
  console.log(`Session ID: ${req.body.sid}`);
  req.session = session;
  req.resetSession = function() {
    sessions.reset(req.body.sid);
    req.session = sessions.get(req.body.sid);
  };
  next();
}

export function _message(req, res, next) {
  let messages = req.session.messages;
  if (!messages) {
    req.session.messages = messages = [];
  }
  res.message = function(message, opts = {}) {
    messages.push(message);
    res.json(Object.assign({
      message
    }, opts));
  };
  next();
}

export function _getRecipe(req, res, next) {
  let recipe = req.session.recipe;
  if (!recipe) {
    return res.message(`You aren't currently going through a recipe.`);
  }
  req.recipe = recipe;
  next();
}

export async function getRecipe(req, res) {
  let recipe = await recipes.get(req.body.recipe);
  console.log('Recipe found.');
  console.log(recipe);
  if (!recipe) {
    return res.message(`I couldn't find a recipe matching ${req.body.recipe}.`);
  }
  req.resetSession();
  req.session.recipe = recipe;
  res.message(`I found a recipe for ${recipe.name}. Say 'next' to start the recipe, or ask, 'What are the ingredients?' to figure out what you need.`);
}

export function repeat(req, res) {
  let messages = req.session.messages;
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
    req.resetSession();
    return res.message(`You've completed your dish.`, {
      complete: true
    });
  }
  let step = req.session.lastStep = recipe.steps[lastStepIndex];
  req.session.lastStepIndex = lastStepIndex;
  res.message(step.message, step.action ? {
    action: true
  } : {});
}

export async function runAction(req, res) {
  let lastStep = req.session.lastStep;
  if (!lastStep) {
    return res.message(`There's nothing that needs to be done.`);
  }
  let action = lastStep.action;
  if (action) {
    let result = await performAction(action);
    return res.message(result);
  } else {
    return res.message(`There's nothing that needs to be done.`);
  }
}

export async function suggest(req, res) {
  let type = req.body.type || '';
  let results = await recipes.suggest(type);
  let randy = results[Math.floor(Math.random * results.length)];
  let recipe = await bigoven.getRecipe(randy.RecipeID);
  req.session.suggestedRecipe = recipe;
  res.message(`I found a recipe for ${recipe.name}. Would you like to cook it?`);
}

export async function suggestAccept(req, res) {
  if (!req.session.suggestedRecipe) {
    return res.message(`Violated suggested recipe invariant.`);
  }
  req.session.recipe = req.session.suggestedRecipe;
  res.message(`Let's cook ${req.session.recipe.name} together!`);
}
