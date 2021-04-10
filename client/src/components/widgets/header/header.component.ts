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

            <div class="header-left">
                <div class="logo">
                    <img id="logo-img" src="./../../../../resources/images/dog_logo.png">
                </div>
                <div class="gassi2go">
                    <h2>Gassi2Go</h2>
                </div>
            </div>

            <div class="header-mid">
                <div class="title">
                    <h2>${this.title}</h2>
                </div>
            </div>

            <div class="header-right">

                <div class="arrow">
                    <div class="leftLine"></div>
                    <div class="rightLine"></div>
                </div>

                <div class="profil">
                    <img id="profil-img" src="./../../../../resources/images/own_profil_icon_v2.png">
                </div>

                <ul class="auftrag-link">
                    <li><a href="#">Auftrag erstellen</a></li>
                </ul>
            </div>

            <ul class="toggle-links">
                <li><a href="#">Auftrag suchen</a></li>
                <li><a href="#">Meine Aufträge</a></li>
                <li><a href="#">Meine Hunde</a></li>
                <li><a href="#">Abmelden</a></li>
            </ul>


        </nav>
        `;
    }
}

// .auftrag-link{
//     display: flex;
//     justify-content: space-around;
//     width: 100%;
//     margin-left: 15px;
//     margin-right: 15px;
// }

// .auftrag-link li{
//     list-style: none;
// }

// .auftrag-link a{
//     letter-spacing: 3px;
//     font-size: 25px;
//     color: white;
//     text-decoration: none;
// }