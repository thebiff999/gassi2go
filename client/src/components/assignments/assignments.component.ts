/* Autor: Dennis Heuermann */

import { customElement, LitElement, css, html, unsafeCSS, property, internalProperty} from "lit-element";
import { repeat } from 'lit-html/directives/repeat';
import { httpClient } from '../../http-client';
import { getDistance } from '../../distance';
import { Entry } from '../../../../api-server/src/models/entry';
import Cookies from 'js-cookie';
import { router } from '../../router';

const assignmentsComponentCSS = require('./assignments.component.scss');

@customElement('app-assignments')
class EntryComponent extends LitElement {

    static styles = [
        css`${unsafeCSS(assignmentsComponentCSS)}`
    ]

    @internalProperty()
    private assignments: Entry[] = [];

    location = {lat: 0, lng: 0};

    render() {
        let template = html`
        <div class="container">
            <div class="list">
                ${repeat(this.assignments, assignment => assignment.id, assignment =>
                html`
                <div class="list-item shadow">
                    <span class="image">
                        <img src="${assignment.imageUrl}">
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
                `)}
            </div>
        </div>
        `
        return template;
    }

    navigateBack() {
        history.back();
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
        requestBody.status = 'assigned';
        try {
            console.log('patch-request');
            console.log(requestBody);
            const response = await httpClient.patch('/entries/' + assignment.id, requestBody);
            console.log(response);
        }
        catch (error: any) {
            console.log(error);
        }
        
    }

    async firstUpdated() {
        //request entries from api-server
        try {
            const response = await httpClient.get('/entries/assigned');
            this.assignments = (await response.json()).results;
        }
        catch ({message, statusCode}) {
            console.log(message);
            console.log(statusCode);
        }
        this.location.lat = parseFloat(Cookies.get('lat')!);
        this.location.lng = parseFloat(Cookies.get('lng')!);
    }

}