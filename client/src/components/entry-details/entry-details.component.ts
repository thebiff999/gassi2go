/* Autor: Dennis Heuermann */

import { customElement, LitElement, css, html, unsafeCSS, property, internalProperty} from "lit-element";
import { httpClient } from '../../http-client';
import { Entry } from '../../../../api-server/src/models/entry';
import { router } from '../../router';
import { PageMixin } from "../page.mixin";

const entryDetailsComponentCSS = require('./entry-details.component.scss');

@customElement('app-entry-details')
class EntryComponent extends PageMixin(LitElement) {

    static styles = [
        css`${unsafeCSS(entryDetailsComponentCSS)}`
    ]

    @property()
    entryId!: string;

    entry!: Entry;

    render() {
        let template = html`

        <div class="container">
            <div class="row">
                <div class="col-sm-12 col-lg-5 image">
                    <i class="fas fa-arrow-circle-left fa-3x back-button hover-button mobile-button" style="color: white" @click="${this.navigateBack}"></i>
                    <img class="img-fluid" src="${this.entry?.imageUrl}">
                </div>
                <div class="h-100 col-sm-12 col-lg-7">
                        <div class="details">
                        <i class="fas fa-arrow-circle-left fa-lg back-button hover-button desktop-button" style="color: blue" @click="${this.navigateBack}"></i>
                        <p class="heading">${this.entry?.dogName}</p>
                        <span class="flex-container">
                            <p>${this.entry?.dogRace}</p>
                            ${this.renderType()}
                            <p>${this.entry?.pay}€</p>
                            <p>${this.entry?.date}</p>
                        </span>
                        <p>${this.entry?.description}</p>
                        <button @click=${this.submit} class="btn btn-primary">${this.renderButton()}</button>
                    </div>
                </div>
            </div>
        </div>
        `
        return template;
    }

    navigateBack() {
        history.back();
    }

    renderButton() {
        let content;
        if (this.entry?.type == 'walk') {
            content = html`Ich führe dich aus <i class="fas fa-paw"></i>`
        }
        else {
            content = html`Ich passe auf dich auf <i class="fas fa-bone"></i>`
        }
        return content;
    }

    renderType() {
        let content;
        if (this.entry?.type == 'walk') {
            content = html`<p>Gassi</p>`
        }
        else {
            content = html`<p>Aufpassen</p>`
        }
        return content;
    }

    async submit() {
        let requestBody = this.entry;
        requestBody.status = 'assigned';
        try {
            console.log('patch-request');
            console.log(requestBody);
            const response = await httpClient.patch('/entries/id/' + this.entryId, requestBody);
            let notification = 'Du hast den Auftrag angenommen und kannst ihn unter Meine Aufträge finden';
            this.setNotification({ infoMessage: notification });
            setTimeout(this.navigateBack, 6000);
        }
        catch ({message}) {
            this.setNotification({ errorMessage: message });
        }
        
    }

    async firstUpdated() {

        try {
            const response = await httpClient.get('/entries/id/' + this.entryId);
            this.entry = await response.json();
            await this.requestUpdate();
          } catch ({ message, statusCode }) {
              switch (statusCode) {
                case 401:
                    router.navigate('/user/sign-in');
                case 403:
                    this.setNotification({ infoMessage: 'Der Eintrag ist bereits einem anderen User zugeordnet'});
                default:
                    this.setNotification({ errorMessage: message });
              }
          }

    }

}