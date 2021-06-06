/* Autor: Simon Flathmann */

import { css, customElement, html, internalProperty, LitElement, unsafeCSS } from 'lit-element';
import { httpClient } from '../../http-client';
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

  constructor() {
    super();
    httpClient.init({baseURL: `//${location.hostname}:3000/api/`});
  }

  firstUpdated() {
    router.subscribe(() => this.requestUpdate());
  }

  renderRouterOutlet() {
    return router.select(
      {
        '/users/sign-in': () => html`<h1>sign-in</h1>`,
        '/auftrag/new': () => html`<app-auftragserstellung></app-auftragserstellung>`,
        '/entries': () => html`<app-entries></app-entries>`,
        '/entries/:id': params => html`<app-entry-details .entryId=${params.id}></app-entry-details>`,
        '/user': () => html`<app-account></app-account>`,
        '/user/password': () => html`<app-password></app-password>`,
        '/user/sign-in': () => html`<app-sign-in></app-sign-in>`,
        '/user/sign-up': () => html`<app-sign-up></app-sign-up>`,
        '/user/sign-out': () => html`<app-sign-out></app-sign-out>`,
        '/user/entries': () => html`<h1>TODO: Simon</h1>`,
        '/user/dogs': () => html`<app-hunde></app-hunde>`,
        '/user/dogs/new': () => html`<app-hundeerstellung></app-hundeerstellung>`
      },
      () => html`<app-entries></app-entries>`
    );
  }

  //Eigener Router Outlet für den Header, um eigene Titel mitzugeben und Routen ohne Header zu ermöglichen
  renderHeaderOutlet(){
    return router.select(
      {
        '/users/sign-in': () => html`<app-header title="Sign-In"></app-header>`,
        '/auftrag/new': () => html`<app-header title="Auftragserstellung"></app-header>`,
        '/entries': () => html`<app-header title="Auftragsübersicht"></app-header>`,
        '/entries/:id': params => html`<app-header title="Auftrag Detailansicht"></app-header>`,
        '/user': () => html`<app-header title="Profil"></app-header>`,
        '/user/password': () => html`<app-header title="Password"></app-header>`,
        '/user/sign-in': () => html`<app-header title="Sign-In}"></app-header>>`,
        '/user/sign-up': () => html`<app-header title="Sign-Up"></app-header>`,
        '/user/sign-out': () => html`<<app-header title="Sign-Out"></app-header>`,
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
