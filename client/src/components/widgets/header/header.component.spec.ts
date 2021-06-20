/* Autor: Simon Flathmann */

import { LitElement } from 'lit-element';
import './header.component';

describe('app-header', () => {
  let element: LitElement;

  beforeEach(() => {
    element = document.createElement('app-header') as LitElement;
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('should render five links in dropdown', async () => {
    await element.updateComplete;
    const lielems = element.shadowRoot!.querySelectorAll('.toggle-links li');
    expect(lielems.length).toBe(5);
  });
});
