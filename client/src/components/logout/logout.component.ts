import { customElement, html, LitElement } from 'lit-element';
import { httpClient } from '../../http-client';
import { PageMixin } from '../page.mixin';

@customElement('signout')
class SignOutComponent extends PageMixin(LitElement) {
  render() {
    return html` ${this.renderNotification()} `;
  }

  async firstUpdated() {
    try {
      await httpClient.delete('/users/sign-out');
      this.setNotification({ infoMessage: 'Du hast dich erfolgreich abgemeled.' });
    } catch ({ message }) {
      this.setNotification({ errorMessage: message });
    }
  }
}
