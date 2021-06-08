import { LitElement } from 'lit-element';
import './hunde.component';

describe('app-hunde', () => {
    let element: LitElement;

    beforeEach(()=>{
        element = document.createElement('app-hunde') as LitElement;
        document.body.appendChild(element);
    });

    afterEach(() => {
        element.remove();
    })

    
})