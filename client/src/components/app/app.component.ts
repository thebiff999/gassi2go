/* Autor: Simon Flathmann */

import { css, customElement, html, internalProperty, LitElement, unsafeCSS } from 'lit-element';
import { httpClient } from '../../http-client';
import { router } from '../../router';

const appComponentSCSS = require('./app.component.scss');

@customElement('app-root')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  constructor() {
    super();
    const port = location.protocol === 'https:' ? 3443 : location.protocol === 'https:' ? 3443 : 3000;
    httpClient.init({ baseURL: `${location.protocol}//${location.hostname}:${port}/api/` });
  }

  firstUpdated() {
    router.subscribe(() => this.requestUpdate());
  }

  /* Router-Outler für den Main-Container */
  renderRouterOutlet() {
    return router.select(
      {
        '/entries': () => html`<app-entries></app-entries>`,
        '/entries/new': () => html`<app-auftragserstellung></app-auftragserstellung>`,
        '/entries/:id': params => html`<app-entry-details .entryId=${params.id}></app-entry-details>`,
        '/user/account': () => html`<app-account></app-account>`,
        '/user/password': () => html`<app-password></app-password>`,
        '/user/sign-in': () => html`<app-sign-in></app-sign-in>`,
        '/user/sign-up': () => html`<app-sign-up></app-sign-up>`,
        '/user/sign-out': () => html`<app-sign-out></app-sign-out>`,
        '/user/entries': () => html`<app-assignments></app-assignments>`,
        '/user/dogs': () => html`<app-hunde></app-hunde>`,
        '/user/dogs/new': () => html`<app-hundeerstellung></app-hundeerstellung>`
      },
      () => html`<app-entries></app-entries>`
    );
  }

  //Eigener Router-Outlet für den Header, um eigene Titel mitzugeben und Routen ohne Header zu ermöglichen
  renderHeaderOutlet() {
    return router.select(
      {
        '/entries': () => html`<app-header title="Auftragsübersicht"></app-header>`,
        '/entries/new': () => html`<app-header title="Auftragserstellung"></app-header>`,
        '/entries/:id': () => html`<app-header title="Auftrag Detailansicht"></app-header>`,
        '/user/account': () => html`<app-header title="Profil"></app-header>`,
        '/user/password': () => html`<app-header title="Password"></app-header>`,
        '/user/sign-in': () => html``,
        '/user/sign-up': () => html``,
        '/user/sign-out': () => html``,
        '/user/entries': () => html`<app-header title="Meine Aufträge"></app-header>`,
        '/user/dogs': () => html`<app-header title="Meine Hunde"></app-header>`,
        '/user/dogs/new': () => html`<app-header title="Hundeerstellung"></app-header>`
      },
      () => html`<app-header title="${this.title}"></app-header>`
    );
  }

  render() {
    return html`
      <div class="header_container">${this.renderHeaderOutlet()}</div>
      <div class="main_container">${this.renderRouterOutlet()}</div>
      <app-footer class="footer"></app-footer>
    `;
  }
}
