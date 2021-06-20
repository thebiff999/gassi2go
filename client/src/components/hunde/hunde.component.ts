/* Autor: Simon Flathmann */

import { css, customElement, html, internalProperty, LitElement, unsafeCSS } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { Hund } from '../../../../api-server/src/models/hunde';
import { router } from '../../router';
import { httpClient } from '../../http-client';
import { PageMixin } from '../page.mixin';

const hundeComponentSCSS = require('./hunde.component.scss');

/* Custom-Element zur Anzeige der eigenen Hunde */
@customElement('app-hunde')
export class HundeComponent extends PageMixin(LitElement) {
  static styles = [
    css`
      ${unsafeCSS(hundeComponentSCSS)}
    `
  ];

  @internalProperty()
  private hunde: Hund[] = [];

  constructor() {
    super();
  }

  render() {
    return html`
      <div id="link-div">
        <a href="/user/dogs/new" class="btn-routing">Hund hinzufügen</a>
      </div>
      ${this.renderNotification()}
      <div id="hunde" class="container-fluid">
        <div class="row">
          ${repeat(
            this.hunde,
            hund => hund.besitzerId,
            hund =>
              html`
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xxl-3">
                  <div class="card text-center m-4 p-3 rounded-lg shadow-lg" id="dogcard">
                    <div class="card-block" m-md-2>
                      <img
                        class="img-fluid border"
                        id="dogimg"
                        src="data:image/jpeg;base64,${hund.imgData}"
                        alt="hunde image"
                      />
                      <div class="card-title m-1">
                        <h5>${hund.name}</h5>
                      </div>
                      <div class="card-text">Rasse: ${hund.rasse}</div>
                      <div class="card-text mb-2">Geb.: ${hund.gebDate}</div>
                      <div class="card-text mb-2">${hund.infos}</div>
                      <div>
                        <button id="petbtn" @click="${() => this.pet(hund.name)}" class="btn btn-light">
                          <i class="far fa-heart"></i> Streicheln
                        </button>
                        <button id="deletebtn" @click="${() => this.delete(hund.id)}" class="btn btn-light">
                          <i class="far fa-trash-alt"></i> Löschen
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              `
          )}
        </div>
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
          this.setNotification({ infoMessage: 'Sie haben noch keine Hunde angelegt.' });
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

  /* Methode zum Löschen eines Hundes in der Datenbank und 
        in der InternalProperty mithilfe der ID. */
  async delete(id: string) {
    if (confirm('Möchten Sie den Hund wirklich löschen?')) {
      try {
        await httpClient.delete(`/hunde/${id}`);
        this.hunde = this.hunde.filter(hund => hund.id !== id);
      } catch ({ message }) {
        this.setNotification({ errorMessage: message });
      }
    }
  }

  /* Zufallswiedergabe von Alerts */
  async pet(name: string) {
    const rndInt = Math.floor(Math.random() * 4) + 1;
    if (rndInt === 1) {
      alert(`Du hast ${name} nur leicht berührt und trotzdem wirkt ${name} schon sehr glücklich!`);
    }
    if (rndInt === 2) {
      alert(`${name} hat es sehr gefallen und wedelt vor Freude mit dem Schwanz.`);
    }
    if (rndInt === 3) {
      alert(`${name} bellt vor Freude.`);
    }
    if (rndInt === 4) {
      alert(`${name} dreht sich vor Freude im Kreis.`);
    }
  }
}
