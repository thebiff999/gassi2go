import { customElement, html, LitElement, css, unsafeCSS } from "lit-element";
import { repeat } from 'lit-html/directives/repeat';
import { PageMixin } from "../page.mixin";
import { Loader } from "@googlemaps/js-api-loader";
import {} from 'google.maps';
import { Modal } from 'bootstrap';

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

    modal: Modal | undefined;
    map: google.maps.Map | undefined;
    location: Coords | undefined;

    static styles = [
        css`${unsafeCSS(entryComponentCSS)}`
    ]

    constructor(){
        super();
        this.location = {lat:0, lng:0};
    }

    render() {
        var entries: Entry[] = [
            {id: 1, name: "Golden-Retriever", coords: {lat: 51.96246, lng: 7.62581}, distance: 20, image: "https://i.imgur.com/XgbZdeA.jpg"},
            {id: 2, name: "Dackel", coords: {lat: 51.96258, lng: 7.62591}, distance: 26, image: "https://i.imgur.com/N7K4w0J.jpg"},
            {id: 3, name: "Rottweiler", coords: {lat: 51.96346, lng: 7.62481}, distance: 31, image: "https://i.imgur.com/26zaH5Y.jpg"},
            {id: 1, name: "Golden-Retriever", coords: {lat: 51.96246, lng: 7.62581}, distance: 20, image: "https://i.imgur.com/XgbZdeA.jpg"},
            {id: 2, name: "Dackel", coords: {lat: 51.96258, lng: 7.62591}, distance: 26, image: "https://i.imgur.com/N7K4w0J.jpg"},
            {id: 3, name: "Rottweiler", coords: {lat: 51.96346, lng: 7.62481}, distance: 31, image: "https://i.imgur.com/26zaH5Y.jpg"},{id: 1, name: "Golden-Retriever", coords: {lat: 51.96246, lng: 7.62581}, distance: 20, image: "https://i.imgur.com/XgbZdeA.jpg"},
            {id: 2, name: "Dackel", coords: {lat: 51.96258, lng: 7.62591}, distance: 26, image: "https://i.imgur.com/N7K4w0J.jpg"},
            {id: 3, name: "Rottweiler", coords: {lat: 51.96346, lng: 7.62481}, distance: 31, image: "https://i.imgur.com/26zaH5Y.jpg"},{id: 1, name: "Golden-Retriever", coords: {lat: 51.96246, lng: 7.62581}, distance: 20, image: "https://i.imgur.com/XgbZdeA.jpg"},
            {id: 2, name: "Dackel", coords: {lat: 51.96258, lng: 7.62591}, distance: 26, image: "https://i.imgur.com/N7K4w0J.jpg"},
            {id: 3, name: "Rottweiler", coords: {lat: 51.96346, lng: 7.62481}, distance: 31, image: "https://i.imgur.com/26zaH5Y.jpg"}
        ];

        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
        
        <div id="locationModal" class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Modal title</h5>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Modal body text goes here.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="${this.askforLocation}">Standort freigeben</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div>
            <button id="toggle-btn" class="btn btn-success toggle-btn" @click=${this.toggleView}>
                Zur Kartenansicht
            </button>
        </div>

        <div id="entries" class="container-fluid">
            <div class="row row-cols-3 row-cols-xxl-4 g-3 g-xxl-5">
                ${repeat(entries, entry => entry.id, entry =>
                html`
                <div class="col">
                    <div class="card shadow entry">
                        <div class="card-body">
                            <img class ="card-img-top" src=${entry.image} height="300px" width="400px">
                            <p>Rasse: ${entry.name}</p>
                            <p>Entfernung: ${entry.distance} km</p>
                            <a href="#" class="btn btn-primary">Führ mich aus</a>
                        </div>
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
        var button = this.shadowRoot?.querySelector('#toggle-btn') as HTMLElement;
        if (button!.innerText == "Zur Kartenansicht") {
            button!.innerText = "Zur Kachelansicht";
        }
        else {
            button!.innerText = "Zur Kartenansicht";
        }
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
        //create the Google Maps
        this.createMap();

        //call modal for User Location
        /*let modal = this.shadowRoot?.querySelector('#locationModal') as HTMLElement;
        this.modal = new Modal(modal, {backdrop: 'static', keyboard: false});
        this.modal.show();*/
        
    }
    askforLocation() {
        navigator.geolocation.getCurrentPosition(
            pos => {
                this.location!.lat = pos.coords.latitude;
                this.location!.lng = pos.coords.longitude;
                alert(this.location!.lat + ' ' + this.location!.lng);
                this.modal?.hide();
            },
            error => alert('Standort wurde nicht freigegeben')
            );
    }

    addMarker(entry: Entry) {
        var marker = new google.maps.Marker({
            position: entry.coords,
            map: this.map
        });
    }

    getDistance(pos1: Coords, pos2: Coords) {
        var rad = function(x: number) {
            return x * Math.PI / 180;
        }

        var R = 6378137;
        var dLat = rad(pos2.lat - pos1.lat);
        var dLong = rad(pos2.lng - pos1.lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(pos1.lat)) * Math.cos(rad(pos2.lat)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = (R * c) / 1000;
        return d; // returns the distance in kilometer
    }
}