let handlers = {
  oven_heat: function(params) {
  }
};

export async function performAction(action) {
  let type = action.type;
  let handler = handlers[type];
  if (!handler) {
    return;
  }
  return handler(action);
}
