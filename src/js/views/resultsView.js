'use strict';

import View from './View.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector(`.results`);
  _errorMessage = `No recipes found. Try a different search!`;
  _message = ``;

  _generateMarkup() {
    console.log(this._data);
    return this._data.map(this._generateMarkupPreview).join(``);

    //same as writing this:
    // return this._data.map(result => {
    //   return `
    //         <li class='preview'>
    //     <a class='preview__link' href='#${result.id}'>
    //       <figure class='preview__fig'>
    //         <img src='${result.image}' alt='${result.title}' />
    //       </figure>
    //       <div class='preview__data'>
    //         <h4 class='preview__title'>${result.title}</h4>
    //         <p class='preview__publisher'>${result.publisher}</p>
    //       </div>
    //     </a>
    //   </li>
    //   `;
    // }).join(``);
  }

  _generateMarkupPreview(result) {
    const id = window.location.hash.slice(1);
    console.log(id);

    return `
      <li class='preview'>
        <a class='preview__link ${result.id === id ? 'preview__link--active' : ''}' href='#${result.id}'>
          <figure class='preview__fig'>
            <img src='${result.image}' alt='${result.title}' />
          </figure>
          <div class='preview__data'>
            <h4 class='preview__title'>${result.title}</h4>
            <p class='preview__publisher'>${result.publisher}</p>
            <div class='preview__user-generated ${result.key ? '' : 'hidden'}'>
              <svg>
                <use href='${icons}#icon-user'></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
    `;
  }

}

export default new ResultsView();