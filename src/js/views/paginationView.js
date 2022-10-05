import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector(`.pagination`);

  addHandlerClick(handler) {
    this._parentElement.addEventListener(`click`, function(e) {
      const btn = e.target.closest(`.btn--inline`);

      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage); //note passing goToPage into the handler which is calling the controlPagination(goToPage) function. The handler's page # is acquired by this click event using dataset attribute in the HTML.
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
      ${this._generateMarkupBtn(`next`, curPage)}
      `;
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return `
      ${this._generateMarkupBtn(`prev`, curPage)}
      `;
    }

    // Other page
    if (curPage < numPages) {
      return `
      ${this._generateMarkupBtn(`prev`, curPage)},
      ${this._generateMarkupBtn(`next`, curPage)}
      `;
    }

    //Page 1, and no other pages
    return ``;
  }

  _generateMarkupBtn(btn, currentPage) {
    return `
      <button data-goto='${btn === 'next' ? currentPage + 1 : currentPage - 1}' class='btn--inline pagination__btn--${btn}'>
        <svg class='search__icon'>
          <use href='${icons}#icon-arrow-${btn === 'next' ? 'right' : 'left'}'></use>
        </svg>
        <span>Page ${btn === 'next' ? currentPage + 1 : currentPage - 1}</span>
      </button>  
    `;
  }
}

export default new PaginationView();