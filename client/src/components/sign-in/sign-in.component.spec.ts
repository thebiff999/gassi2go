/* Autor: Martin Feldman */

import { LitElement } from 'lit-element';
import './sign-in.component';

describe('app-sign-in', () => {
  let element: LitElement;

  /**
   * runs before each Test
   */
  beforeEach(async () => {
    element = document.createElement('app-sign-in') as LitElement;
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

  // eslint-disable-next-line prettier/prettier

  it('should find the textfield', async () => {
    const emailText = element.shadowRoot!.querySelector('#email') as HTMLElement;
    expect(emailText.id).toBe('email');
  });
});
