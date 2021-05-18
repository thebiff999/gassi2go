/* Autor: Martin Feldman */

import { css, customElement, html, LitElement, query, unsafeCSS } from 'lit-element';
import { httpClient } from '../../http-client';
import { router } from '../../router';
import { PageMixin } from '../page.mixin';

const sharedCSS = require('../shared.scss');
const componentCSS = require('./sign-in.component.scss');

@customElement('sign-in')
class SignInComponent extends PageMixin(LitElement) {
  // eslint-disable-line @typescript-eslint/no-unused-vars

  static styles = [
    css`
      ${unsafeCSS(sharedCSS)}
    `,
    css`
      ${unsafeCSS(componentCSS)}
    `
  ];

  @query('form')
  form!: HTMLFormElement;

  @query('#email')
  usernameElement!: HTMLInputElement;

  @query('#password')
  passwordElement!: HTMLInputElement;

  render() {
    return html`
    ${this.renderNotification()}

    <!-- SIDENAV with Poster -->

        <div class='sidenav' id='sidenav'>
          <img src='../src/assets/img/login_dog.jpg>
        </div>

        <!-- SIDENAV END -->


    <!-- MAIN-FORM -->
    
        <div class='main' id='main'>
          <div class='col-md-6 col-sm-12'>

              <h1>Gasse2Go</h1>
              <h3>Der Hund zum ausgehen</h3>


          <form> 
                  <button
                    class='btn btn-primary btn-lg'
                    type='button'
                    id='navigateToSignIn'
                    @click='${this.navigateToSignIn}'
                  >
                    ANMELDEN
                  </button>
                
                  <button
                    class='btn btn-primary btn-lg'
                    type='button'
                    id='navigateToSignUp'
                    @click='${this.navigateToSignUp}'
                  >
                    REGISTRIEREN
                  </button>
              </form>

              <!-- NAVIGATE BUTTON END -->

 
          <!-- LOGIN-FORM -->

          <form>

            <!-- LOGIN-TEXT-FORM -->

            <fieldset id='login'>
              <div class='input-group col-md-14'>
              <div class="input-group-prepend">
                <span class='input-group-text' for='email'>Email</span>
              </div>
                <input
                  class='form-control'
                  type='text'
                  autofocus
                  required
                  minlength='2'
                  maxlength='40'
                  id='email'
                  name='email'
                  placeholder='email@email.com'
                  automcomplete='off'
                />
                <small 
                  id='emailHelp' 
                  class='form-text 
                  text-muted'>
                </small>
                <div class='invalid-feedback'>
                  E-Mail ist erforderlich und muss gültig sein
                </div>
              </div>

              <div class='input-group col-md-14'>
                <div class="input-group-prepend">
                <span class='input-group-text' for='password'>Passwort</span>
                </div>
                <input
                  class='form-control'
                  type='password'
                  required
                  minlength='8'
                  id='password'
                  name='password'
                  placeholder='Password'
                  automcomplete='off'
                />
                <div class='invalid-feedback'>
                  Passwort ist erforderlich
                </div>
              </div>
            </fieldset>

            <!-- LOGIN-TEXT-FORM-END -->

            <!-- LOGIN-SUBMIT-BUTTON -->

            <fieldset>
              <button 
                class='btn btn-primary btn-lg' 
                type='button'
                id='absenden'
                @click='${this.submit}'
              >
                ANMELDEN
              </button>
            </fielset>

            <!-- LOGIN-SUBMIT-BUTTON-END -->

          </form>

          <!-- LOGIN-FORM-END -->

      </div>
    </div>

    <!-- MAIN-FORM-END -->

    `;
  }

  /**
   * Button, which navigate to "userAdministration/sign-up"
   */
  async navigateToSignUp() {
    try {
      router.navigate('userAdministration/sign-up');
    } catch ({ message }) {
      this.setNotification({ errorMessage: message });
    }
  }

  /**
   * Button, which navigate to "userAdministration/sign-in"
   */
  async navigateToSignIn() {
    try {
      router.navigate('userAdministration/sign-in');
    } catch ({ message }) {
      this.setNotification({ errorMessage: message });
    }
  }

  /**
   * submit loginData and POST to "/userAdministration/sign-in"
   * Server send JWT back
   * TODO
   */
  async submit() {
    if (this.isFormValid()) {
      const loginData = {
        username: this.usernameElement.value,
        password: this.passwordElement.value
      };
      try {
        await httpClient.post('app/userAdministration/login', loginData);
        router.navigate('search');
      } catch ({ message }) {
        this.setNotification({ errorMessage: message });
      }
    } else {
      this.form.classList.add('was-validated');
    }
  }

  /**
   * check if input fields are valid
   */
  isFormValid() {
    return this.form.checkValidity();
  }
}