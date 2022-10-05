import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import { MODAL_CLOSE_SECONDS } from './config.js';
import RecipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import ResultsView from './views/resultsView.js';
import PaginationView from './views/paginationView.js';
import BookmarksView from './views/bookmarksView.js';
import AddRecipeView from './views/addRecipeView.js';

if (module.hot) {
  module.hot.accept();
}


//Feature Recipe Details

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return; // guard clause
    RecipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    ResultsView.update(model.getSearchResultsPage());

    // 3) Updating BookmarksView
    BookmarksView.update(model.state.bookmarks);

    // 1) Loading Recipe
    await model.loadRecipe(id);

    // 2) Rendering Recipe
    RecipeView.render(model.state.recipe);


  } catch (errMsg) {
    RecipeView.renderError();
    console.error(errMsg);
  }
};

//Feature Search Results

const controlSearchResults = async () => {
  try {

    ResultsView.renderSpinner();

    // 1) Get searchQuery
    const query = SearchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);


    // 3) Render results w/ 1st page as the start
    // resultsView.render(model.state.search.results);
    ResultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    PaginationView.render(model.state.search);

  } catch (errMsg) {
    console.log(errMsg);
  }
};


//Feature Pagination

const controlPagination = function(goToPage) {
  // 1) Render NEW Results
  ResultsView.render(model.getSearchResultsPage(goToPage));
  // 2) Render NEW Pagination Buttons
  PaginationView.render(model.state.search);
};

//Feature Updating Recipe Servings

const controlServings = function(newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);

  //update the recipe view
  RecipeView.update(model.state.recipe);
};


//Feature Add Bookmark

const controlAddDeleteBookmark = function() {
  // 1) Add/Remove Bookmark
  if (!model.state.recipe.bookmarked)
    model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update Recipe View
  RecipeView.update(model.state.recipe);

  // 3) Render Bookmarks
  BookmarksView.render(model.state.bookmarks);
};


//Feature Load Bookmarks from localStorage
const controlBookmarkLoad = () => {
  BookmarksView.render(model.state.bookmarks);
};

//Feature Just in case we want to clear bookmarks in the future

const clearBookmarks = () => {
  localStorage.clear(`bookmarks`);
};

//Feature Add Recipe (Upload Form Data)

const controlAddRecipe = async (newRecipe) => {

  try {
    //Render Loading Spinner
    AddRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render Recipe
    RecipeView.render(model.state.recipe);

    //Display Success Message
    AddRecipeView.renderSuccessMsg();

    //Render updated bookmarksView
    BookmarksView.render(model.state.bookmarks); // don't use BookmarksView.update here because we are inserting a new element, and for that we always want to use render.

    // Change ID in URL note: uses history API
    window.history.pushState(null, '', `#${model.state.recipe.id}`) // data = state(?), but not used
    // window.history.back(); -> automatically goes back to the last page

    //Close Form Window
    setTimeout(function() {
      AddRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);


  } catch (errMsg) {
    //Upload new recipe data
    console.error(`🛑`, errMsg);
    AddRecipeView.renderError(errMsg.message);
  }
  //Reload the page after upload
  location.reload();
};


//Feature Start Program

const init = function() {
  BookmarksView.addHandlerRender(controlBookmarkLoad);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerAddBookmark(controlAddDeleteBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination); //note within the eventListener, I pass in a function that goes to a certain page, basically.
  AddRecipeView.addHandlerUpload(controlAddRecipe);

};

init();

// clearBookmarks();