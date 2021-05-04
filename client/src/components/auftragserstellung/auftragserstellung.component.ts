/* Autor: Simon Flathmann */ 
import { css, customElement, html, LitElement, query, unsafeCSS } from "lit-element";

const auftragserstellungComponentSCSS = require('./auftragserstellung.component.scss');
const axios = require('axios').default;

interface Dog {
    id: number;
    name: string;
    breed: string;
}

@customElement('app-auftragserstellung')
class AuftragsErstellungComponent extends LitElement{

    static styles = [
        css`${unsafeCSS(auftragserstellungComponentSCSS)}`
    ]

    constructor(){
        super()
    }

    @query('form')
    form!: HTMLFormElement;

    @query('#inputAuftragArt')
    auftragArtElement!: HTMLFormElement;
    
    @query('#auftragDatum')
    auftragDatumElement!: HTMLFormElement;

    @query('#inputEntlohnung')
    auftragEntlohnung!: HTMLFormElement;

    @query('#inputStraße')
    straße!: HTMLFormElement;

    @query('inputHausNr')
    hausnr!: HTMLFormElement;

    @query('inputPLZ')
    plz!: HTMLFormElement;

    @query('inputOrt')
    ort!: HTMLFormElement;

    render(){
        var dogs: Dog[] = [
            {id: 1, name: "Maja", breed: "Landseer"},
            {id: 2, name: "Bello", breed: "Golden-Retriever"},
            {id: 4, name: "Felix", breed: "Malteeser/Bolonka"}
        ]

        return html`
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>

        <div class="border border-success" id="outerDiv">
            <form novalidate}">

                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="InputAuftragArt">Auftragsart </label>
                        <select id="inputAuftragArt" class="form-control">
                            <option selected>Gassi gehen</option>
                            <option>Hundebetreuung</option>
                        </select>
                    </div>
                    <div class="form-group col-md-6">
                        <label for="auftragDatum">Datum</label>
                        <input type="date" class="form-control" id="auftragDatum">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group col-md-6" id="inputDogs">
                        <label>Ihr Hunde</label>
                        ${this.myDogs(dogs)}
                    </div>

                    <div class="form-group col-md-6">
                        <label for="inputEntlohnung"> Entlohnung </label>
                        <div class="input-group d-inline-flex align-items-center w-auto">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroupPrepend">€</span>
                            </div>
                            <input type="number" min"0.00" step="0.05" id="inputEntlohnung" placeholder="Entlohnung" class="form-control">
                        </div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group col-md-9">
                        <label for="inputstraße">Straße </label>
                        <input type="text" class="form-control" id="inputStraße" placeholder="Beispielstraße">
                    </div>
                    <div class="form-group col-md-3">
                        <label for="inputHausNr">HausNr. </label>
                        <input type="text" class="form-control" id="inputHausNr" placeholder="42">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group col-md-3">
                        <label for="inputPLZ">PLZ</label>
                        <input type="number" class="form-control" id="inputPLZ" minlength="5" maxlength="5" placeholder="12345">
                    </div>
                    <div class="form-group col-md-9">
                        <label for="inputOrt">Ort</label>
                        <input type="text" class="form-control" id="inputOrt" placeholder="Musterort">
                    </div>
                </div>

                
                <div class="form-group col-md-12">
                    <label for="auftragBeschreibung">Beschreibung</label>
                    <textarea class="form-control" id="auftragBeschreibung" rows="5" maxlength="500"
                    placeholder="Hier können Sie ihre Hunde beschreiben und alle wichtigen Informationen nennen. " ></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group col-md-12">
                        <button class="btn btn-primary" type="submit" @click=${this.geocode}> Auftrag erstellen </button>
                    </div>
                </div>

            </form>
        </div>
        
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" 
        integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" 
        integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
        `
        ;
    }

    async submit() {
        console.log('submiting');
        if(this.checkInputs()){
            const auftragData = {
                auftragArt: this.auftragArtElement.value,
                auftragDatum: this.auftragDatumElement.value,
            }
            console.log(auftragData);
        } else{
            this.form.classList.add('was-validted');
        }
    }

    checkInputs(){
        console.log("checking inputs");
        return this.form.checkValidity();
    }

    /** dynamische Erstellung der Checkboxes für die vorhandenen Hunde. */
    myDogs = (dogs: Dog[]) => {
        const dogTemplates = [];
        var x = 0;
        for(const i of dogs){
            dogTemplates.push(html`
                <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck + ${x}">
                    <label class="custom-control-label" for="customCheck + ${x}">
                        ${i.name}
                    </label>
                </div>
            `)
            x++;
        }
        return html `${dogTemplates}`;
    }


    /** Geocode */
    geocode = () => {
        var location = "Grevenerstraße 140 48159 Münster";
        //location = this.straße.value + " " + this.hausnr.value + " " + this.plz.value + " " + this.ort.value;
        var endcodeURL = encodeURI(location);
        axios.get("https://api.tomtom.com/search/2/geocode/"+ endcodeURL + ".json", {
            params:{
                key: "H7fgXYLB4GN3FEtBLrnnxmwoI2A1ftXA"
            }
        })
        .then(function(response: any){
            //Response
            console.log(response);
            //Response Address
            console.log(response.data.results[0].address);
            console.log("Response Lat: " + response.data.results[0].position.lat);
            console.log("Response Lon: " + response.data.results[0].position.lon);
        })
        .catch(function(error: any){
            console.log(error);
        })
    }

/*  Alternative Geolocation-Implementierung für die GoogleMaps API.
    Diese benötigt eine Kreditkartenhinterlegung, um den Service nutzen zu können,
    weshalb auf die TomTom-API genutzt wurde. Unfertiger Stand.

     geocode = () => {
        var location = "22 Main st Boston MA";
        axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
            params:{
                address: location,
                key: "AIzaSyBIJrBGu5tN5FTvDRNIct4EyCGAF1BciOE"
            }
        })
        .then(function(response: any){
            //Response
            console.log(response);
            //Formatierte Adresse
            console.log(response.data.results[0].formatted_address);
            var formAddress = response.data.results[0].formatted_address;
            `;

            document.getElementById('formAddress')!.innerHTML = formAddressOut;
        })
        .catch(function(error: any){
            console.log(error);
        }); 
    } 
*/

}