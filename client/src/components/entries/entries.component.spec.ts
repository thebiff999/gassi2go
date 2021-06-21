/* Autor: Dennis Heuermann */

import { httpClient } from '../../http-client';
import { LitElement } from 'lit-element';
import Cookies from 'js-cookie';
import { router } from '../../router';
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
    Cookies.remove('lat');
    Cookies.remove('lng');
  });

  const entries = [
    {
      dogName: 'Rocky',
      lng: '7.61257',
      lat: '51.97612',
      id: 'c2c0f8d1-8301-402e-979c-9a0f345a9093',
      imageUrl: './../../../resources/uploads/102086c8-69e8-46a5-bfef-936dd3b4fb2adeutschedogge.jpg',
      ownerId: '1',
      dogId: '16b6be5b-a844-4b28-8c17-b0ff7912bf6d',
      status: 'open',
      requesterId: null,
      createdAt: '1623170960773',
      type: 'walk',
      date: '2021-06-16',
      pay: '0.00',
      description: 'Grevenerstraße Grevenerstraße Grevenerstraße Grevenerstraße Grevenerstraße Grevenerstraße',
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
      status: 'open',
      requesterId: null,
      createdAt: '1623157466507',
      type: 'care',
      date: '2021-06-17',
      pay: '220.00',
      description: 'Bitte einmal auf diese süße Dame für 2 Nächte aufpassen. Wird auch gut bezahlt!',
      dogRace: 'Bernasenne'
    },
    {
      dogName: 'Bello',
      lng: '7.62591',
      lat: '51.96258',
      id: '2',
      imageUrl: 'https://i.imgur.com/N7K4w0J.jpg',
      ownerId: '6',
      dogId: '2',
      status: 'open',
      requesterId: null,
      createdAt: '1622993746933',
      type: 'care',
      date: '2021-07-25',
      pay: '30',
      description: 'Hier steht die Beschreibung',
      dogRace: 'Dackel'
    },
    {
      dogName: 'Rex',
      lng: '7.62571',
      lat: '51.95276',
      id: '3',
      imageUrl: 'https://i.imgur.com/26zaH5Y.jpg',
      ownerId: '1',
      dogId: '3',
      status: 'open',
      requesterId: null,
      createdAt: '1622993746933',
      type: 'walk',
      date: '2021-06-20',
      pay: '12',
      description: 'Beschreibung',
      dogRace: 'Rottweiler'
    }
  ];

  it('should fetch the entries on first update', async () => {
    spyOn(Cookies, 'get').and.returnValue({ lat: '52.248286199999995', lng: '7.376411999999998' });
    spyOn(httpClient, 'get');
    await element.updateComplete;
    expect(httpClient.get).toHaveBeenCalledTimes(1);
  });

  it('should render the received entries', async () => {
    spyOn(Cookies, 'get').and.returnValue({ lat: '52.248286199999995', lng: '7.376411999999998' });
    spyOn(httpClient, 'get').and.returnValue(
      Promise.resolve({
        json() {
          return Promise.resolve({ results: entries });
        }
      } as Response)
    );

    await element.updateComplete;
    element.requestUpdate();
    await element.updateComplete;

    const renderEntries = element.shadowRoot!.querySelectorAll('.entry');
    expect(renderEntries.length).toBe(4);
  });

  it('should render the correct type', async () => {
    spyOn(Cookies, 'get').and.returnValue({ lat: '52.248286199999995', lng: '7.376411999999998' });
    spyOn(httpClient, 'get').and.returnValue(
      Promise.resolve({
        json() {
          return Promise.resolve({ results: entries });
        }
      } as Response)
    );

    await element.updateComplete;
    element.requestUpdate();
    await element.updateComplete;

    const items = element.shadowRoot!.querySelectorAll('.card-body');
    const item1 = items[0].querySelector('button');
    const item2 = items[1].querySelector('button');
    expect(item1?.innerText).toBe('Führ mich aus');
    expect(item2?.innerText).toBe('Pass auf mich auf');
  });

  it('should navigate to the detail-site', async () => {
    spyOn(Cookies, 'get').and.returnValue({ lat: '52.248286199999995', lng: '7.376411999999998' });

    spyOn(httpClient, 'get').and.returnValue(
      Promise.resolve({
        json() {
          return Promise.resolve({ results: entries });
        }
      } as Response)
    );

    await element.updateComplete;
    element.requestUpdate();
    await element.updateComplete;

    spyOn(router, 'navigate').and.callThrough();

    const button: HTMLElement = element.shadowRoot!.querySelectorAll('button')[4];
    button.click();

    expect(router.navigate).toHaveBeenCalledWith('/entries/2');
  });

  it('should toggle the view', async () => {
    spyOn(Cookies, 'get').and.returnValue({ lat: '52.248286199999995', lng: '7.376411999999998' });

    spyOn(httpClient, 'get').and.returnValue(
      Promise.resolve({
        json() {
          return Promise.resolve({ results: entries });
        }
      } as Response)
    );

    await element.updateComplete;

    const button: HTMLElement = element.shadowRoot!.querySelectorAll('button')[1];
    button.click();

    const cardView = element.shadowRoot!.querySelector('#entries');
    const mapView = element.shadowRoot!.querySelector('#map-container');

    expect(cardView?.classList).toContain('visually-hidden');
    expect(mapView?.classList).not.toContain('visually-hidden');
  });

  it('should route user who are not logged in to the sign-in page', async () => {
    spyOn(Cookies, 'get').and.returnValue({ lat: '52.248286199999995', lng: '7.376411999999998' });
    spyOn(httpClient, 'get').and.returnValue(Promise.reject({ message: 'Not logged in', statusCode: 401 }));
    spyOn(router, 'navigate').and.callThrough();

    await element.updateComplete;

    expect(router.navigate).toHaveBeenCalledWith('/user/sign-in');
  });

  it('should set the current location', async () => {
    spyOn(httpClient, 'get').and.returnValue(
      Promise.resolve({
        json() {
          return Promise.resolve({ results: entries });
        }
      } as Response)
    );
    await element.updateComplete;

    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(function () {
      const position = { coords: { latitude: 5, longitude: 6 } };
      // eslint-disable-next-line prefer-rest-params
      arguments[0](position);
    });

    const button: HTMLElement = document.querySelector('#modal-button')!;
    button.click();

    expect(Cookies.get('lat')).toBe('5');
    expect(Cookies.get('lng')).toBe('6');
  });

  it('should not set the current location', async () => {
    spyOn(httpClient, 'get').and.returnValue(
      Promise.resolve({
        json() {
          return Promise.resolve({ results: entries });
        }
      } as Response)
    );
    await element.updateComplete;

    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(function () {
      const error = { code: 1 };
      // eslint-disable-next-line prefer-rest-params
      arguments[1](error);
    });

    const button: HTMLElement = document.querySelector('#modal-button')!;
    button.click();

    expect(Cookies.get('lat')).toBe(undefined);
    expect(Cookies.get('lng')).toBe(undefined);
  });
});
