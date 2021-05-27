import { customElement, LitElement, css, html, unsafeCSS, property } from "lit-element";
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

    entry!: Entry;

    render() {
        return html`
        <h1>entry no: ${this.entryId}</h1>
        `
    }

    async firstUpdated() {
        const response = await httpClient.get('/tasks/' + this.entryId);
        this.entry = await response.json();
        await this.requestUpdate();
    }

}