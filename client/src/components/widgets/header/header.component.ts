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

                <div class="arrow" @click="${this.toggleDropdown}">
                    <div class="leftLine"></div>
                    <div class="rightLine"></div>
                </div>

                <div class="profil">
                    <a href="#">
                        <img id="profil-img" src="./../../../../resources/images/own_profil_icon_v2.png">
                    </a>
                </div>

                <a href="#" class="auftrag-link">
                    <h3>Auftrag erstellen</h3>
                </a>
            </div>

            <ul class="toggle-links" part="toggle-links-part">
                <li><a href="#">Auftrag suchen</a></li>
                <li><a href="#">Meine Aufträge</a></li>
                <li><a href="#">Meine Hunde</a></li>
                <li><a href="#">Abmelden</a></li>
             </ul>

        </nav>
        `;
    }

    //Click-Event, dass das Dropdown-Menü öffnet, die Links verzögert einblendet und für die Animation des Pfeils sorgt 
    toggleDropdown = () => {
        const root = document.querySelector("app-root");
        const header = root?.shadowRoot?.querySelector("app-header");
        const links = header?.shadowRoot?.querySelector(".toggle-links");
        const toggleLinks = header?.shadowRoot?.querySelectorAll<HTMLElement>(".toggle-links li");
        const arrow = header?.shadowRoot?.querySelector(".arrow");

        links?.classList.toggle("toggle-active");
        
        arrow?.classList.toggle("flip");

        toggleLinks?.forEach((link, index) => {
            if(link.style.animation){
                link.style.animation = '';
            }
            else{
                link.style.animation = `toggleLinkAnimation 1s ease forwards ${index/4 + 0.6}s`;
            }
        });
    }

}
