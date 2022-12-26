import {LitElement, html, css} from 'lit';
import {CommentCard} from './dev/components/comment-card.js';

export class AppStage extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        border: solid 1px gray;
        padding: 16px;
        max-width: 800px;
        margin: 0 auto;
      }

      .results {
        padding: 0; list-style: none;
      }

      .result {
        border: 1px solid black;
        padding: 1rem 2rem;
        margin-bottom: 0.5rem;
        animation: slidein;
        animation-duration: 1s;
        border-radius: 20px;
      }

      @keyframes slidein {
        from {
          margin-top: 3rem;
          opacity: 0;
        }

        to {
          margin-top: 0;
          opacity: 1;
        }
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
      <h2>Investigate a Reddit User:</h2>
      <input @input=${this.changeSearchTerm} placeholder="Enter a username to search for">
      <button @click=${this._fetchData} part="button">
        VROOM
      </button>

      <section class="results-stage">
        <h2>Comments on Posts (${this._commentsOnPosts.length}):</h2>
        <ul class="comments-on-posts results">
          ${this._commentsOnPosts.map(
            (item, index) => html`
              <comment-card .index="${index}" .item="${item}"></comment-card>
              `
          )}
        </ul>

        <h2>Posts Created (${this._postsCreated.length}):</h2>
        <ul class="posts-created results">
          ${this._postsCreated.map(
            (item) => html`
              <li class="result">
                <h3><a .href=${item.data?.link_permalink}>${item.data?.title || item.data?.link_title}</a></h3>
                <p>${item.data?.subreddit_name_prefixed}</p>
                <p class="posted-date">${new Date(item.data?.created_utc).toLocaleString()}</p>
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
