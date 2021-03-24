/* Autor: TODO */

import { customElement, html, LitElement } from 'lit-element';
import { router } from '../../router';

@customElement('app-root')
class AppComponent extends LitElement {
  renderRouterOutlet() {
    return router.select(
      {
        '/users/sign-in': () => html`<h1> sign-in </h1>`
      },
      () => html`<h1>hello world<h1>`
    );
  }

  render() {
    return html` <div class="main_container">${this.renderRouterOutlet()}</div> `;
  }
}
