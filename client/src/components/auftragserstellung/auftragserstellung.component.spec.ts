/* Autor: Simon Flathmann */

import { LitElement } from 'lit-element';
import { httpClient } from '../../http-client';
import './auftragserstellung.component';

describe('app-auftragserstellung', () => {
  let element: LitElement;

  beforeEach(() => {
    element = document.createElement('app-auftragserstellung') as LitElement;
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('should render a combobox option for each dog', async () => {
    const hunde = [
      {
        besitzerId: '1a1b1c',
        name: 'Bello',
        rasse: 'Lambrador',
        gebDate: '2018-03-10',
        infos: 'Bello ist ein super lieber und ruhiger Hund, der es liebt gestreichelt zu werden.',
        imgPath: './../../../resources/uploads/d52f472b-7a97-49f1-ab0e-321dd26dac6cbernasenne.jpg'
      },
      {
        besitzerId: '2a2b2c',
        name: 'Maja',
        rasse: 'Landseer',
        gebDate: '2015-07-15',
        infos: 'Zwar schon ein paar Jahre alt, trotzdem noch sehr verspielt und total tollpatschig.',
        imgPath: './../../../resources/uploads/d52f472b-7a97-49f1-ab0e-321dd26dac6cbernasenne.jpg'
      },
      {
        besitzerId: '3a3b3c',
        name: 'Rex',
        rasse: 'Chihuahua',
        gebDate: '2018-04-20',
        infos: 'Wie die meisten kleinen Hund, nimmst er sich viel zu ernst und denkt er wäre der Groeßte.',
        imgPath: './../../../resources/uploads/d52f472b-7a97-49f1-ab0e-321dd26dac6cbernasenne.jpg'
      }
    ];

    spyOn(httpClient, 'get').and.returnValue(
      Promise.resolve({
        json() {
          return Promise.resolve({ results: hunde });
        }
      } as Response)
    );

    await element.updateComplete;
    element.requestUpdate();
    await element.updateComplete;

    const hundeOptions = element.shadowRoot!.querySelectorAll('#inputHunde option');
    expect(hundeOptions.length).toBe(4); //4 und nicht 3, da eine Option initial gesetzt wird.
  });

  it('should set the min-attribute of the date input', async () => {
    await element.updateComplete;
    const input = element.shadowRoot!.querySelector('#auftragDatum') as HTMLInputElement;
    expect(input.getAttribute('min')).toBeDefined();
  });
});
