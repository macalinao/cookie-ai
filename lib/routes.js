import { Router } from 'express';

import * as actions from './actions';
import * as sessions from './sessions';

export default function() {
  let routes = Router();
  routes.use('/sessions', sessionsRoutes());
  return routes;
}

export function actionsRoutes() {
  let actionsRouter = Router();
  actionsRouter.use((req, res, next) => {
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
  });
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
