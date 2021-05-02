import { customElement, html, LitElement, css, unsafeCSS } from "lit-element";
import { repeat } from 'lit-html/directives/repeat';
import { PageMixin } from "../page.mixin";
import { Loader } from "@googlemaps/js-api-loader";
import {} from 'google.maps';

const entryComponentCSS = require('./entries.component.scss');

interface Coords {
    lat: number;
    lng: number;
}

interface Entry {
    id: number;
    name: string;
    coords: Coords;
    distance: number;
    image: string;
}

@customElement('app-entries')
class EntriesComponent extends PageMixin(LitElement) {

    map: google.maps.Map | undefined;

    static styles = [
        css`${unsafeCSS(entryComponentCSS)}`
    ]

    constructor(){
        super();
    }

    render() {
        var entries: Entry[] = [
            {id: 1, name: "Golden-Retriever", coords: {lat: 51.96246, lng: 7.62581}, distance: 20, image: "https://i.imgur.com/XgbZdeA.jpg"},
            {id: 2, name: "Dackel", coords: {lat: 51.96258, lng: 7.62591}, distance: 26, image: "https://i.imgur.com/N7K4w0J.jpg"},
            {id: 3, name: "Rottweiler", coords: {lat: 51.96346, lng: 7.62481}, distance: 31, image: "https://i.imgur.com/26zaH5Y.jpg"}
        ];

        return html`
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <div>
            <button class="toggle-btn" @click=${this.toggleView}>
                Ansicht wechseln
            </button>
        </div>

        <div id="entries" class="container">
            <div class="row align-items-start">
                ${repeat(entries, entry => entry.id, entry =>
                html`
                <div class="col card entry" @click=${() => window.alert("you clicked the box")}>
                    <img class ="card-img-top" src=${entry.image} height="300px" width="400px">
                    <div class="card-body">
                        <p>Rasse: ${entry.name}</p>
                        <p>Entfernung: ${entry.distance}</p>
                        <a href="#" class="btn btn-primary">Führ mich aus</a>
                    </div>
                </div>
            `)}
            </div>
        </div>
        <div id="map-container" class="inactive">
            <div id="map">
            </div>
        </div>
        `;

    }

    toggleView = () => {
        var entries = this.shadowRoot?.querySelector('#entries');
        var map = this.shadowRoot?.querySelector('#map-container');
        entries?.classList.toggle('inactive');
        map?.classList.toggle('inactive');
    }

    createMap() { 

        var entries: Entry[] = [
            {id: 1, name: "Golden-Retriever", coords: {lat: 51.95276, lng: 7.62571}, distance: 20, image: "https://i.imgur.com/XgbZdeA.jpg"},
            {id: 2, name: "Dackel", coords: {lat: 51.96258, lng: 7.62591}, distance: 26, image: "https://i.imgur.com/N7K4w0J.jpg"},
            {id: 3, name: "Rottweiler", coords: {lat: 51.96346, lng: 7.62481}, distance: 31, image: "https://i.imgur.com/26zaH5Y.jpg"}
        ];

        //Create Google Maps
        const loader = new Loader({
            apiKey: "AIzaSyApvgXYHn99FigrI9QuMMfrIbxHqiEY1yA",
            version: "weekly"
        });
        loader.load().then(() => {
            this.map = new google.maps.Map(this.shadowRoot?.querySelector('#map') as HTMLElement, {
              center: { lat: 51.96236, lng: 7.62571 },
              zoom: 13,
              disableDefaultUI: true
            });
          }).then(() => {
            for (let i=0; i < entries.length; i++) {
                this.addMarker(entries[i]);
              }
          });
    }

    async firstUpdated() {
        this.createMap();
        /*navigator.geolocation.getCurrentPosition(
            pos => alert(pos.coords.latitude + ', ' + pos.coords.longitude),
            error => alert('Error code: ' + error.code)
            );*/
    }

    addMarker(entry: Entry) {
        var marker = new google.maps.Marker({
            position: entry.coords,
            map: this.map
        });
    }
}