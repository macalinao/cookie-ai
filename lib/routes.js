import { Router } from 'express';

import * as sessions from './sessions';

export default function() {
  let routes = Router();
  routes.use('/sessions', sessions());
}

export function session() {
  let actions = Router();

  // Create session
  actions.post('/', (req, res) => {
    res.json({
      sid: sessions.create()
    });
  });
}
