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
  title = 'Auftragssuche';

  @internalProperty()
  linkItems = [
  ];

  renderRouterOutlet() {
    return router.select(
      {
        '/users/sign-in': () => html`<h1> sign-in </h1>`,
        '/auftrag/new': () => html `<app-auftragserstellung ><app-auftragserstellung>`
      },
      () => html `<app-entries></app-entries>`
    );
  }

  render() {
    return html`
    <app-header title="${this.title}"> </app-header>
    <div class="main_container">${this.renderRouterOutlet()}</div>
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    `;
  }

}
