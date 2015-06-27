let sessions = {};

export function get(sid) {
  return sessions[sid];
}

export function create() {
  let sid = Math.floor(Math.random() * 100000000).toString();
  sessions[sid] = {};
  return sid;
}
