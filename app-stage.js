import {LitElement, html, css} from 'lit';

export class AppStage extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        border: solid 1px gray;
        padding: 16px;
        max-width: 800px;
      }
    `;
  }

  _fetchData() {
    fetch(`https://www.reddit.com/search.json?q=`+ this.searchTerm)
      .then(response => response.json())
      .then(response => response["data"].children || [])
      .then(response => {
          console.log('Success:', response);
          this._searchResults = response;
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  }

  static get properties() {
    return {
      /**
       * @type {object}
       */
      _searchResults: {type: Array},
    };
  }

  constructor() {
    super();
    this.searchTerm = '';
    this._searchResults = [];
  }

  render() {
    return html`
      <h2>Let's Make a Call!</h2>
      <input @input=${this.changeSearchTerm} placeholder="Enter your search term">
      <button @click=${this._fetchData} part="button">
        VROOM
      </button>

      <section class="results-stage">
      ${this._searchResults.map(
        (item) => html`
          <li>
            <p>${item.data?.title}</p>
            <p>${item.data?.permalink}</p>
          </li>`
      )}
      </section>
    `;
  }

  changeSearchTerm(event) {
    const input = event.target;
    this.searchTerm = input.value;
  }
}

window.customElements.define('app-stage', AppStage);
