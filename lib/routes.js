import { Router } from 'express';

import * as sessions from './sessions';

export default function() {
  let routes = Router();
  routes.use('/sessions', sessionsRoutes());
  return routes;
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
