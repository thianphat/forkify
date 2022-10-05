import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector(`.upload`);
  _message = `Recipe was successfully uploaded and added to your bookmarks!`

  _window = document.querySelector(`.add-recipe-window`);
  _overlay = document.querySelector(`.overlay`);
  _btnOpen = document.querySelector(`.nav__btn--add-recipe`);
  _btnClose = document.querySelector(`.btn--close-modal`);

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle(`hidden`);
    this._window.classList.toggle(`hidden`);
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener(`click`, this.toggleWindow.bind(this)) //binding "this" attaches it to the current object; required to bind because this will attach to the event handler (btnOpen) otherwise.
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener(`click`, this.toggleWindow.bind(this))
    this._overlay.addEventListener(`click`, this.toggleWindow.bind(this))
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener(`submit`, function(e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr)
      handler(data);
    })
  }

  _generateMarkup() {
  }

}

export default new AddRecipeView();