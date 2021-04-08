/* Autor: Simon Flathmann */

import { css, customElement, html, LitElement, property, unsafeCSS } from "lit-element";

const headerComponentSCSS = require('./header.component.scss');

@customElement('app-header')
class Header extends LitElement{
    
    static styles = [
        css`${unsafeCSS(headerComponentSCSS)}`
    ]

    @property()
    title = '';

    constructor(){
        super();
    }

    render(){
        return html`
        <nav>
            <div class="logo">
                <h2>${this.title}</h2>
            </div>
            <ul class="nav-links">
                <li><a href="#">Sign-In</a></li>
                <li><a href="#">Sign-Out</a></li>
                <li><a href="#">Log-Out</a></li>
            </ul>
            <div class="arrow">
                <div class="leftLine"></div>
                <div class="rightLine"></div>
            </div>
        </nav>
        `;
    }
}