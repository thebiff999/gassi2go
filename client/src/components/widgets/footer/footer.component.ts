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
        <h3>Hello, dis footer</h3>
      </div>
    `;
  }
}
