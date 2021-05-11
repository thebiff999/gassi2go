/* Autor: Simon Flathmann */ 
import { css, customElement, html, LitElement, query, queryAll, unsafeCSS } from "lit-element";

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

    @queryAll('.form-check-input')
    hundeElement?: NodeListOf<HTMLInputElement>;
    
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

        <div class="border border-success" id="outerDiv">
            <form class="needs-validation" novalidate>

                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="InputAuftragArt">Auftragsart </label>
                        <select id="inputAuftragArt" class="form-control">
                            <option value="Gassi" selected>Gassi gehen</option>
                            <option value="Betreuung">Hundebetreuung</option>
                        </select>
                    </div>
                    <div class="form-group col-md-6">
                        <label for="auftragDatum">Datum</label>
                        <input type="date" class="form-control" id="auftragDatum" required>
                        <div class="invalid-feedback"> Bitte wähle ein valides Datum. </div>
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
                            <input type="number" value="0.00" min="0" step="0.1" id="inputEntlohnung" placeholder="Entlohnung" class="form-control" required>
                            <div class="invalid-feedback"> Die Entlohnung ist erforderlich und darf nicht im negativen Bereich liegen. </div>
                        </div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group col-md-9">
                        <label for="inputstraße">Straße</label>
                        <input type="text" class="form-control" id="inputStraße" placeholder="Beispielstraße" required>
                        <div class="invalid-feedback"> Eine Straße ist erforderlich. </div>
                    </div>
                    <div class="form-group col-md-3">
                        <label for="inputHausNr">HausNr.</label>
                        <input type="text" class="form-control" id="inputHausNr" placeholder="42" maxlength="5" required>
                        <div class="invalid-feedback"> Die Hausnummer ist erforderlich und muss gültig sein. </div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group col-md-3">
                        <label for="inputPLZ">PLZ</label>
                        <input type="text" class="form-control" id="inputPLZ" pattern="[0-9]{5}" placeholder="12345" required>
                        <div class="invalid-feedback"> Bitte geben Sie eine gültige Postleitzahl ein. </div>
                    </div>
                    <div class="form-group col-md-9">
                        <label for="inputOrt">Ort</label>
                        <input type="text" class="form-control" id="inputOrt" placeholder="Musterort" required>
                        <div class="invalid-feedback"> Bitte geben Sie ihren Ort ein. </div>
                    </div>
                </div>

                
                <div class="form-group col-md-12">
                    <label for="auftragBeschreibung">Beschreibung</label>
                    <textarea class="form-control" id="auftragBeschreibung" rows="5" minlength="30" maxlength="900" required
                    placeholder="Hier können Sie ihre Vierbeiner beschreiben und alle wichtigen Informationen nennen. Bei der Hundebetreuung sollte Sie hier angeben, wie lange auf den Hund aufgepasst werden soll. " ></textarea>
                    <div class="invalid-feedback"> Die Beschreibung ist erforderlich und muss 30 bis 900 Buchstaben lang sein. </div>
                </div>

                <div class="form-row">
                    <div class="form-group col-md-12">
                        <button class="btn btn-primary" type="button" @click="${this.submit}"> Auftrag erstellen </button>
                    </div>
                </div>

            </form>
        </div>
        `
        ;
    }

    updated(){
        this.setMinDate();
    } 

    /** Methode zum dynamischen Setzen des Min-Attributs für das Auftragsdatum */
    setMinDate = () => {
        var today = new Date();
        var ddNum = today.getDate();
        var dd = today.getDate().toString();

        var mmNum = today.getMonth() + 1;  //Januar starts at 0
        var mm = mmNum.toString();

        var yyyyNum = today.getFullYear();
        var yyyy = yyyyNum.toString();

        if(ddNum < 10){
            dd = '0' + dd;
        }
        if(mmNum < 10){
            mm = '0' + mm;
        }

        var todayStr = yyyy+'-'+mm+'-'+dd;
        console.log("Auftragdatum: Setzen von Attribut min: " + todayStr);
        const root = document.querySelector("app-root");
        const auftragserstellung = root?.shadowRoot?.querySelector("app-auftragserstellung");
        auftragserstellung?.shadowRoot?.getElementById("auftragDatum")?.setAttribute("min", todayStr);
    }


    async submit() {
        console.log('submiting');
        if(this.checkInputs()){
            const auftragData = {
                auftragArt: this.auftragArtElement.value,
                auftragDatum: this.auftragDatumElement.value
            }
            console.log(auftragData);
        } 
        else{
            console.log("validation failed")

            this.form.classList.add('was-validated');
        }
    }

    checkInputs(){
        const root = document.querySelector("app-root");
        const auftragserstellung = root?.shadowRoot?.querySelector("app-auftragserstellung");
        const dogDivs = auftragserstellung?.shadowRoot?.getElementById("inputDogs")?.children;
        const listArray = Array.from(dogDivs!);
        var checked = 0;

        //Überprüfung, ob mind. eine der Checkboxen checked ist. Falls ja, wird der der Wert von checked auf 1 gesetzt.
        //Die if-Bedinungen dienen der Fehlerprävention.
        listArray.forEach((item) => {
            if(item.className == "form-check"){
                if(item.children[0].className == "form-check-input"){
                    console.log("form-check-input found");
                    let ele = item.children[0] as HTMLInputElement;
                    if(ele.checked){
                        checked = 1;
                    }
                }
            }
        });
        if(checked == 0){
            console.log(this.hundeElement);
            for(let l=0; l < this.hundeElement!.length; l++){
                if(l == this.hundeElement!.length-1){
                    this.hundeElement![l].setCustomValidity('Bitte wählen Sie mindestens einen Hund aus.');
                    this.hundeElement![l].reportValidity();
                } else{
                    this.hundeElement![l].setCustomValidity(' ');
                    this.hundeElement![l].reportValidity();
                }
            }
        }

        return this.form.checkValidity();
    }

    /** dynamische Erstellung der Checkboxes für die vorhandenen Hunde. */
    myDogs = (dogs: Dog[]) => {
        const dogTemplates = [];
        var x = 0;
        for(const i of dogs){
            dogTemplates.push(html`
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="customCheck + ${x}">
                    <label class="form-check-label" for="customCheck + ${x}">
                        ${i.name}
                    </label>
                    <div class="invalid-feedback"></div>
                </div>
            `)
            x++;
        }
        return html `${dogTemplates}`;
    }


//     <div class="custom-control custom-checkbox">
//     <input type="checkbox" class="custom-control-input" id="customCheck + ${x}">
//     <label class="custom-control-label" for="customCheck + ${x}">
//         ${i.name}
//     </label>
// </div>

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