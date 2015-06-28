import _ from 'lodash';
import { readFileSync } from 'fs';

let data = readFileSync(__dirname + '/../data/recipes.json').toString();
let recipes = JSON.parse(data);

export function get(name) {
  return _.detect(recipes, (recipe) => {
    return recipe.name === name;
  });
}
