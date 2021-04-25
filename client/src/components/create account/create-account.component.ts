/* Autor: Martin Feldman */

import { css, customElement, html, LitElement, query, unsafeCSS } from 'lit-element';
import { router } from '../../router';
import { PageMixin } from '../page.mixin';
import { httpClient } from '../../http-client';

const componentCSS = require('./create-account.component.scss');
const indexCSS = require('.index.scss');

@customElement('app-sign-up')
class CreateAccountComponent extends PageMixin(LitElement) {
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

  @query('#name')
  nameElement!: HTMLInputElement;

  @query('#surname')
  surnameElement!: HTMLInputElement;

  @query('#dog')
  dogElement!: HTMLInputElement;

  @query('#email')
  emailElement!: HTMLInputElement;

  @query('#password')
  passwordElement!: HTMLInputElement;

  @query('#password-check')
  passwordCheckElement!: HTMLInputElement;

  render() {
    return html`
      ${this.renderNotification()}
      <h1>Konto erstellen</h1>
      <form novalidate>
        <div class="form-group">
          <label class="control-label" for="name">Name</label>
          <input class="form-control" type="text" autofocus required id="name" name="name" />
          <div class="invalid-feedback">Vorname ist notwendig</div>
        </div>
        <div class="form-group">
          <label class="control-label" for="surname">Surname</label>
          <input class="form-control" type="text" autofocus required id="surname" name="surname" />
          <div class="invalid-feedback">Nachname ist notwendig</div>
        </div>
        <div class="form-group">
          <label class="control-label" for="dog">Dog</label>
          <input class="form-control" type="text" autofocus required id="dog" name="dog" />
          <div class="invalid-feedback">Eine Angabe über den Hund ist notwendig</div>
        </div>
        <div class="form-group">
          <label class="control-label" for="email">E-Mail</label>
          <input class="form-control" type="email" required id="email" name="email" />
          <div class="invalid-feedback">Eine E-Mail-Adresse ist notwendig</div>
        </div>
        <div class="form-group">
          <label class="control-label" for="password">Passwort</label>
          <input class="form-control" type="password" required minlength="10" id="password" name="password" />
          <div class="invalid-feedback">Ein Passwort ist notwendig und muss mindestens 8 Zeichen lang sein</div>
        </div>
        <div class="form-group">
          <label class="control-label" for="password-check">Passwort nochmals eingeben</label>
          <input
            class="form-control"
            type="password"
            required
            minlength="10"
            id="password-check"
            name="passwordCheck"
          />
          <div class="invalid-feedback">Beide Passwörter müssen übereinstimmen</div>
        </div>
        <button class="btn btn-primary" type="button" @click="${this.submit}">Konto erstellen</button>
      </form>
    `;
  }

  async submit() {
    if (this.isFormValid()) {
      const accountData = {
        name: this.nameElement.value,
        surname: this.surnameElement.value,
        dog: this.dogElement.value,
        email: this.emailElement.value,
        password: this.passwordElement.value,
        passwordCheck: this.passwordCheckElement.value
      };
      try {
        await httpClient.post('users', accountData);
        router.navigate('/tasks');
      } catch ({ message }) {
        this.setNotification({ errorMessage: message });
      }
    } else {
      this.form.classList.add('was-validated');
    }
  }

  isFormValid() {
    if (this.passwordElement.value !== this.passwordCheckElement.value) {
      this.passwordCheckElement.setCustomValidity('Passwörter müssen gleich sein');
    } else {
      this.passwordCheckElement.setCustomValidity('');
    }
    return this.form.checkValidity();
  }
}
