import * as sessions from './sessions';

export default function(req, res, next) {
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
