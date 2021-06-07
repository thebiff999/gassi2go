import { css, customElement, html, internalProperty, LitElement, unsafeCSS } from "lit-element";
import { repeat } from 'lit-html/directives/repeat';
import { Hund } from "../../../../api-server/src/models/hunde";
import { httpClient } from "../../http-client";
import { PageMixin } from '../page.mixin';

const hundeComponentSCSS = require('./hunde.component.scss');

@customElement('app-hunde')
class HundeComponent extends PageMixin(LitElement){

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
            <div id="link-div"> 
                <a href="/user/dogs/new" class="btn-routing">Hund hinzufügen</a>
            </div>
            <div id="hunde" class="container-fluid">
                <div class="row">
                    ${repeat(this.hunde, (hund) => hund.besitzerId, (hund) =>
                        html`
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xxl-3">
                                    <div class="card text-center m-4 p-3 rounded-lg shadow-lg" id="dogcard">
                                        <div class="card-block" m-md-2> 
                                            <img class="img-fluid border" id="dogimg" src="${hund.imgPath}" alt="hunde image">
                                            <div class="card-titl m-1">
                                                <h5>${hund.name}</h5>
                                            </div> 
                                            <div class="card-text">Rasse: ${hund.rasse}</div>
                                            <div class="card-text mb-2">Geb.: ${hund.gebDate}</div>
                                            <div class="card-text mb-2">${hund.infos}</div>
                                            <div>
                                                <button @click="${() => this.pet(hund.name)}" class="btn btn-light"><i class="far fa-heart"></i> Streicheln</button>
                                                <button @click="${() => this.delete(hund.id, hund.imgPath)}" class="btn btn-light"><i class="far fa-trash-alt"></i> Löschen </button>
                                            </div>
                                        </div>
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

    async delete(id: string, path: string){
        if(confirm('Möchten Sie den Hund wirklich löschen?')){
            try{
                await httpClient.delete(`/hunde/${id}`);
                this.hunde = this.hunde.filter(hund => hund.id !== id);
            }
            catch({message}){
                this.setNotification({ errorMessage: message });
            }
        }
    }
    
    async pet(name: string){
        const rndInt = Math.floor(Math.random() * 4) + 1;
        if(rndInt === 1){
            alert(`Du hast ${name} nur leicht berührt und trotzdem wirkt ${name} schon sehr glücklich!`);
        }
        if(rndInt === 2){
            alert(`${name} hat es sehr gefallen und wedelt vor Freude mit dem Schwanz.`);
        }
        if(rndInt === 3){
            alert(`${name} bellt vor Freude.`);
        }
        if(rndInt === 4){
            alert(`${name} dreht sich vor Freude im Kreis.`)
        }
    }
}