let handlers = {
  oven_heat: async function(params) {
    return `Heating the oven to high.`;
  }
};

export async function performAction(action) {
  let type = action.type;
  let handler = handlers[type];
  if (!handler) {
    return `There's nothing that needs to be done.`;
  }
  return await handler(action);
}
