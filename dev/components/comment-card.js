import {LitElement, html, css} from 'lit';

 export class CommentCard extends LitElement {
   static get styles() {
     return css`
      .result {
        border: 1px solid black;
        padding: 1rem 2rem;
        margin-bottom: 0.5rem;
        animation: slidein;
        animation-duration: 1s;
      }

      @keyframes slidein {
        from {
          margin-bottom: 3rem;
          opacity: 0;
        }

        to {
          margin-bottom: 0.5rem;
          opacity: 1;
        }
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
     <li class="result" style="animation-delay: 0.${this.index}s" .key="${this.index}">
        <h3><a .href=${this.item.data?.link_permalink}>${this.item.data?.title || this.item.data?.link_title}</a></h3>
        <p class="comment-body">${this.item.data?.body}</p>
        <p>${this.item.data?.subreddit_name_prefixed}</p>
    </li>`;
   }
 }
 
 window.customElements.define('comment-card', CommentCard);
 