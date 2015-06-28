let handlers = {
  oven_heat: async function(params) {
    let { amount } = params;
    return `Heating the oven to ${amount}.`;
  },
  timer: async function(params) {
    let { duration } = params;
    return `Running a timer for ${duration}.`;
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
