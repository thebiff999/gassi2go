/* Autor: Dennis Heuermann */

import { customElement, LitElement, css, html, unsafeCSS, property, internalProperty} from "lit-element";
import { PageMixin } from '../page.mixin';
import { repeat } from 'lit-html/directives/repeat';
import { httpClient } from '../../http-client';
import { getDistance } from '../../distance';
import { Entry } from '../../../../api-server/src/models/entry';
import Cookies from 'js-cookie';
import { router } from '../../router';

const assignmentsComponentCSS = require('./assignments.component.scss');

@customElement('app-assignments')
class EntryComponent extends PageMixin(LitElement) {

    static styles = [
        css`${unsafeCSS(assignmentsComponentCSS)}`
    ]

    @internalProperty()
    private assignments: Entry[] = [];

    location = {lat: 0, lng: 0};

    render() {
        let template = html`
        ${this.renderNotification()}
        <div class="container">
            <div class="list">
                ${repeat(this.assignments, assignment => assignment.id, assignment =>
                html`
                <div class="list-item">
                    <div class="desktop shadow">
                        <span class="image">
                            <img src="${assignment.imgData}">
                        </span>
                        <span class="name">
                            ${assignment.dogName}
                        </span>
                        <span class="date">
                            <p>${assignment.date}</p>
                        </span>
                        <span class="type">
                            <p>${this.renderType(assignment)}</p>
                        </span>
                        <span class="distance">
                            <p>${getDistance(assignment.lat, assignment.lng, this.location.lat, this.location.lng)} km</p>
                        </span>
                        <span class="pay">
                            <p>${assignment.pay}€</p>
                        </span>
                        <span class="button">
                            <i class="fas fa-check fa-2x" @click="${() => this.submit(assignment)}"></i>
                        </span>
                    </div>
                    <div class="row mobile shadow">
                        <div class="col-sm-6 image">
                            <img src="${assignment.imgData}">
                        </div>
                        <div class="col-sm-6 details">
                            <p>${assignment.dogName}</p>
                            <span>
                                <p>${assignment.date}</p>
                                <p>${this.renderType(assignment)}</p>
                                <p>${getDistance(assignment.lat, assignment.lng, this.location.lat, this.location.lng)} km</p>
                                <p>${assignment.pay}€</p>
                            </span>
                            <button @click=${() => this.submit(assignment)} class="btn btn-primary">Erledigt <i class="fas fa-check"></i></button>
                        </div>
                    </div>
                </div>
                `)}
            </div>
        </div>
        `
        return template;
    }

    renderType(assignment: Entry) {
        let content;
        if (assignment.type == 'walk') {
            content = html`Gassi gehen`
        }
        else {
            content = html`Aufpassen`
        }
        return content;
    }

    async submit(assignment: Entry) {
        let requestBody = assignment;
        requestBody.status = 'done';
        try {
            console.log('patch-request');
            console.log(requestBody);
            const response = await httpClient.patch('/entries/id/' + assignment.id, requestBody);
            console.log(response);
            let notification = 'Auftrag erledigt';
            this.setNotification({ infoMessage: notification });
            this.deleteEntry(assignment.id);
            this.requestUpdate();
        }
        catch ({ message }) {
            this.setNotification({ errorMessage: message });
        }
        
    }

    async firstUpdated() {
        //request entries from api-server
        try {
            const response = await httpClient.get('/entries/assigned');
            this.assignments = (await response.json()).results;
            if (this.assignments.length == 0) {
                this.setNotification({infoMessage: 'Keine zugeordneten Aufträge'});
            }
        }
        catch ({message, statusCode}) {
            switch (statusCode) {
                case 401:
                    router.navigate('/user/sign-in');
                    break;
                case 404:
                    this.setNotification({infoMessage: 'Keine zugeordneten Aufträge'});
                    break;
                default:
                    this.setNotification({errorMessage: message});
            }
        }
        let cookies = Cookies.get();
        if(cookies.lat) {
            this.location.lat = parseFloat(cookies.lat);
            this.location.lng = parseFloat(cookies.lng);
        }
    }

    deleteEntry(id: string) {
        console.log('before delete');
        console.log(this.assignments);
        for (let i=0; i < this.assignments.length; i++) {
            if (this.assignments[i].id == id) {
                this.assignments.splice(i,1);
            }
        }
        console.log('after delete');
        console.log(this.assignments);
    }

}