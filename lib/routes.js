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
  actionsRouter.use('/get_recipe', actions.getRecipe);
  actionsRouter.use('/next_step', actions.nextStep);
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
