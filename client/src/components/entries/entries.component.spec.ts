/* Autor: Dennis Heuermann */

import { httpClient } from '../../http-client';
import { LitElement } from 'lit-element';
import './entries.component';

describe('app-entries', () => {
  let element: LitElement;

  // Callback darf nicht async sein, da sonst in der Komponente firstUpdated() aufgerufen wird,
  // bevor der Spy erzeugt wird
  beforeEach(() => {
    element = document.createElement('app-entries') as LitElement;
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('should fetch the tasks on first update', async () => {
    spyOn(httpClient, 'get');
    await element.updateComplete;
    expect(httpClient.get).toHaveBeenCalledTimes(1);
  });
})