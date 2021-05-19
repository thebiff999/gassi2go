/* Autor: Simon Flathmann */

import { css, customElement, html, internalProperty, LitElement, unsafeCSS } from 'lit-element';
import { router } from '../../router';

const appComponentSCSS = require('./app.component.scss');

@customElement('app-root')
class AppComponent extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(appComponentSCSS)}
    `
  ];

  @internalProperty()
  title = 'Auftragssuche';

  @internalProperty()
  linkItems = [];

  firstUpdated() {
    router.subscribe(() => this.requestUpdate());
  }

  renderRouterOutlet() {
    return router.select(
      {
        '/users/sign-in': () => html`<h1>sign-in</h1>`,
        '/auftrag/new': () => html`<app-auftragserstellung></app-auftragserstellung>`,
        '/entries': () => html`<app-entry></app-entry>`,
        '/user': () => html`<app-account></app-account>`,
        '/user/password': () => html`<app-password></app-password>`,
        '/user/sign-in': () => html`<app-sign-in></app-sign-in>`,
        '/user/sign-up': () => html`<app-sign-up></app-sign-up>`,
        '/user/sign-out': () => html`<app-sign-out></app-sign-out>`,
        '/user/entries': () => html`<h1>TODO: Simon</h1>`,
        '/user/dogs': () => html`<h1>TODO: Simon</h1>`
      },
      () => html`<app-entries></app-entries>`
    );
  }

  render() {
    return html`
      <app-header title="${this.title}"></app-header>
      <div class="main_container">${this.renderRouterOutlet()}</div>
      <app-footer class="footer"></app-footer>
    `;
  }
}
