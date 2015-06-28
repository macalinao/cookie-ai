import { Router } from 'express';

import * as actions from './actions';
import * as sessions from './sessions';

export default function() {
  let routes = Router();
  routes.use('/actions', actionsRoutes());
  routes.use('/sessions', sessionsRoutes());
  return routes;
}

export function actionsRoutes() {
  let actionsRouter = Router();
  actionsRouter.use(actions._getSession);
  actionsRouter.use(actions._message);
  actionsRouter.post('/get_recipe', actions.getRecipe);
  actionsRouter.post('/repeat', actions.repeat);
  actionsRouter.post('/suggest', actions.suggest);
  actionsRouter.post('/suggest_accept', actions.suggestAccept);

  let recipeActionsRouter = Router();
  recipeActionsRouter.use(actions._getRecipe);
  recipeActionsRouter.post('/get_ingredients', actions.getIngredients);
  recipeActionsRouter.post('/next_step', actions.nextStep);
  recipeActionsRouter.post('/run_action', actions.runAction);
  recipeActionsRouter.post('/current_recipe', actions.currentRecipe);
  actionsRouter.use(recipeActionsRouter);
  return actionsRouter;
}

export function sessionsRoutes() {
  let sessionsRouter = Router();

  // Create session
  sessionsRouter.post('/', (req, res) => {
    res.json({
      sid: sessions.create()
    });
  });

  return sessionsRouter;
}
