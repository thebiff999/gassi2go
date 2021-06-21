/* Autor: Simon Flathmann */

/* eslint-disable prettier/prettier */  //Muss wegen der Form deaktiviert werden
/* eslint-disable @typescript-eslint/no-explicit-any */

import { css, customElement, html, internalProperty, LitElement, query, unsafeCSS } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { Hund } from '../../../../api-server/src/models/hunde';
import { router } from '../../router';
import { httpClient } from '../../http-client';
import { PageMixin } from '../page.mixin';

const auftragserstellungComponentSCSS = require('./auftragserstellung.component.scss');
const axios = require('axios').default;

/* Custom-Element zur Erstellung von neuen Aufträgen */
@customElement('app-auftragserstellung')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class AuftragsErstellungComponent extends PageMixin(LitElement) {
  static styles = [
    css`
      ${unsafeCSS(auftragserstellungComponentSCSS)}
    `
  ];

  @internalProperty()
  private hunde: Hund[] = [];

  @internalProperty()
  private lat = 0;

  @internalProperty()
  private lng = 0;

  constructor() {
    super();
  }

  @query('form')
  form!: HTMLFormElement;

  @query('#inputAuftragArt')
  auftragArt!: HTMLInputElement;

  @query('#inputHunde')
  auftragHund!: HTMLInputElement;

  @query('#auftragDatum')
  auftragDatum!: HTMLInputElement;

  @query('#inputEntlohnung')
  auftragEntlohnung!: HTMLInputElement;

  @query('#inputStraße')
  straße!: HTMLInputElement;

  @query('#inputHausNr')
  hausnr!: HTMLInputElement;

  @query('#inputPLZ')
  plz!: HTMLInputElement;

  @query('#inputOrt')
  ort!: HTMLInputElement;

  @query('#auftragBeschreibung')
  auftragBeschreibung!: HTMLTextAreaElement;

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossorigin="anonymous"
      />

      ${this.renderNotification()}
      <div class="border border-success" id="outerDiv">
        <form action="/" method="post" class="needs-validation" novalidate>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="InputAuftragArt">Auftragsart </label>
              <select id="inputAuftragArt" class="form-control">
                <option value="walk" selected>Gassi gehen</option>
                <option value="care">Hundebetreuung</option>
              </select>
            </div>
            <div class="form-group col-md-6">
              <label for="auftragDatum">Datum</label>
              <input type="date" class="form-control" id="auftragDatum" required />
              <div class="invalid-feedback">Bitte wähle ein valides Datum.</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col-md-6" id="inputDogs">
              <label for="inputHunde">Wähle einen Hund</label>
              <select id="inputHunde" class="form-control" required>
                <option value="" selected>Kein Hund ausgewählt</option>
                ${repeat(
                  this.hunde,
                  hund => hund.besitzerId,
                  hund => html` <option value="${hund.id}">${hund.name}</option> `
                )}
              </select>
              <div class="invalid-feedback">Bitte wählen Sie einen Hund aus.</div>
            </div>

            <div class="form-group col-md-6">
              <label for="inputEntlohnung"> Entlohnung </label>
              <div class="input-group d-inline-flex align-items-center w-auto">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="inputGroupPrepend">€</span>
                </div>
                <input
                  type="number"
                  value="0.00"
                  min="0"
                  step="0.1"
                  id="inputEntlohnung"
                  placeholder="Entlohnung"
                  class="form-control"
                  required
                />
                <div class="invalid-feedback">Die Entlohnung ist erforderlich und darf nicht im negativen Bereich liegen.</div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col-md-9">
              <label for="inputstraße">Straße</label>
              <input type="text" class="form-control" id="inputStraße" placeholder="Beispielstraße" required />
              <div class="invalid-feedback">Eine Straße ist erforderlich.</div>
            </div>
            <div class="form-group col-md-3">
              <label for="inputHausNr">HausNr.</label>
              <input type="text" class="form-control" id="inputHausNr" placeholder="42" maxlength="5" required />
              <div class="invalid-feedback">Die Hausnummer ist erforderlich und muss gültig sein.</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col-md-3">
              <label for="inputPLZ">PLZ</label>
              <input type="text" class="form-control" id="inputPLZ" pattern="[0-9]{5}" placeholder="12345" required />
              <div class="invalid-feedback">Bitte geben Sie eine gültige Postleitzahl ein.</div>
            </div>
            <div class="form-group col-md-9">
              <label for="inputOrt">Ort</label>
              <input type="text" class="form-control" id="inputOrt" placeholder="Musterort" required />
              <div class="invalid-feedback">Bitte geben Sie ihren Ort ein.</div>
            </div>
          </div>

          <div class="form-group col-md-12">
            <label for="auftragBeschreibung">Beschreibung</label>
            <textarea
              class="form-control"
              id="auftragBeschreibung"
              rows="5"
              minlength="30"
              maxlength="900"
              required
              placeholder="Hier können Sie ihre Vierbeiner beschreiben und alle wichtigen Informationen nennen. Bei der Hundebetreuung sollte Sie hier angeben, wie lange auf den Hund aufgepasst werden soll. "
            ></textarea>
            <div class="invalid-feedback">Die Beschreibung ist erforderlich und muss 30 bis 900 Zeichen lang sein.</div>
          </div>

          <div class="form-row">
            <div class="form-group col-md-12">
              <button class="btn btn-primary" type="button" @click="${this.submit}">Auftrag erstellen</button>
            </div>
          </div>
        </form>
      </div>
    `;
  }

  /* Wird im Lit-Lifecycle einmalig aufgerufen, nachdem das Element das erste Mal gerendert wurde.
        Schickt einen Get-Request an /hunde, um alle Hunde des aktuellen Users zu erhalten. */
  async firstUpdated() {
    try {
      const response = await httpClient.get('/hunde');
      const responseJSON = await response.json();
      this.hunde = responseJSON.results;

    } catch ({ message, statusCode }) {
      switch (statusCode) {
        case 404:
          this.setNotification({
            infoMessage:
              'Bevor Sie einen Auftrag erstellen können, sollten Sie mindestens einen Hund anlegen. Dies können Sie unter dem Reiter "Meine Hunde" machen.'
          });
          break;
        case 401:
          this.setNotification({
            infoMessage: 'Die aktuelle Session ist abgelaufen. Sie werden zurück zur Anmeldung navigiert.'
          });
          window.setTimeout(() => {
            router.navigate('/user/sign-in');
          }, 5000);
          break;
        default:
          this.setNotification({ errorMessage: message });
      }
    }
  }

  updated() {
    this.setMinDate();
  }

  /** Methode zum dynamischen Setzen des Min-Attributs für das Auftragsdatum */
  setMinDate = () => {
    const today = new Date();
    const ddNum = today.getDate();
    let dd = today.getDate().toString();

    const mmNum = today.getMonth() + 1; //Januar startet bei 0
    let mm = mmNum.toString();

    const yyyyNum = today.getFullYear();
    const yyyy = yyyyNum.toString();

    if (ddNum < 10) {
      dd = '0' + dd;
    }
    if (mmNum < 10) {
      mm = '0' + mm;
    }

    const todayStr = yyyy + '-' + mm + '-' + dd;
    const root = document.querySelector('app-root');
    const auftragserstellung = root?.shadowRoot?.querySelector('app-auftragserstellung');
    auftragserstellung?.shadowRoot?.getElementById('auftragDatum')?.setAttribute('min', todayStr);
  };

  /* Submit-Methode, die nach erfolgreicher Validierung, die Koordination der eingegebenen Adresse mithilfe
        der geocode-Methode ermittelt, den in der Form ausgewählten Hund aus der internalProperty hunde liest und
        anschließend einen Post-Request an den Endpunkt /entries/ schickt. 
    */
  async submit() {
    if (this.checkInputs()) {
      try {
        await this.geocode();
        const selHund = this.getHund(this.auftragHund.value);
        const auftragData = {
          art: this.auftragArt.value,
          datum: this.auftragDatum.value,
          entlohnung: this.auftragEntlohnung.value,
          beschreibung: this.auftragBeschreibung.value,
          hundId: selHund!.id,
          hundName: selHund!.name,
          hundRasse: selHund!.rasse,
          imgName: selHund!.imgName,
          imgData: selHund!.imgData,
          lat: this.lat,
          lng: this.lng
        };
        await httpClient.post('/entries', auftragData);
        this.setNotification({ infoMessage: 'Auftrag wurde erfolgreich angelegt. Sie werden zur Auftragsübersicht weitergeleitet.' });
        window.setTimeout(() => {
          router.navigate('/entries');
        }, 5000);
      } catch ({ message, statusCode }) {
        switch (statusCode) {
          case 401:
            this.setNotification({
              infoMessage: 'Die aktuelle Session ist abgelaufen. Sie werden zurück zur Anmeldung navigiert.'
            });
            window.setTimeout(() => {
              router.navigate('/user/sign-in');
            }, 5000);
            break;
          default:
            this.setNotification({ errorMessage: message });
        }
      }
    } else {
      this.form.classList.add('was-validated');
    }
  }

  checkInputs() {
    return this.form.checkValidity();
  }

  /** Geocoding-Methode zur Berechnung der Koordinatien mithilfe der TomTom-Api und
   *   der vom Nutzer angegebenen Adresse und dem Setzen von Latitude und Longitude. */
  geocode = async () => {
    console.log('Berechnung der Koordinaten.');
    const straße = this.straße.value;
    const hsnr = this.hausnr.value;
    const plz = this.plz.value;
    const ort = this.ort.value;
    const location = straße + ' ' + hsnr + ' ' + plz + ' ' + ort;
    const endcodeURL = encodeURI(location);
    await axios
      .get('https://api.tomtom.com/search/2/geocode/' + endcodeURL + '.json', {
        params: {
          key: 'H7fgXYLB4GN3FEtBLrnnxmwoI2A1ftXA'
        }
      })
      .then((response: any) => {
        this.lat = response.data.results[0].position.lat;
        this.lng = response.data.results[0].position.lon;
      })
      .catch((error: any) => {
        this.setNotification({ errorMessage: error });
      });
  };

  /* Methode, um den in der Form ausgewählten Hund mithilfe der ID zu ermitteln und wiederzugeben.*/
  getHund = (id: string) => {
    try {
      let selHund;
      for (let i = 0; i <= this.hunde.length - 1; i++) {
        if (id === this.hunde[i].id) {
          selHund = this.hunde[i];
        }
      }
      if (selHund == null) {
        throw 'Es konnte kein Hund mit der passenden ID gefunden werden.';
      }
      return selHund;
    } catch (error) {
      this.setNotification({ errorMessage: error });
    }
  };

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
