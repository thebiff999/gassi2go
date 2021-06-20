/* eslint-disable @typescript-eslint/no-unused-vars */
/* Autor: Martin Feldman */

import { css, customElement, html, LitElement, query, unsafeCSS } from 'lit-element';
import { httpClient } from '../../http-client';
import { router } from '../../router';
import { PageMixin } from '../page.mixin';

const componentCSS = require('./sign-up.component.scss');

@customElement('app-sign-up')
class SignUpComponent extends PageMixin(LitElement) {
  // eslint-disable-line @typescript-eslint/no-unused-vars

  static styles = [
    css`
      ${unsafeCSS(componentCSS)}
    `
  ];

  @query('form')
  private form!: HTMLFormElement;

  @query('#screenName')
  private screenNameElement!: HTMLInputElement;

  @query('#firstName')
  private firstNameElement!: HTMLInputElement;

  @query('#lastName')
  private lastNameElement!: HTMLInputElement;

  @query('#email')
  private emailElement!: HTMLInputElement;

  @query('#password')
  private passwordElement!: HTMLInputElement;

  @query('#password-check')
  private passwordCheckElement!: HTMLInputElement;

  render() {
    return html`
      ${this.renderNotification()}

      <!-- SIDENAV with Poster -->

      <div class="sidenav" id="sidenav"></div>

      <!-- SIDENAV END -->

      <!-- MAIN-FORM -->

      <div class="main" id="main">
        <div class="col-md-6 col-sm-12">
          <h1>Gassi2Go</h1>
          <h3>Der Hund zum ausgehen</h3>

          <!-- NAVIGATE BUTTON -->

          <form>
            <button
              class="btn btn-primary btn-lg"
              type="button"
              id="navigateToSignIn"
              @click="${this.navigateToSignIn}"
            >
              ANMELDEN
            </button>

            <button
              class="btn btn-primary btn-lg"
              type="button"
              id="navigateToSignUp"
              @click="${this.navigateToSignUp}"
            >
              REGISTRIEREN
            </button>
          </form>

          <!-- NAVIGATE BUTTON END -->

          <!-- REGISTER-FORM -->
          <!-- REGISTER-LEFT -->

          <form>
            <fieldset id="register1">
              <div class="input-group col-md-14">
                <div class="input-group-prepend">
                  <span class="input-group-text" for="firstName">Vorname</span>
                </div>
                <input
                  class="form-control"
                  type="text"
                  minlength="2"
                  required
                  id="firstName"
                  name="firstName"
                  automcomplete="off"
                />
                <div class="invalid-feedback">Vorname ist erforderlich</div>
              </div>

              <div class="input-group col-md-14">
                <div class="input-group-prepend">
                  <span class="input-group-text" for="lastName">Nachname</span>
                </div>
                <input
                  class="form-control"
                  type="text"
                  minlength="2"
                  required
                  id="lastName"
                  name="lastName"
                  automcomplete="off"
                />
                <div class="invalid-feedback">Nachname ist erforderlich</div>
              </div>

              <div class="input-group col-md-14">
                <div class="input-group-prepend">
                  <span class="input-group-text" for="email">Email</span>
                </div>
                <input class="form-control" type="email" required id="email" name="email" automcomplete="off" />
                <div class="invalid-feedback">E-Mail ist notwendig und muss gültig sein</div>
              </div>
            </fieldset>

            <fieldset id="register2">
              <div class="input-group col-md-14">
                <div class="input-group-prepend">
                  <span class="input-group-text" for="password">Passwort</span>
                </div>
                <input
                  class="form-control"
                  type="password"
                  required
                  minlength="8"
                  id="password"
                  name="password"
                  automcomplete="off"
                />
                <small id="passwordHelpBlock" class="form-text text-muted">
                  Dein Passwort muss mindestens 8 Zeichen lang sein
                </small>
                <div class="invalid-feedback">Passwort ist erforderlich und muss mindestens 8 Zeichen lang sein</div>
              </div>

              <div>
                <div class="input-group col-md-14">
                  <div class="input-group-prepend">
                    <span class="input-group-text" for="password-check">Passwort wiederholen</span>
                  </div>
                  <input
                    class="form-control"
                    type="password"
                    required
                    minlength="8"
                    id="password-check"
                    name="password-check"
                    automcomplete="off"
                  />
                  <small id="passwordHelpBlock" class="form-text text-muted"> </small>
                  <div class="invalid-feedback">Beide Passwörter müssen gleich sein</div>
                </div>
              </div>
            </fieldset>

            <!-- REGISTER RIGHT -->

            <!-- ABSENDEN -->

            <fieldset>
              <button class="btn btn-primary btn-lg" type="button" id="absenden" @click="${this.submit}">
                KONTO ERSTELLEN
              </button>
            </fieldset>

            <!-- ABSENDEN END -->
          </form>

          <!-- REGISTER FORM END -->
        </div>
      </div>

      <!-- MAIN END -->
    `;
  }

  async navigateToSignUp() {
    try {
      router.navigate('user/sign-up');
    } catch ({ message }) {
      this.setNotification({ errorMessage: message });
    }
  }

  async navigateToSignIn() {
    try {
      router.navigate('user/sign-in');
    } catch ({ message }) {
      this.setNotification({ errorMessage: message });
    }
  }

  async submit() {
    if (this.isFormValid()) {
      const accountData = {
        screenName: this.screenNameElement.value,
        firstName: this.firstNameElement.value,
        lastName: this.lastNameElement.value,
        email: this.emailElement.value,
        password: this.passwordElement.value,
        passwordCheck: this.passwordCheckElement.value
      };
      try {
        await httpClient.post('/users', accountData);
        router.navigate('search');
      } catch ({ message }) {
        this.setNotification({ errorMessage: message });
      }
    } else {
      this.form.classList.add('was-validated');
    }
  }

  isFormValid() {
    if (this.passwordElement.value !== this.passwordCheckElement.value) {
      this.passwordCheckElement.setCustomValidity('Beide Passwörter müssen gleich sein');
    } else {
      this.passwordCheckElement.setCustomValidity('');
    }

    return this.form.checkValidity();
  }
}
