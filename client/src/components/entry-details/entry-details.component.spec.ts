/* Autor: Dennis Heuermann */

import { httpClient } from '../../http-client';
import { LitElement } from 'lit-element';
import { router } from '../../router';
import './entry-details.component';

describe('app-entry-details', () => {
  let element: LitElement;

  // Callback darf nicht async sein, da sonst in der Komponente firstUpdated() aufgerufen wird,
  // bevor der Spy erzeugt wird
  beforeEach(() => {
    element = document.createElement('app-entry-details') as LitElement;
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });
  const dogName = 'Maja';
  const lng = '7.37208';
  const lat = '52.24285';
  const id = '34b1da40-0a0d-4123-b0a8-d8f190c8333b';
  const imageUrl = './../../../resources/uploads/d52f472b-7a97-49f1-ab0e-321dd26dac6cbernasenne.jpg'
  const ownerId = '1';
  const dogId = '46b823da-6482-4823-a70f-ba0080fbb400'
  const status = 'open';
  const requesterId = null;
  const createdAt = '1623157466507';
  const type = 'care';
  const date = '2021-06-17';
  const pay = 220;
  const description = 'Bitte einmal auf diese süße Dame für 2 Nächte aufpassen. Wird auch gut bezahlt!';
  const dogRace = 'Bernasenne';

  const entry = {
    dogName: dogName,
    lng: lat,
    lat: lng,
    id: id,
    imageUrl: imageUrl,
    ownerId: ownerId,
    dogId: dogId,
    status: status,
    requesterId: requesterId,
    createdAt: createdAt,
    type: type,
    date: date,
    pay: pay,
    description: description,
    dogRace: dogRace
  }

  it('should fetch the entries on first update', async () => {
    spyOn(httpClient, 'get');
    await element.updateComplete;
    expect(httpClient.get).toHaveBeenCalledTimes(1);
  });

  it('should render the received entry', async () => {

    spyOn(httpClient, 'get').and.returnValue(
      Promise.resolve({
        json() {
          return Promise.resolve(entry);
        }
      } as Response)
    );

    await element.updateComplete;
    element.requestUpdate();
    await element.updateComplete;

    const renderImage = element.shadowRoot!.querySelector('.img-fluid');
    expect(renderImage?.getAttribute('src')).toBe(imageUrl);

    const renderName = element.shadowRoot!.querySelector('.heading');
    expect(renderName?.innerHTML).toContain(dogName);

    const renderRace = element.shadowRoot!.querySelector('.flex-container')?.querySelectorAll('p')[0];
    expect(renderRace?.innerText).toBe(dogRace);

    const renderPay = element.shadowRoot!.querySelector('.flex-container')?.querySelectorAll('p')[2];
    expect(renderPay?.innerText).toBe(pay.toString()+'€');

    const renderDate = element.shadowRoot!.querySelector('.flex-container')?.querySelectorAll('p')[3];
    expect(renderDate?.innerText).toBe(date);

    const renderDescription = element.shadowRoot!.querySelector('.details')?.querySelectorAll('p')[5];
    expect(renderDescription?.innerText).toBe(description);
  });

  it('should render the correct type', async () => {
      
    spyOn(httpClient, 'get').and.returnValue(
        Promise.resolve({
            json() {
                return Promise.resolve(entry);
            }
            } as Response)
        );
    
        await element.updateComplete;
        element.requestUpdate();
        await element.updateComplete;

        const renderType = element.shadowRoot!.querySelector('.flex-container')?.querySelectorAll('p')[1];
        expect(renderType?.innerText).toBe('Aufpassen');
  });

  it('should navigate back', async () => {
    spyOn(httpClient, 'get').and.returnValue(
        Promise.resolve({
          json() {
            return Promise.resolve(entry);
          }
        } as Response)
      );
  
      await element.updateComplete;
      element.requestUpdate();
      await element.updateComplete;

    spyOn(history, 'back').and.callFake( () => console.log('hello world'));

    let button: HTMLElement = element.shadowRoot!.querySelector('#desktop-button')!;
    button.click();

    expect(history.back).toHaveBeenCalled();
  });

  it('should send the patched entry', async () => {
    spyOn(httpClient, 'get').and.returnValue(
        Promise.resolve({
          json() {
            return Promise.resolve(entry);
          }
        } as Response)
      );
  
      await element.updateComplete;
      element.requestUpdate();
      await element.updateComplete;

      spyOn(httpClient, 'patch').and.returnValue(
        Promise.resolve({
            json() {
              return Promise.resolve({ status: 200 });
            }
          } as Response)
      )

      let button: HTMLElement = element.shadowRoot!.querySelector('.btn-primary')!;
      button.click();

      expect(httpClient.patch).toHaveBeenCalled();
  });

  it('should route users who are not logged in to the sign-in page', async () => {
    spyOn(httpClient, 'get').and.returnValue(Promise.reject({ message: 'Not logged in', statusCode: 401 }));
    spyOn(router, 'navigate').and.callThrough();

    await element.updateComplete;

    expect(router.navigate).toHaveBeenCalledWith('/user/sign-in');
  });

  it('should not render any content on 404 error', async () => {
    spyOn(httpClient, 'get').and.returnValue(Promise.reject({ message: 'entry does not exist', statusCode: 404 }));
    await element.updateComplete;

    let content = element.shadowRoot!.querySelector('.container')
    expect(content).toBeNull();
  });

})