/* Autor: Martin Feldman */

import { LitElement } from 'lit-element';
import './sign-up.component';

describe('app-sign-up', () => {
  let element: LitElement;

  /**
   * runs before each Test
   */
  beforeEach(async () => {
    element = document.createElement('app-sign-up') as LitElement;
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
   * button should navigate to SignIn
   */
  it('button should navigate to SignIn', async () => {
    const navigate = element.shadowRoot!.querySelector('#navigateToSignIn') as HTMLElement;
    navigate.click();
    element = document.createElement('app-sign-in') as LitElement;
    document.body.appendChild(element);
    await element.updateComplete;
    const sidenav = element.shadowRoot!.querySelector('#sidenav') as HTMLElement;
    expect(sidenav.className).toBe('sidenav');
  });

  /**
   * button should navigate to SignUp
   */
  it('button should navigate to SignUp', async () => {
    const navigate = element.shadowRoot!.querySelector('#navigateToSignUp') as HTMLElement;
    navigate.click();
    element = document.createElement('app-sign-up') as LitElement;
    document.body.appendChild(element);
    await element.updateComplete;
    const sidenav = element.shadowRoot!.querySelector('#sidenav') as HTMLElement;
    expect(sidenav.className).toBe('sidenav');
  });

  /**
   * submit() should send something
   */
  it('button should navigate to SignIn"', async () => {
    const submit = element.shadowRoot!.querySelector('#absenden') as HTMLElement;
    submit.click();
    //const sidenav = element.shadowRoot!.querySelector("#sidenav") as HTMLElement;
    //expect(sidenav.className).toBe('sidenav');
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
   * find email textfield ans should say, if it is shown
   */
  it('should find the textfield', async () => {
    const emailText = element.shadowRoot!.querySelector('#email') as HTMLElement;
    expect(emailText.id).toBe('email');
  });
});
