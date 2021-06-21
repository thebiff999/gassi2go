/* eslint-disable @typescript-eslint/no-unused-vars */
/* Autor: Martin Feldman */

import { css, customElement, html, LitElement, query, property, unsafeCSS } from 'lit-element';
import { httpClient } from '../../http-client';
import { router } from '../../router';
import { PageMixin } from '../page.mixin';

interface Account {
  userId: number;
  screenName: string;
  firstName: string;
  lastName: string;
  email: string;
}

const componentCSS = require('./account.component.scss');

@customElement('app-account')
class AccountComponent extends PageMixin(LitElement) {
  // eslint-disable-line @typescript-eslint/no-unused-vars

  static styles = [
    css`
      ${unsafeCSS(componentCSS)}
    `
  ];
  @query('form')
  private form!: HTMLFormElement;

  @query('#email')
  private emailElement!: HTMLInputElement;

  @query('#password')
  private passwordElement!: HTMLInputElement;

  @property()
  private myAccount: Account[] = [];

  async firstUpdated() {
    try {
    } catch ({ message, statusCode }) {
      if (statusCode === 401) {
        router.navigate('/user/sign-in');
      } else {
        this.setNotification({ errorMessage: message });
      }
    }
  }

  render() {
    return html`
      ${this.renderNotification()}

      <!-- SIDENAV BEGIN -->

      <div class="sidenav"></div>

      <!-- SIDENAV END -->
      <div class="container">
        <!-- NAVIGATION BEGIN -->

        <ul class="nav nav-pills flex-sm-row flex-nowrap" id="navigation">
          <li class="nav-item">
            <a
              class="nav-link active flex-sm-fill text-sm-center"
              id="navigateToAccount"
              @click="${this.navigateToAccount}"
            >
              Dein Account
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link flex-sm-fill text-sm-center" id="navigateToPassword" @click="${this.navigateToPassword}">
              Passwort ändern
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link flex-sm-fill text-sm-center" id="navigateToSetting" @click="${this.navigateToSetting}">
              Einstellungen
            </a>
          </li>
        </ul>

        <!-- NAVIGATION END -->

        <!-- MAIN BEGIN -->
        <div class="main">
          <div class="col-md-6 col-sm-12">
            <div class="login-form">
              <h1>Dein Account</h1>

              <!-- REGISTER TEXT FIELD 1 BEGIN -->

              <form>
                <fieldset id="register1">
                  <div class="form-group">
                    <label class="control-label" for="screenName">Nickname</label>
                    <input
                      class="form-control"
                      type="text"
                      autofocus
                      required
                      id="screenName"
                      name="screenName"
                      automcomplete="off"
                    />
                    <div class="valid-feedback">Sieht gut aus!</div>
                    <div class="invalid-feedback">Ein Nickname ist erforderlich</div>
                  </div>

                  <div class="form-group">
                    <label class="control-label" for="firstname">Vorname</label>
                    <input
                      class="form-control"
                      type="text"
                      autofocus
                      required
                      id="firstname"
                      name="firstname"
                      automcomplete="off"
                    />
                    <div class="invalid-feedback">Ein Vorname ist erforderlich</div>
                  </div>

                  <div class="form-group">
                    <label class="control-label" for="lastname">Nachname</label>
                    <input
                      class="form-control"
                      type="text"
                      autofocus
                      required
                      id="lastname"
                      name="lastname"
                      automcomplete="off"
                    />
                    <div class="invalid-feedback">Ein Nachname ist erforderlich</div>
                  </div>
                </fieldset>

                <!-- REGISTER TEXT FIELD 1 END -->

                <!-- REGISTER TEXT FIELD 2 START -->

                <fieldset id="register2">
                  <div class="form-group">
                    <label class="control-label" for="email">Email</label>
                    <input class="form-control" type="email" required id="email" name="email" automcomplete="off" />
                    <div class="invalid-feedback">E-Mail ist erforderlich und muss gültig sein</div>
                  </div>
                </fieldset>

                <!-- REGISTER TEXT FIELD 2 END -->

                <!-- SUBMIT START -->

                <fieldset>
                  <button class="btn btn-primary btn-lg" type="button" id="absenden" @click="${this.submit}">
                    ÄNDERN
                  </button>
                </fieldset>

                <!-- SUBMIT END -->
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN END -->
    `;
  }

  async navigateToAccount() {
    try {
      router.navigate('user/account');
    } catch ({ message }) {
      this.setNotification({ errorMessage: message });
    }
  }

  async navigateToPassword() {
    try {
      router.navigate('user/password');
    } catch ({ message }) {
      this.setNotification({ errorMessage: message });
    }
  }

  /**
   * navigate to /user/setting
   */
  async navigateToSetting() {
    try {
      router.navigate('user/setting');
    } catch ({ message }) {
      this.setNotification({ errorMessage: message });
    }
  }

  /**
   * get user account data with id
   */
  async loadUser() {
    try {
      /**
       * get userId from /user/id
       */
      const id = await httpClient.get('/user/id');
      /**
       * get user account data with id
       */
      await httpClient.get('/user/account/id');
    } catch ({ message }) {
      this.setNotification({ errorMessage: message });
    }
  }

  /**
   * save new user account data in DB
   */
  async submit() {
    if (this.isFormValid()) {
      const authData = {
        userId: this.id,
        email: this.emailElement.value,
        password: this.passwordElement.value
      };
      try {
        await httpClient.put('app/user/${id}', authData);
        router.navigate('app/user/account');
      } catch ({ message }) {
        this.setNotification({ errorMessage: message });
      }
    } else {
      this.form.classList.add('was-validated');
    }
  }

  isFormValid() {
    return this.form.checkValidity();
  }
}
