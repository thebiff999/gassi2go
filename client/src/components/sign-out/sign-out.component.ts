/* Autor: Martin Feldman */

import { css, customElement, html, LitElement, unsafeCSS } from 'lit-element';
import { httpClient } from '../../http-client';
import { router } from '../../router';
import { PageMixin } from '../page.mixin';

//const sharedCSS = require('../shared.scss');
const componentCSS = require('./sign-out.component.scss');

@customElement('sign-out')
class SignOutComponent extends PageMixin(LitElement) {
  // eslint-disable-line @typescript-eslint/no-unused-vars

  static styles = [
    //css`
    //${unsafeCSS(sharedCSS)}
    //`,
    css`
      ${unsafeCSS(componentCSS)}
    `
  ];

  render() {
    return html`
    ${this.renderNotification()}
      <div class='sidenav' id='sidenav'>
        <img src='../src/assets/img/login_dog.jpg'>
      </div>

      <div class='main' id='main'>
        <h1>
          <nobr>
            Dein Hund ist in guten Händen
          </nobr>
        </h1>
        <h3
          <nobr>  
            &hellip; bis zum nächsten Mal
          </nobr>
        </h3>
        <button 
          class='btn btn-primary' 
          id='absenden' 
          type='button' 
          @click='${this.submit}'
        >
          Abmelden
        </button>
      </div>
  `;
  }

  async submit() {
    try {
      await httpClient.delete('userAdministration/sign-out');
      this.setNotification({ infoMessage: 'Sie wurden erfolgreich abgemeldet!' });
      router.navigate('userAdministration/sign-in');
    } catch ({ message }) {
      this.setNotification({ errorMessage: message });
    }
  }
}
