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

  static get properties() {
    return {
      /**
       * @type {object}
       */
      dataResp: {type: Object | null},
    };
  }

  constructor() {
    super();
    this.dataResp = null;
  }

  render() {
    return html`
      <h2>Let's Make a Call!</h2>
    `;
  }
}

window.customElements.define('app-stage', AppStage);
