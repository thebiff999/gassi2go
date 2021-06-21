/* Autor: Dennis Heuermann */

import { LitElement } from 'lit-element';
import './footer.component';

describe('app-footer', () => {
  let element: LitElement;

  beforeEach(() => {
    element = document.createElement('app-footer') as LitElement;
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('should render the names of the project participants', async () => {
    await element.updateComplete;
    const names = element.shadowRoot!.querySelectorAll('.name');
    expect(names.length).toBe(3);
  });
});
