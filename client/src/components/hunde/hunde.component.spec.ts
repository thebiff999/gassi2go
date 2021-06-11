import { LitElement } from 'lit-element';
import { httpClient } from '../../http-client';
import { HundeComponent } from './hunde.component';
import './hunde.component';

describe('app-hunde', () => {
    let element: LitElement;

    beforeEach(()=>{
        element = document.createElement('app-hunde') as LitElement;
        document.body.appendChild(element);
    });

    afterEach(() => {
        element.remove();
    });

    it('should render 2 dogs', async() => {
        const hunde = [
            {besitzerId: '1a1b1c', name: 'Bello', rasse: 'Lambrador', gebDate: '2018-03-10',
             infos: 'Bello ist ein super lieber und ruhiger Hund, der es liebt gestreichelt zu werden.',
              imgPath: './../../../resources/uploads/d52f472b-7a97-49f1-ab0e-321dd26dac6cbernasenne.jpg'},
            {besitzerId: '2a2b2c', name: 'Maja', rasse: 'Landseer', gebDate: '2015-07-15',
             infos: 'Zwar schon ein paar Jahre alt, trotzdem noch sehr verspielt und total tollpatschig.',
              imgPath: './../../../resources/uploads/d52f472b-7a97-49f1-ab0e-321dd26dac6cbernasenne.jpg'}
        ]

        spyOn(httpClient, 'get').and.returnValue(
            Promise.resolve({
                json(){
                    return Promise.resolve({ results: hunde });
                }
            } as Response)
        );

        await element.updateComplete;
        element.requestUpdate();
        await element.updateComplete;

        const cards = element.shadowRoot!.querySelectorAll('#dogcard');
        expect(cards.length).toBe(2);
    });

    it('should give the user an alert after pet', async() => {
        let spy = spyOn(window, 'alert');
        const elem = element as HundeComponent;
        await elem.pet('Felix');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should filter the chosen dog from the internalProperty', async() =>{
        const hunde = [
            {besitzerId: "a321-231-21cdd",
            createdAt: "1622913657614",
            gebDate: "2013-04-20",
            id: "ba88be92-a187-4a1c-b631-900f755b963b",
            imgPath: "./../../../resources/uploads/c9d741bc-0e46-4ff5-a930-f4e380557526englishpointer.jpeg",
            infos: "Ein treuer Begleiter, der es liebt gefordert zu werden. Aber Vorsicht! Kann ziemlich stark an der Leine ziehen, falls er in der Ferne ein Reh entdeckt. ",
            name: "Oskar",
            rasse: "English Pointer"},
            {besitzerId: "a321-231-21cdd",
            createdAt: "1622913339747",
            gebDate: "2011-12-10",
            id: "46b823da-6482-4823-a70f-ba0080fbb400",
            imgPath: "./../../../resources/uploads/d52f472b-7a97-49f1-ab0e-321dd26dac6cbernasenne.jpg",
            infos: "Sie ist eine selbstbewusste und gutmütige Mutter, die sich ihren Platz auf dem Sofa nicht mehr nehmen lässt... ",
            name: "Maja",
            rasse: "Bernasenne"},
            {besitzerId: "a321-231-21cdd",
            createdAt: "1622913160107",
            gebDate: "2014-08-31",
            id: "16b6be5b-a844-4b28-8c17-b0ff7912bf6d",
            imgPath: "./../../../resources/uploads/102086c8-69e8-46a5-bfef-936dd3b4fb2adeutschedogge.jpg",
            infos: "Vielleicht der sensibelste Hund, den Sie jemals kennenlernen werden. Einmal bin ich ihm ausversehen auf die Pfote getreten und er war 3 Tage beleidigt. Sonst sehr anhänglich und kinderlieb. ",
            name: "Rocky",
            rasse: "Deutsche Dogge"}
        ];
        
        spyOn(window, 'confirm').and.returnValue(true);
        spyOn(httpClient, 'delete').and.returnValue(
            Promise.resolve({
                json(){
                    return Promise.resolve({ status: 200 });
                }
            } as Response )
        );
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

        const elem = element as HundeComponent;
        await elem.delete('46b823da-6482-4823-a70f-ba0080fbb400');

        element.requestUpdate();
        await element.updateComplete;

        const cards = element.shadowRoot!.querySelectorAll('h5');
        expect(cards[0].textContent).toBe('Oskar');
        expect(cards[1].textContent).toBe('Rocky');
    });

    it('should do nothing if user cancels delete', async() =>{
        spyOn(window, 'confirm').and.returnValue(false);
        let httpClientSpy = spyOn(httpClient, 'delete');
        const elem = element as HundeComponent;
        await elem.delete('46b823da-6482-4823-a70f-ba0080fbb400');
        expect(httpClientSpy).toHaveBeenCalledTimes(0);
    });
    
})