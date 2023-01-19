import {LitElement, html, css} from 'lit';

 export class CommentCard extends LitElement {
   static get styles() {
     return css`
      .comment-result {
        border: 1px solid #ccc;
        padding: 1rem 2rem;
        margin-bottom: 0.5rem;
        animation: slidein;
        animation-duration: 1s;
        border-radius: 10px;
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

      .comment-body {
        max-height: 3.5rem;
        overflow: hidden;
      }

      .meta {
        display: flex;
      }

      .meta p {
        margin-right: 20px;
      }

      @import url('https://fonts.googleapis.com/css2?family=Ubuntu&display=swap');

      p, h1, h2, h3, h4, span {
        font-family: 'Ubuntu', sans-serif;
      }
     `;
   }
 
   static get properties() {
     return {
       item: {type: Object},
       index: {type: Number},
     };
   }
 
   render() {
     return html`
     <li class="comment-result" style="animation-delay: 0.${this.index}s" .key="${this.index}">
        <h2 class="comment-body">"${this.item.data?.body}"</h2>
        <p><a .href=${this.item.data?.link_permalink}>${this.item.data?.title || this.item.data?.link_title}</a></p>
        <section class="meta">
          <p class="subreddit-name">${this.item.data?.subreddit_name_prefixed}</p>
          <p class="posted-date">${new Date(this.item.data?.created_utc).toLocaleString()}</p>
        </section>
    </li>`;
   }
 }
 
 window.customElements.define('comment-card', CommentCard);
 