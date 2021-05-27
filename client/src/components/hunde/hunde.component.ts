import { css, customElement, html, LitElement, unsafeCSS } from "lit-element";

const hundeComponentSCSS = require('./hunde.component.scss');

@customElement('app-hunde')
class HundeComponent extends LitElement{

    static styles = [
        css`${unsafeCSS(hundeComponentSCSS)}`
    ]

    constructor(){
        super();
    }

    render(){
        return html`
            <h1>hundeübersicht</h1>
        `
    }
}