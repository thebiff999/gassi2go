/* Autor: Simon Flathmann */ 
import { css, customElement, html, LitElement, unsafeCSS } from "lit-element";

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

    render(){
        var dogs: Dog[] = [
            {id: 1, name: "Maja", breed: "Landseer"},
            {id: 2, name: "Bello", breed: "Golden-Retriever"},
            {id: 3, name: "Wackel", breed: "Dackel"},
            {id: 4, name: "Felix", breed: "Malteeser/Bolonka"}
        ]

        return html`
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>

        <div class="border border-success" id="outerDiv">
            <form>

                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="InputAuftrag">Auftragsart </label>
                        <select id="InputAuftrag" class="form-control">
                            <option selected>Gassi gehen</option>
                            <option>Hundebetreuung</option>
                        </select>
                    </div>
                    <div class="form-group col-md-6">
                        <label for="auftrag_datum">Datum</label>
                        <input type="date" class="form-control" id="auftrag_datum">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group col-md-6" id="InputDogs">
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
                    <label>Adress</label>
                    <input type="text" name="address" id="adress" onchange=${this.geocode()}>
                </div>

                <div class="form-row">
                    <div id="map"></div>
                    <div id="formAddress"></div>
                </div>

                <div class="form-group col-md-12">
                    <label for="auftragBeschreibung">Beschreibung</label>
                    <textarea class="form-control" id="auftragBeschreibung" rows="5" maxlength="500"
                    placeholder="Hier können Sie ihre Hunde beschreiben und alle wichtigen Informationen nennen. " ></textarea>
                </div>


            </form>
        </div>

        <script> 
            ${this.geocode()}
        </script>

        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" 
        integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" 
        integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
        `

        // return html`
        // <div>
        //     <form action="target_url" method="POST">
        //     <fieldset class="fieldset1">
        //         <legend>Auftrag erstellen</legend>
        //         XXXXX <h3>Wählen Sie die Art des Auftrages</h3>
        //             <fieldset>
        //                 <label for="auftrag_art">Auftragsart: </label>
        //                 <select name="art" id="auftrag_art" required>
        //                     <option value="gassi">Gassi gehen</option>
        //                     <option value="betreunung">Hundebetreuung</option>
        //                 </select>
        //             </fieldset>

                
        //         <h3>Kreuzen Sie die gewünschten Hunde an: </h3>
        //         <fieldset>
        //             <h4>Ihre Hunde: </h4>
        //             ${this.myDogs(dogs)}
        //         </fieldset>

        //         <h3>Wählen Sie Ihren Standort: </h3>
        //         <fieldset>
        //             <p>
        //                 <label for="auftrag_longitude">Longitude: </label>
        //                 <input type="number" name="longitude" id="auftrag_longitude">
        //             </p>
        //             <p>
        //                 <label for="auftrag_langitude">Langitude: </label>
        //                 <input type="number" name="langitude" id="auftrag_langitude">
        //             </p>
        //             <p>
        //             <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d157382.94035297004!2d7.
        //             484015413316863!3d51.95021390113208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.
        //             1!3m3!1m2!1s0x47b9bac399f760df%3A0x21eb4ca77bf328eb!2zTcO8bnN0ZXI!5e0!3m2!1sde!2sde!4v1618829391784!5m2!1sde!2sde"
        //             width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        //             </p>
        //         </fieldset>
        //         <h3>Wählen Sie ein Datum: </h3>
        //         <fieldset>
        //             <p>
        //                 <label for="auftrag_date">Datum</label>
        //                 <input type="date" name="datum" id="auftrag_date">
        //             </p>
        //         </fieldset>
        //         <h3>Hier können Sie eine Entlohnung einstellen</h3>
        //         <fieldset>
        //             <p>
        //                 <label for="auftrag_entlohnung"> Entlohnung
        //                 <input type="number" name="entlohnung" id="auftrag_entlohnung" min="0.00" step="0.01">
        //                 € </label>
        //             </p>
        //         </fieldset>
        
        //         <h3>Ergänzen Sie eine Beschreibung: </h3>
        //         <p>
        //             <textarea name="beschreibung" id="auftrag_lang" cols="50" rows="5"></textarea>
        //             <p>
        //                 <input type="submit" value="hinzufügen">
        //             </p>
        //         </p>
        //     </fieldset>
        
        //     <fieldset class="fieldset1">
        //         <h3>Auftrag erstellen</h3>
        //         <input type="submit" value="Erstellen">
        //         <input type="reset" value="Zurücksetzen">
        //     </fieldset>
        
        // </form>
        // </div>
        //`
        ;
    }

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
            var formAddressOut = `
                <ul class="list-group">
                <li class="list-group-item">${formAddress}</li>
                </ul>
            `;

            document.getElementById('formAddress')!.innerHTML = formAddressOut;
        })
        .catch(function(error: any){
            console.log(error);
        }); 
    }
        // var location = "GrevenerStraße 140 Münster";
        // var apiKey = "AIzaSyBIJrBGu5tN5FTvDRNIct4EyCGAF1BciOE"
        // var url: string = "https://maps.googleapis.com/maps/api/geocode/json";
        // var params = {adress: location, key: apiKey};

        // fetch(url + new URLSearchParams(params))
        // .then(function(response){
        //     console.log(response);
        // })
        // .catch(function(error){
        //     console.log(error);
        // })
        // .then(response => response.json())
        // .then(json => {
        //     let content = JSON.stringify(json);
        //     document.getElementById("result")!.innerText = content;
        // })
        // .catch(error => {
        //      alert(error);
        // });


/*
         axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
            params:{
                address: location,
                key: "AIzaSyBIJrBGu5tN5FTvDRNIct4EyCGAF1BciOE"
            }
        })
        .then(function(response: any){
            console.log(response);
        })
        .catch(function(error: any){
            console.log(error);
        }); 
    }
*/

    getCoordinates = () => {
        var address = document.getElementById("adress")?.nodeValue;
        var url = "https://geocoder.ls.hereapi.com/6.2.geocode.json?searchtext="+ address ;
    }

    initMap = () => {
        const myLatLng = { lat: 51.96396615536313, lng: 7.62374776280762 };
        const map = new google.maps.Map(document.getElementById("map")!, {
            zoom: 4,
            center: myLatLng
        });

        //Erstellt ein initiales Hilfefenster
        let infoWindow = new google.maps.InfoWindow({
            content: "Wähle deinen Ort!",
            position: myLatLng
        });
        infoWindow.open(map);

        map.addListener("click", (mapsMouseEvent) => {
            //Schließt das Hilfsfenster
            infoWindow.close();

            infoWindow = new google.maps.InfoWindow({
                position: mapsMouseEvent.latLng,
            });
            infoWindow.setContent(
                JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
            );
            infoWindow.open(map);
        })
    }
}