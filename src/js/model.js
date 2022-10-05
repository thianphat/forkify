import { async } from 'regenerator-runtime/runtime';
import { API_URL } from './config.js';
import { AJAX } from './helpers.js';
// import { getJSON, sendJSON } from './helpers.js';
import { RESULTS_PER_PAGE, APIKEY } from './config.js';

// Manages State
export const state = {
  recipe: {},
  search: {
    query: ``,
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE
  },
  bookmarks: []
};

const createRecipeObject = (data) => {
  //getting rid of underscores in the object's keys
  const { recipe } = data.data; //used destructuring here
  return { // manipulates the variable outside this function. not a pure function.
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }) //uses short-circuiting (&& operator) if recipe.key exists, the spread operator acts on the property by spreading it into something like this: ' key: recipe.key ' as it normally should look. a good trick to conditionally add properties to an object, because recipes that we did NOT upload do NOT have the API key attached.
  };
};


//Fetches Forkify data from API
export const loadRecipe = async function(id) {

  try {
    const data = await AJAX(`${API_URL}${id}&key=${APIKEY}`);

    state.recipe = createRecipeObject(data);

    state.recipe.bookmarked = state.bookmarks.some(bookmark => bookmark.id === id); //think of .some as "if-any" array method if any bookmark in the API has the same ID as the ID of a saved bookmark, we mark it as "true". returns true or false.

    console.log(state.recipe);
  } catch (errMsg) {
    //temp error handling
    console.error(`${errMsg} 💥💥💥💥`);
    throw errMsg;
  }
};


//Implementing Search
export const loadSearchResults = async function(query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${APIKEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key })
      };
    });
    // state.search.page = 1; // another way to set the default search page to 1;

  } catch (errMsg) {
    console.error(`${errMsg} 💥💥💥💥`);
    throw errMsg;
  }
};

// Implementing Pagination
export const getSearchResultsPage = function(page = 1) {
  state.search.page = page;

  const start = ((page - 1) * state.search.resultsPerPage); // 0;
  const end = page * state.search.resultsPerPage; // 9;

  return state.search.results.slice(start, end);
};

// Updating Servings

export const updateServings = function(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * newServings / state.recipe.servings;
    //newQt = oldQt * newServings / oldServings // 2*8/4 = 4
  });

  state.recipe.servings = newServings;
};


// Store Bookmarks in localStorage
const persistBookmarks = () => {
  try {
    localStorage.setItem(`bookmarks`, JSON.stringify(state.bookmarks));
  } catch (errMsg) {
    console.error(errMsg); // sometimes user disable localStorage under browser settings, so the localStorage object would be null, so it's good practice to wrap localStorage usage in a try/catch block.
  }

};

// Adding Bookmarks

export const addBookmark = (recipe) => {
  //Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  recipe.bookmarked = true;

  //Local Storage
  persistBookmarks();
};

// Removing Bookmarks
export const deleteBookmark = (id) => { // a common pattern in programming, when we add something we want all the date, when we delete we just want the id
                                        // console.log(id);
                                        // console.log(state.recipe.bookmarked);
                                        // console.log(state.bookmarks);
                                        // console.log(state.recipe.id);
                                        // console.log(state.recipe);
                                        //delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id); // looks for the element with the ID of the ID that was passed in
  state.bookmarks.splice(index, 1);

  //Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  //Local Storage
  persistBookmarks();
};

// Pull Bookmarks from localStorage

(function() {
  const storage = localStorage.getItem((`bookmarks`));
  if (storage)
    state.bookmarks = JSON.parse(storage);
})();

console.log(state.bookmarks);

// Uploading Recipes
// note need to format data to look how data from the API looks, thus converting it to an object
export const uploadRecipe = async function(newRecipe) {
  console.log(Object.entries(newRecipe));
  try {

    const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith(`ingredient`) && entry[1] !== ``)
      .map(ing => { //using map() as it converts data into a new array.
        const ingArr = ing[1].split(`,`).map(el => el.trim());

        if (ingArr.length !== 3) throw new Error(`Wrong ingredient format! Please use the correct format.`); // if met, function will immediately exit

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    //Convert the data uploaded into data that the API understands
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients
    };

    console.log(ingredients);
    console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${APIKEY}`, recipe);// this will actually send the recipe back to us as we're pulling the JSON as well
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    // console.log(data);

  } catch (err) {
    console.log(err.message);
    throw (err);
  }
};