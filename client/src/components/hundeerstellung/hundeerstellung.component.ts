import { css, customElement, html, LitElement, unsafeCSS } from "lit-element";

const hundeerstellungComponentSCSS = require('./hundeerstellung.component.scss');

@customElement('app-hundeerstellung')
class HundeerstellungComponent extends LitElement{

    static styles = [
        css`${unsafeCSS(hundeerstellungComponentSCSS)}`
    ]

    constructor(){
        super();
    }

    render(){
        return html`
            <h1>hundeerstellung</h1>
        `
    }
}