import { css, customElement, html, LitElement, query, unsafeCSS } from 'lit-element';
import { httpClient } from '../../http-client';
import { router } from '../../router';
import { PageMixin } from '../page.mixin';

//const sharedCSS = require('../shared.scss');
const componentCSS = require('./password.component.scss');

@customElement('app-password')
class AccountComponent extends PageMixin(LitElement) {
  // eslint-disable-line @typescript-eslint/no-unused-vars

  static styles = [
    //css`
    //${unsafeCSS(sharedCSS)}
    //`,
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

        <!-- SIDENAV BEGIN -->

        <div class='sidenav'>
            <img src='../src/assets/img/login_dog.jpg>
        </div>

        <!-- SIDENAV END -->

        <div class='container'>
        <!-- NAVIGATION BEGIN -->

        <ul class='nav nav-pills flex-sm-row flex-nowrap' id='navigation'>
          <li class='nav-item'>
            <a 
              class='nav-link flex-sm-fill text-sm-center' 
              id = 'navigateToAccount'
              @click='${this.navigateToAccount}'
            >
              Dein Account
            </a>
          </li>
          <li class='nav-item'>
            <a 
              class='nav-link active flex-sm-fill text-sm-center' 
              id = 'navigateToPassword'
              @click='${this.navigateToPassword}'
            >
              Passwort ändern
            </a>
          </li>
          <li class='nav-item'>
            <a 
              class='nav-link flex-sm-fill text-sm-center'
              id = 'navigateToSetting'
              @click='${this.navigateToSetting}'
            >
              Einstellungen
            </a>
          </li>
        </ul>

        <!-- NAVIGATION END -->


        <!-- MAIN BEGIN -->
    
        <div class='main'>
          <div class='col-md-6 col-sm-12'>
            <div class='login-form'>

              <h1>Dein Passwort</h1>
            ´

              <!-- PASSWORD CHANGE FORM BEGIN -->

              <form>
                <fieldset id='passwordChange'>
                    <div class='form-group'>
                      <label class='control-label' for='oldPassword'>Altes Passwort</label>
                      <input
                        class='form-control'
                        type='password'
                        required
                        minlength='10'
                        id='password'
                        placeholder = '********'
                        name='oldPassword'
                        automcomplete='off'
                      />
                      <div class='invalid-feedback'>
                        Passwort ist erforderlich und muss mind. 10 Zeichen lang sein
                      </div>
                    </div>

                    <div class='form-group'>
                      <label class='control-label' for='newPassword'>Neues Passwort</label>
                      <input
                        class='form-control'
                        type='password'
                        required
                        minlength='10'
                        id='password-check'
                        placeholder = '********'
                        name='newPassword'
                        automcomplete='off'
                      />
                      <div class='invalid-feedback'>
                        Erneute Passworteingabe ist erforderlich und muss mit der ersten
                        Passworteingabe übereinstimmen
                      </div>
                    </div>

                    <div class='form-group'>
                      <label class='control-label' for='newPasswordCheck'>Neues Passwort bestätigen</label>
                      <input
                        class='form-control'
                        type='password'
                        required
                        minlength='10'
                        id='password'
                        placeholder = '********'
                        name='newPasswordCheck'
                        automcomplete='off'
                      />
                      <small id='passwordHelpBlock' class='form-text text-muted'>
                        Dein Passwort muss 8-20 Zeichen lang sein. Es darf Buchstaben und Nummer
                        enthalten, aber keine Leerzeichen oder Sonderzeichen.
                      </small>
                      <div class='invalid-feedback'>
                        Passwort ist erforderlich und muss mind. 8 Zeichen lang sein
                      </div>
                    </div>
                </fieldset>

                <!-- PASSWORD CHANGE FORM END -->

                <!-- SUBMIT BEGIN -->

                <fieldset>
                  <button 
                    class='btn btn-primary btn-lg' 
                    type='button'
                    id='absenden'
                    @click='${this.submit}'
                  >
                    ÄNDERN
                  </button>
                </fielset>

                <!-- SUBMIT END -->

              </form>

            </div>
          </div>
        </div>
        </div>

        <!-- MAIN END -->
    `;
  }

  /**
   * navigate to /userAdministration/account
   */
  async navigateToAccount() {
    try {
      router.navigate('userAdministration/account');
    } catch ({ message }) {
      this.setNotification({ errorMessage: message });
    }
  }

  /**
   * navigate to /userAdministration/password
   */
  async navigateToPassword() {
    try {
      router.navigate('userAdministration/password');
    } catch ({ message }) {
      this.setNotification({ errorMessage: message });
    }
  }

  /**
   * navigate to /userAdministration/setting
   */
  async navigateToSetting() {
    try {
      router.navigate('userAdministration/setting');
    } catch ({ message }) {
      this.setNotification({ errorMessage: message });
    }
  }

  async submit() {
    if (this.isFormValid()) {
      const authData = {
        email: this.emailElement.value,
        password: this.passwordElement.value
      };
      try {
        await httpClient.post('app/userAdministration/update', authData);
        router.navigate('app/userAdministration/account');
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
