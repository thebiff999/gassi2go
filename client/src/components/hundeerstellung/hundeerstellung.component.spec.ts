/* Autor: Simon Flathmann */

import { LitElement } from 'lit-element';
import './hundeerstellung.component';
// eslint-disable-next-line @typescript-eslint/no-duplicate-imports
import { HundeerstellungComponent } from './hundeerstellung.component';

describe('app-hundeerstellung', () => {
  let element: LitElement;

  beforeEach(() => {
    element = document.createElement('app-hundeerstellung') as LitElement;
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('should call initPictureUpload once', async () => {
    const spy = spyOn(element as HundeerstellungComponent, 'initPictureUpload');
    await element.updateComplete;
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set the max-attribute of the date input', async () => {
    await element.updateComplete;
    const input = element.shadowRoot!.querySelector('#geb') as HTMLInputElement;
    expect(input.getAttribute('max')).toBeDefined();
  });

  it('should fail input validation', async () => {
    const elem = element as HundeerstellungComponent;
    await element.updateComplete;
    elem.create();
    expect(elem.form.classList).toContain('was-validated');
  });
});
