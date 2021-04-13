import { customElement, html, LitElement, css, unsafeCSS } from "lit-element";
import { repeat } from 'lit-html/directives/repeat';
import { PageMixin } from "../page.mixin";

const entryComponentCSS = require('./entries.component.scss');

interface Entry {
    id: number;
    name: string;
    distance: number;
    image: string;
}

@customElement('app-entries')
class EntriesComponent extends PageMixin(LitElement) {

    static styles = [
        css`${unsafeCSS(entryComponentCSS)}`
    ]

    constructor(){
        super();
    }

    render() {
        var entries: Entry[] = [
            {id: 1, name: "Golden-Retriever", distance: 20, image: "https://i.imgur.com/XgbZdeA.jpg"},
            {id: 2, name: "Dackel", distance: 26, image: "https://i.imgur.com/N7K4w0J.jpg"},
            {id: 3, name: "Rottweiler", distance: 31, image: "https://i.imgur.com/26zaH5Y.jpg"}
        ];
        
        return html`<div class="entries">
        ${repeat(entries, entry => entry.id, entry =>
            html`
            <div class="entry" @click=${() => window.alert("you clicked the box")}>
            <img src=${entry.image} height="300" width="400">
            <p>Rasse: ${entry.name}</p>
            <p>Entfernung: ${entry.distance}</p>
            </div>
            `)}
        </div>`;
    }
}