/* Autor: Martin Feldman */

import { css, customElement, html, LitElement, query, property, unsafeCSS } from 'lit-element';
import { httpClient } from '../../http-client';
import { router } from '../../router';
import { PageMixin } from '../page.mixin';

// define interface `account`
interface Account {
  userId: number;
  screenName: string;
  firstName: string;
  lastName: string;
  email: string;
}

//const sharedCSS = require('../shared.scss');
const componentCSS = require('./account.component.scss');

@customElement('account')
class AccountComponent extends PageMixin(LitElement) {
  // eslint-disable-line @typescript-eslint/no-unused-vars

  static styles = [
    //constcss`
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

  @property()
  private myAccount: Account[] = [];

  async firstUpdated() {
    /*
    try {
      //const userId = await httpClient.get('userAdministration/account/id');
      //const urlId:string = "userAdministration/account/" + userId;
      //const response = await httpClient.get('userAdministration/account/');

      // get json
      //this.myAccount = await response.json();
      //const response = await httpClient.get('tasks' + location.search);

    } catch ({ message, statusCode }) {
      if (statusCode === 401) {
        router.navigate('/userAdministration/sign-in');
      } else {
        this.setNotification({errorMessage: message});
      }
    }
    */
  }

  render() {
    return html`
      ${this.renderNotification()}

    
        <!-- SIDENAV BEGIN -->
      
        <div class='sidenav'>
            <img 
              src='../src/assets/img/login_dog.jpg' 
              alt='Login Gassi2Go'
            >
        </div>

        <!-- SIDENAV END -->
        <div class='container'>
        <!-- NAVIGATION BEGIN -->
      
        <ul class='nav nav-pills flex-sm-row flex-nowrap' id='navigation'>
          <li class='nav-item'>
            <a 
              class='nav-link active flex-sm-fill text-sm-center' 
              id = 'navigateToAccount'
              @click='${this.navigateToAccount}'
            >
              Dein Account
            </a>
          </li>
          <li class='nav-item'>
            <a 
              class='nav-link flex-sm-fill text-sm-center' 
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
 
              <h1>Dein Account</h1>


              <!-- REGISTER TEXT FIELD 1 BEGIN -->

 
              <form>
                <fieldset id='register1'>
                    <div class='form-group'>
                      <label class='control-label' for='screenName'>Nickname</label>
                      <input
                        class='form-control'
                        type='text'
                        autofocus
                        required
                        id='screenName'
                        name='screenName'
                        automcomplete='off'
                      />
                      <div class='valid-feedback'>
                        Sieht gut aus!
                      </div>
                      <div class='invalid-feedback'>
                        Nickname ist erforderlich
                      </div>
                    </div>

                    <div class='form-group'>
                      <label class='control-label' for='firstname'>Vorname</label>
                      <input
                        class='form-control'
                        type='text'
                        autofocus
                        required
                        id='firstname'
                        name='firstname'
                        automcomplete='off'
                      />
                      <div class='invalid-feedback'>
                        Vorname ist erforderlich
                      </div>
                    </div>

                    <div class='form-group'>
                      <label class='control-label' for='lastname'>Nachname</label>
                      <input
                        class='form-control'
                        type='text'
                        autofocus
                        required
                        id='lastname'
                        name='lastname'
                        automcomplete='off'
                      />
                      <div class='invalid-feedback'>
                        Nachname ist erforderlich
                      </div>
                    </div> 
                </fieldset>

                <!-- REGISTER TEXT FIELD 1 END -->

                <!-- REGISTER TEXT FIELD 2 START -->

                <fieldset id='register2'>
                    
                    
                    <div class='form-group'>
                      <label class='control-label' for='email'>Email</label>
                      <input
                        class='form-control'
                        type='email'
                        required
                        id='email'
                        name='email'
                        automcomplete='off'
                      />
                      <div class='invalid-feedback'>
                        E-Mail ist erforderlich und muss gültig sein
                      </div>
                    </div>
                </fieldset>

                <!-- REGISTER TEXT FIELD 2 END -->

                <!-- SUBMIT START -->

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

  /**
   * get user account data with id
   */
  async loadUser() {
    try {
      /**
       * get userId from /userAdministration/id
       */
      const id = await httpClient.get('/userAdministration/id');
      /**
       * get user account data with id
       */
      await httpClient.get('/userAdministration/account/id');
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
        await httpClient.put('app/userAdministration/${id}', authData);
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
