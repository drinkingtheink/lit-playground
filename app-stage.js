import {LitElement, html, css} from 'lit';
import {ref, createRef} from 'lit/directives/ref.js';
import {CommentCard} from './dev/components/comment-card.js';

const storageKey = 'recent-searches';

export class AppStage extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        border: solid 1px gray;
        padding: 1rem 2rem;
        max-width: 1000px;
        margin: 20px auto 0 auto;
        background-color: white;
        border-radius: 10px;
      }

      .results-stage {
        display: flex;
        flex-wrap: wrap;
        min-height: 200px;
      }

      .results-stage .left, .results-stage .right {
        width: 48%;
        padding: 0 0.5rem;
      }

      .results {
        padding: 0; list-style: none;
      }

      .result {
        border: 1px solid black;
        padding: 0.5rem 1rem;
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

      button {
        background-color: #FF4500;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 10px;
      }

      input {
        padding: 0.5rem 1rem;
        min-width: 300px;
        font-size: 1.25rem;
      }

      .previous-search {
        padding: 0.5rem 1rem;
        background-color: #eaeaea;
        border-radius: 10px;
        margin-right: 10px;
      }

      @import url('https://fonts.googleapis.com/css2?family=Ubuntu&display=swap');

      p, h1, h2, h3, h4 {
        font-family: 'Ubuntu', sans-serif;
      }
    `;
  }

  _fetchData() {
    fetch(`https://www.reddit.com/user/`+ this.searchTerm + `.json`)
      .then(response => response.json())
      .then(response => response['data'].children || [])
      .then(response => {
          console.log('Success:', response);
          this._recentSearches.unshift(this.searchTerm);
          this._dedupeRecentSearches();
          this._saveRecentSearchesToSessionStorage();
          this._searchResults = response;
          this._commentsOnPosts = response.filter((result) => result.kind == 't1');
          this._postsCreated = response.filter((result) => result.kind == 't3');
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  }

  _saveRecentSearchesToSessionStorage() {
    sessionStorage.removeItem(storageKey);
    sessionStorage.setItem(storageKey, this._recentSearches);
  }

  _dedupeRecentSearches() {
    const uniqueSearches = [...new Set(this._recentSearches)];
    this._recentSearches = uniqueSearches;
  }

  static get properties() {
    return {
      _searchResults: {type: Array},
      _commentsOnPosts: {type: Array},
      _postsCreated: {type: Array},
      _recentSearches: {type: Array},
    };
  }

  constructor() {
    super();
    this.searchTerm = '';
    this._searchResults = [];
    this._commentsOnPosts = [];
    this._postsCreated = [];
    this._recentSearches = [];
  }

  inputRef = createRef();

  firstUpdated() {
    let recentSearchesFromStorage = sessionStorage.getItem(storageKey);

    if (recentSearchesFromStorage !== null) {
      const formattedResults = recentSearchesFromStorage.split(',')
      const uniqueResults = [...new Set(formattedResults)];
      this._recentSearches = uniqueResults;
    }

    const input = this.inputRef.value;
    input.focus();
  }

  render() {
    return html`
      <h2>Reddit User Activity Quick Glance:</h2>
      <input id="search" ${ref(this.inputRef)} @input=${this.changeSearchTerm} placeholder="Enter a username to search for">
      <button @click=${this._fetchData} part="button">
        VROOM
      </button>

      <section class="recent-searches">
        <h3>Recent Searches:</h3>
        ${this._recentSearches.map(
          (item) => html`
            <span class="previous-search">
              ${item}
            </span>  
          `
        )}
      </section>

      <section class="results-stage">
          <div class="left">
            <h2>Comments on Posts (${this._commentsOnPosts.length || 'N/A'}):</h2>
            <ul class="comments-on-posts results">
              ${this._commentsOnPosts.map(
                (item, index) => html`
                  <comment-card .index="${index}" .item="${item}"></comment-card>
                  `
              )}
            </ul>
          </div>

          <div class="right">
            <h2>Posts Created (${this._postsCreated.length || 'N/A'}):</h2>
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
          </div>
      </section>
    `;
  }

  changeSearchTerm(event) {
    const input = event.target;
    this.searchTerm = input.value;
  }
}

window.customElements.define('app-stage', AppStage);
