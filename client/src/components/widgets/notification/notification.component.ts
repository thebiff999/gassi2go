/* Autor: Prof. Dr. Norman Lahme-Hütig (FH Münster) */

import { customElement, html, css, unsafeCSS, LitElement, property } from 'lit-element';

const sharedCSS = require('./notification.component.scss');

@customElement('app-notification')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class NotificationComponent extends LitElement {
  static styles = css`
    ${unsafeCSS(sharedCSS)}
  `;

  @property()
  error = '';

  @property()
  info = '';

  render() {
    return html`
      ${this.error ? html`<div class="alert alert-danger">${this.error}</div>` : ''}
      ${this.info ? html`<div class="alert alert-info">${this.info}</div>` : ''}
    `;
  }
}
