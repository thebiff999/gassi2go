/* Autor: Martin Feldman */

import { LitElement } from 'lit-element';
import './sign-out.component';

describe('sign-out', () => {
  let element: LitElement;

  /**
   * runs before each Test
   */
  beforeEach(async () => {
    element = document.createElement('sign-out') as LitElement;
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
    expect(h1Elem.innerText).toBe('Dein Hund ist in guten Hände?');
  });

  /**
   * submit() should route to /sign-in
   */
  it('button should navigate to SignIn"', async () => {
    const submit = element.shadowRoot!.querySelector('#absenden') as HTMLElement;
    submit.click();
    element = document.createElement('sign-in') as LitElement;
    document.body.appendChild(element);
    await element.updateComplete;
    const sidenav = element.shadowRoot!.querySelector('#sidenav') as HTMLElement;
    expect(sidenav.className).toBe('sidenav');
  });

  /**
   * find first div-element with id "sidenav" and "main"
   */
  it('should show the divs "sidenav" and "main"', async () => {
    const sidenav = element.shadowRoot!.querySelector('#sidenav') as HTMLElement;
    expect(sidenav.className).toBe('sidenav');
    const main = element.shadowRoot!.querySelector('#main') as HTMLElement;
    expect(main.className).toBe('main');
  });

  /**
   * find poster ans should say, if it is shown
   * TODO
   */
  it('should find the poster', async () => {
    const poster = element.shadowRoot!.querySelector('#poster') as HTMLElement;
    expect(poster.id).toBe('poster');
  });
});
