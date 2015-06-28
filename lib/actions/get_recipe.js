import { get } from '../recipes';

export default function(req, res) {
  let recipe = get(req.body.recipe);
  if (!recipe) {
    return res.json({
      message: `I couldn't find a recipe matching ${req.body.recipe}.`
    });
  }
  req.session.recipe = recipe;
  res.json({
    message: `I found a recipe for ${recipe.name}.`
  });
}
