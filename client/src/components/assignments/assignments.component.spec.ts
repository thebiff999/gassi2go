/* Autor: Dennis Heuermann */

import { httpClient } from '../../http-client';
import { LitElement } from 'lit-element';
import { router } from '../../router';
import './assignments.component';
import Cookies from 'js-cookie';

describe('app-assignments', () => {
  let element: LitElement;

  // Callback darf nicht async sein, da sonst in der Komponente firstUpdated() aufgerufen wird,
  // bevor der Spy erzeugt wird
  beforeEach(() => {
    element = document.createElement('app-assignments') as LitElement;
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
    Cookies.remove('lat');
    Cookies.remove('lng');
  });

  const assignments = [
    {
      dogName: 'Rocky',
      lng: '7.61257',
      lat: '51.97612',
      id: 'c2c0f8d1-8301-402e-979c-9a0f345a9093',
      imageUrl: './../../../resources/uploads/102086c8-69e8-46a5-bfef-936dd3b4fb2adeutschedogge.jpg',
      ownerId: '1',
      dogId: '16b6be5b-a844-4b28-8c17-b0ff7912bf6d',
      status: 'assigned',
      requesterId: '123',
      createdAt: '1623170960773',
      type: 'walk',
      date: '2021-06-16',
      pay: '25.00',
      description: 'Rocky ist super lieb, aber ein wahres Kraftpaket. Beim Gassi gehen sind Mukkis von Nöten',
      dogRace: 'Deutsche Dogge'
    },
    {
      dogName: 'Maja',
      lng: '7.37208',
      lat: '52.24285',
      id: '34b1da40-0a0d-4123-b0a8-d8f190c8333b',
      imageUrl: './../../../resources/uploads/d52f472b-7a97-49f1-ab0e-321dd26dac6cbernasenne.jpg',
      ownerId: '1',
      dogId: '46b823da-6482-4823-a70f-ba0080fbb400',
      status: 'assigned',
      requesterId: '123',
      createdAt: '1623157466507',
      type: 'care',
      date: '2021-06-17',
      pay: '220.00',
      description: 'Bitte einmal auf diese süße Dame für 2 Nächte aufpassen. Wird auch gut bezahlt!',
      dogRace: 'Bernasenne'
    }
  ];

  it('should fetch the assigned entries', async () => {
    spyOn(httpClient, 'get');
    await element.updateComplete;
    expect(httpClient.get).toHaveBeenCalledTimes(1);
  });

  it('should render the fetched entries', async () => {
    spyOn(Cookies, 'get').and.returnValue({ lat: '52.248286199999995', lng: '7.376411999999998' });
    spyOn(httpClient, 'get').and.returnValue(
      Promise.resolve({
        json() {
          return Promise.resolve({ results: assignments });
        }
      } as Response)
    );

    await element.updateComplete;
    element.requestUpdate();
    await element.updateComplete;

    const items = element.shadowRoot!.querySelectorAll('.list-item');
    expect(items.length).toBe(2);
  });

  it('should render the correct type', async () => {
    spyOn(Cookies, 'get').and.returnValue({ lat: '52.248286199999995', lng: '7.376411999999998' });
    spyOn(httpClient, 'get').and.returnValue(
      Promise.resolve({
        json() {
          return Promise.resolve({ results: assignments });
        }
      } as Response)
    );

    await element.updateComplete;
    element.requestUpdate();
    await element.updateComplete;

    const items = element.shadowRoot!.querySelectorAll('.list-item');
    const item1: HTMLElement = items[0].querySelector('.type')!;
    const item2: HTMLElement = items[1].querySelector('.type')!;

    expect(item1.innerText).toBe('Gassi gehen');
    expect(item2.innerText).toBe('Aufpassen');
  });

  it('should submit the done assignment', async () => {
    spyOn(Cookies, 'get').and.returnValue({ lat: '52.248286199999995', lng: '7.376411999999998' });
    spyOn(httpClient, 'get').and.returnValue(
      Promise.resolve({
        json() {
          return Promise.resolve({ results: assignments });
        }
      } as Response)
    );

    await element.updateComplete;
    element.requestUpdate();
    await element.updateComplete;

    spyOn(httpClient, 'patch').and.stub();
    const url = '/entries/id/c2c0f8d1-8301-402e-979c-9a0f345a9093';
    const body = {
      dogName: 'Rocky',
      lng: '7.61257',
      lat: '51.97612',
      id: 'c2c0f8d1-8301-402e-979c-9a0f345a9093',
      imageUrl: './../../../resources/uploads/102086c8-69e8-46a5-bfef-936dd3b4fb2adeutschedogge.jpg',
      ownerId: '1',
      dogId: '16b6be5b-a844-4b28-8c17-b0ff7912bf6d',
      status: 'done',
      requesterId: '123',
      createdAt: '1623170960773',
      type: 'walk',
      date: '2021-06-16',
      pay: '25.00',
      description: 'Rocky ist super lieb, aber ein wahres Kraftpaket. Beim Gassi gehen sind Mukkis von Nöten',
      dogRace: 'Deutsche Dogge'
    };

    const buttons = element.shadowRoot!.querySelectorAll('.btn-primary');
    const button: HTMLElement = buttons[0] as HTMLElement;
    button.click();

    expect(httpClient.patch).toHaveBeenCalledWith(url, body);
  });

  it('should route users who are not logged in to the sign-in page', async () => {
    spyOn(httpClient, 'get').and.returnValue(Promise.reject({ message: 'Not logged in', statusCode: 401 }));
    spyOn(router, 'navigate').and.callThrough();

    await element.updateComplete;

    expect(router.navigate).toHaveBeenCalledWith('/user/sign-in');
  });
});
