/* Autor: TODO */

import { css, customElement, html, internalProperty, LitElement, unsafeCSS } from 'lit-element';
import { router } from '../../router';

const appComponentSCSS = require("./app.component.scss");

@customElement('app-root')
class AppComponent extends LitElement {

static styles= [
  css`${unsafeCSS(appComponentSCSS)}`
]

  @internalProperty()
  title = 'Auftrag erstellen';

  @internalProperty()
  linkItems = [
  ];

  renderRouterOutlet() {
    return router.select(
      {
        '/users/sign-in': () => html`<h1> sign-in </h1>`
      }
    );
  }

  render() {
    return html`
    <app-header title="${this.title}"> </app-header>
    <div class="main_container">${this.renderRouterOutlet()}</div>
    <app-entries></app-entries>
    `;
  }

}
