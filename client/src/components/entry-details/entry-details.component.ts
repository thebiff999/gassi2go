import { customElement, LitElement, css, html, unsafeCSS, property} from "lit-element";
import { until } from 'lit-html/directives/until.js';
import { httpClient } from '../../http-client';
import { Entry } from '../../../../api-server/src/models/entry';

const entryComponentCSS = require('./entry-details.component.scss');

@customElement('app-entry-details')
class EntryComponent extends LitElement {

    static styles = [
        css`${unsafeCSS(entryComponentCSS)}`
    ]

    @property()
    entryId!: string;

    @property()
    entry!: Entry;

    render() {
        return html`
        <div class="container">
            <div class="row">
                <div class="col-sm-5">
                    <img src="${this.entry.imageUrl}" width="400px">
                </div>
                <div class="col-sm-7">
                    <p class="heading">${this.entry.dogName}</p>
                    <span class="attribute-container">
                        <p>${this.entry.dogRace}</p>
                        <p>${this.entry.pay}</p>
                        <p>${this.entry.date}</p>
                    </span>
                    <p>${this.entry.description}</p>
                </div>
            </div>
        </div>
        `
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchData();
    }

    async fetchData() {
        try {
            console.log("requesting entry");
            const response = await httpClient.get('/entries/' + this.entryId.toString());
            this.entry = await response.json();
        }
        catch ({message, statusCode}) {
            console.log(message);
            console.log(statusCode);
        }
    }

}