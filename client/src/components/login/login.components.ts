/* Autor: Martin Feldman */

import { css, customElement, html, LitElement, query, unsafeCSS } from 'lit-element';
import { router } from '../../router';
import { httpClient } from '../../http-client';
import { PageMixin } from '../page.mixin';

const componentCSS = require('./login.component.scss');
const indexCSS = require('.index.scss');

@customElement('app-sign-in')
class SignInComponent extends PageMixin(LitElement) {
  static styles = [
    css`
      ${unsafeCSS(indexCSS)}
    `,
    css`
      ${unsafeCSS(componentCSS)}
    `
  ];

  @query('form')
  form!: HTMLFormElement;

  @query('#email')
  emailElement!: HTMLInputElement;

  @query('#password')
  passwordElement!: HTMLInputElement;

  render() {
    return html`
      ${this.renderNotification()}
      <h1>Anmelden</h1>
      <form>
        <div class="form-group">
          <label class="control-label" for="email">E-Mail</label>
          <input class="form-control" type="email" autofocus required id="email" name="email" />
          <div class="invalid-feedback">Eine gültige E-Mailadresse ist für die Anmeldung notwendig</div>
        </div>
        <div class="form-group">
          <label class="control-label" for="password">Passwort</label>
          <input class="form-control" type="password" required id="password" name="password" />
          <div class="invalid-feedback">Die Vergabe eines Passwortes ist zwingend</div>
        </div>
        <button class="btn btn-primary" type="button" @click="${this.onsubmit}">Login</button>
      </form>
    `;
  }
}
