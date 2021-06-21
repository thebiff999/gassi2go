/* Autor: Dennis Heuermann */
import { customElement, LitElement, html, css, unsafeCSS } from 'lit-element';

const footerComponentCSS = require('./footer.component.scss');

@customElement('app-footer')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Footer extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(footerComponentCSS)}
    `
  ];

  render() {
    return html`
      <div id="footer">
        <div class="col" id="left-col">
          <p id="copyright">&copy;${this.getYear()} Gassi2Go</p>
          <p id="project">Ein Web-Engineering Projekt von</p>
          <span id="names">
            <p class="name">Simon Flathmann</p>
            <p class="name">Dennis Heuermann</p>
            <p class="name">Martin Feldman</p>
          </span>
        </div>
        <div class="col" id="right-col">
          <p>Gassi2Go ist ein Vermittlungsdienst für das Ausführen und Aufpassen von Hunden</p>
        </div>
      </div>
    `;
  }

  getYear() {
    const dateObj = new Date();
    return dateObj.getFullYear();
  }
}
