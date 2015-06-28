import _ from 'lodash';
import { readFileSync } from 'fs';
import * as bigoven from './bigoven';

let data = readFileSync(__dirname + '/../data/recipes.json').toString();
let recipes = JSON.parse(data);

export async function get(name) {
  let local = _.detect(recipes, (recipe) => {
    return recipe.name === name;
  });
  if (local) {
    return local;
  }
  return await bigoven.getFirstRecipe(name);
}
