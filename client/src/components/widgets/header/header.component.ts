/* Autor: Simon Flathmann */

import { css, customElement, html, LitElement, property, unsafeCSS } from 'lit-element';
import logo from '../../../../resources/images/Gassi2Go-Logo.png';
import profile from '../../../../resources/images/logo_user_dog.png';

const headerComponentSCSS = require('./header.component.scss');

@customElement('app-header')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Header extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(headerComponentSCSS)}
    `
  ];

  @property()
  title = '';

  constructor() {
    super();
  }

  render() {
    return html`
      <nav>
        <a class="logo-link" href="">
          <div class="header-left">
            <div class="logo">
              <img id="logo-img" src=${logo} />
            </div>
            <div class="gassi2go">
              <h2>Gassi2Go</h2>
            </div>
          </div>
        </a>

        <div class="header-mid">
          <div class="title">
            <h2>${this.title}</h2>
          </div>
        </div>

        <div class="header-right">
          <div class="arrow" @click="${this.toggleDropdown}">
            <div class="leftLine"></div>
            <div class="rightLine"></div>
          </div>

          <div class="profil">
            <a href="/user">
              <img id="profil-img" src="${profile}" />
            </a>
          </div>

          <a href="/entries/new" class="auftrag-link">
            <h3>Auftrag erstellen</h3>
          </a>
        </div>

        <ul class="toggle-links" part="toggle-links-part">
          <li><a href="/entries">Auftrag suchen</a></li>
          <li><a href="/user/entries">Meine Aufträge</a></li>
          <li><a href="/user/dogs">Meine Hunde</a></li>
          <li><a href="/user/sign-out">Abmelden</a></li>
        </ul>
      </nav>
    `;
  }

  //Click-Event, das das Dropdown-Menü öffnet, die Links verzögert einblendet und für die Animation des Pfeils sorgt
  toggleDropdown = () => {
    const root = document.querySelector('app-root');
    const header = root?.shadowRoot?.querySelector('app-header');
    const links = header?.shadowRoot?.querySelector('.toggle-links');
    const toggleLinks = header?.shadowRoot?.querySelectorAll<HTMLElement>('.toggle-links li');
    const arrow = header?.shadowRoot?.querySelector('.arrow');

    links?.classList.toggle('toggle-active');

    arrow?.classList.toggle('flip');

    toggleLinks?.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = '';
      } else {
        link.style.animation = `toggleLinkAnimation 1s ease forwards ${index / 4 + 0.6}s`;
      }
    });
  };
}
