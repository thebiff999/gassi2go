/* Autor: Martin Feldman */

import { LitElement } from 'lit-element';
import './sign-out.component';

describe('app-sign-out', () => {
  let element: LitElement;

  /**
   * runs before each Test
   */
  beforeEach(async () => {
    element = document.createElement('app-sign-out') as LitElement;
    document.body.appendChild(element);
    await element.updateComplete;
  });

  /**
   * runs after each Test
   */
  afterEach(() => {
    element.remove();
  });

  /**
   * should find the h1-title
   */
  it('should render the title "Dein Hund ist in guten Händen"', async () => {
    const h1Elem = element.shadowRoot!.querySelector('h1') as HTMLElement;
    expect(h1Elem.innerText).toBe('Dein Hund ist in guten Händen');
  });

  /**
   * submit() should route to /sign-in
   */
  it('button should navigate to SignIn"', async () => {
    const submit = element.shadowRoot!.querySelector('#absenden') as HTMLElement;
    submit.click();
    element = document.createElement('app-sign-in') as LitElement;
    document.body.appendChild(element);
    await element.updateComplete;
    const sidenav = element.shadowRoot!.querySelector('#sidenav') as HTMLElement;
    expect(sidenav.className).toBe('sidenav');
  });

  /**
   * find first div-element with id "sidenav" and "main"
   */
  it('should show the divs "sidenav" and "main"', async () => {
    //const sidenav = element.shadowRoot!.querySelector('#sidenav') as HTMLElement;
    //expect(sidenav.className).toBe('sidenav');
    const main = element.shadowRoot!.querySelector('#main') as HTMLElement;
    expect(main.className).toBe('main');
  });
});
