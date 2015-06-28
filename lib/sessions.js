let sessions = {};

export function get(sid) {
  return sessions[sid];
}

export function create() {
  let sai = Math.floor(Math.random() * 100000000).toString();
  return createWithSid(sai);
}

export function createWithSid(sai) {
  sessions[sai] = {};
  return sessions[sai];
}

export function reset(sid) {
  let session = get(sid);
  sessions[sid] = {};
}
