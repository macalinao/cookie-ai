import { Router } from 'express';

import * as actions from './actions';
import * as sessions from './sessions';

export default function() {
  let routes = Router();
  routes.use('/actions', actionsRoutes());
  routes.use('/dashboard', dashboardRoutes());
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
  actionsRouter.post('/set_heat', actions.setHeat);

  let recipeActionsRouter = Router();
  recipeActionsRouter.use(actions._getRecipe);
  recipeActionsRouter.post('/get_ingredients', actions.getIngredients);
  recipeActionsRouter.post('/next_step', actions.nextStep);
  recipeActionsRouter.post('/run_action', actions.runAction);
  recipeActionsRouter.post('/current_recipe', actions.currentRecipe);
  recipeActionsRouter.post('/goto_step', actions.gotoStep);
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

export function dashboardRoutes() {
  let dashboardRouter = Router();
  dashboardRouter.get('/', (req, res) => {
    let session = sessions.getFirst();
    if (!session) {
      return res.json({
        data: null
      });
    }
    res.json(session);
  });
  return dashboardRouter;
}
