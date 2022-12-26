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

      .results {
        list-style: none;
        padding: none;
        margin: none;
      }

      .result {
        border: 1px solid black;
        padding: 1rem 2rem;
        margin-bottom: 1rem;
      }
    `;
  }

  _fetchData() {
    fetch(`https://www.reddit.com/user/`+ this.searchTerm + `.json`)
      .then(response => response.json())
      .then(response => response['data'].children || [])
      .then(response => {
          console.log('Success:', response);
          this._searchResults = response;
          this._commentsOnPosts = response.filter((result) => result.kind == 't1');
          this._postsCreated = response.filter((result) => result.kind == 't3');
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  }

  static get properties() {
    return {
      _searchResults: {type: Array},
      _commentsOnPosts: {type: Array},
      _postsCreated: {type: Array},
    };
  }

  constructor() {
    super();
    this.searchTerm = '';
    this._searchResults = [];
    this._commentsOnPosts = [];
    this._postsCreated = [];
  }

  render() {
    return html`
      <h2>Investigate a User:</h2>
      <input @input=${this.changeSearchTerm} placeholder="Enter a username to search for">
      <button @click=${this._fetchData} part="button">
        VROOM
      </button>

      <section class="results-stage">
        <h2>Posts Created (${this._postsCreated.length}):</h2>
        <ul class="posts-created results">
          ${this._postsCreated.map(
            (item) => html`
              <li class="result">
                <h3><a .href=${item.data?.link_permalink}>${item.data?.title || item.data?.link_title}</a></h3>
                <p>${item.data?.subreddit_name_prefixed}</p>
              </li>`
          )}
        </ul>

        <h2>Comments on Posts (${this._commentsOnPosts.length}):</h2>
        <ul class="comments-on-posts results">
          ${this._commentsOnPosts.map(
            (item) => html`
              <li class="result">
                <h3><a .href=${item.data?.link_permalink}>${item.data?.title || item.data?.link_title}</a></h3>
                <p class="comment-body">${item.data?.body}</p>
                <p>${item.data?.subreddit_name_prefixed}</p>
              </li>`
          )}
        </ul>
      </section>
    `;
  }

  changeSearchTerm(event) {
    const input = event.target;
    this.searchTerm = input.value;
  }
}

window.customElements.define('app-stage', AppStage);
