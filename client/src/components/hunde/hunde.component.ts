import { css, customElement, html, internalProperty, LitElement, unsafeCSS } from "lit-element";
import { repeat } from 'lit-html/directives/repeat';
import { Hund } from "../../../../api-server/src/models/hunde";
import { httpClient } from "../../http-client";

const hundeComponentSCSS = require('./hunde.component.scss');

@customElement('app-hunde')
class HundeComponent extends LitElement{

    static styles = [
        css`${unsafeCSS(hundeComponentSCSS)}`
    ]

    @internalProperty()
    private hunde: Hund[] = [];

    constructor(){
        super();
    }

    render(){
        return html`
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
            integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
            <div id="hunde" class="container-fluid">
                <div class="card-deck">
                    ${repeat(this.hunde, (hund) => hund.besitzerId, (hund, index) =>
                        html`
                        <div class="card sm-6">
                            <img class="card-img-top" src="${hund.image}"  alt="hunde-image">
                            <div class="card-body">
                                <h5 class="card-title">${hund.name}</h5>
                                <p class="card-text">${hund.rasse}</p>
                                <p class="card-text">${hund.gebDate}</p>
                                <p class="card-text">${hund.infos}</p>
                            </div>
                        </div>
                        `)}
                </div>
            </div>
        `
    }

    async firstUpdated(){
        try{
            const response = await httpClient.get('/hunde');
            const responseJSON = await response.json();
            this.hunde = responseJSON.results;
            console.log(this.hunde);
        }
        catch({message, statusCode}){
            console.log(message);
            console.log(statusCode);
        }
    }
}