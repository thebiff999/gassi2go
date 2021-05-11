import { customElement, LitElement, css, html, unsafeCSS } from "lit-element";

const entryComponentCSS = require('./entry.component.scss');

@customElement('app-entry')
class EntryComponent extends LitElement {
    static styles = [
        css`${unsafeCSS(entryComponentCSS)}`
    ]    
}