/* Autor: Simon Flathmann */ 

import { css, customElement, html, LitElement, unsafeCSS } from "lit-element";

const auftragserstellungComponentSCSS = require('./auftragserstellung.component.scss');

@customElement('app-auftragserstellung')
class AuftragsErstellungComponent extends LitElement{

    static styles = [
        css`${unsafeCSS(auftragserstellungComponentSCSS)}`
    ]

    render(){
        return html`
        <div>
            <form action="target_url" method="POST">
            <fieldset class="fieldset1">
                <legend>Auftrag erstellen</legend>
                <h3>Wählen Sie die Art des Auftrages</h3>
                    <fieldset>
                        <label for="auftrag_art">Auftragsart: </label>
                        <select name="art" id="auftrag_art" required>
                            <option value="gassi">Gassi gehen</option>
                            <option value="betreunung">Hundebetreuung</option>
                        </select>
                    </fieldset>
                <h3>Kreuzen Sie die gewünschten Hunde an: </h3>
                    <fieldset>
                    <h4>Ihre Hunde: </h4>
                    <ul>
                            <li>
                                <label>Maja</label>
                                <input type="checkbox" name="hund" value="Maja">
                            </li>
                            <li>
                                <label>Bello</label>
                                <input type="checkbox" name="hund" value="Bello">
                            </li>
                            <li>
                                <label>Max</label>
                                <input type="checkbox" name="hund" value="Max">
                            </li>
                        </ul>
                    </fieldset>
                <h3>Wählen Sie Ihren Standort: </h3>
                <fieldset>
                    <p>
                        <label for="auftrag_longitude">Longitude: </label>
                        <input type="number" name="longitude" id="auftrag_longitude">
                    </p>
                    <p>
                        <label for="auftrag_langitude">Langitude: </label>
                        <input type="number" name="langitude" id="auftrag_langitude">
                    </p>
                    <p>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d157382.94035297004!2d7.
                    484015413316863!3d51.95021390113208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.
                    1!3m3!1m2!1s0x47b9bac399f760df%3A0x21eb4ca77bf328eb!2zTcO8bnN0ZXI!5e0!3m2!1sde!2sde!4v1618829391784!5m2!1sde!2sde"
                    width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                    </p>
                </fieldset>
                <h3>Wählen Sie ein Datum: </h3>
                <fieldset>
                    <p>
                        <label for="auftrag_date">Datum</label>
                        <input type="date" name="datum" id="auftrag_date">
                    </p>
                </fieldset>
                <h3>Hier können Sie eine Entlohnung einstellen</h3>
                <fieldset>
                    <p>
                        <label for="auftrag_entlohnung"> Entlohnung
                        <input type="number" name="entlohnung" id="auftrag_entlohnung" min="0.00" step="0.01">
                        € </label>
                    </p>
                </fieldset>
        
                <h3>Ergänzen Sie eine Beschreibung: </h3>
                <p>
                    <textarea name="beschreibung" id="auftrag_lang" cols="50" rows="5"></textarea>
                    <p>
                        <input type="submit" value="hinzufügen">
                    </p>
                </p>
            </fieldset>
        
            <fieldset class="fieldset1">
                <h3>Auftrag erstellen</h3>
                <input type="submit" value="Erstellen">
                <input type="reset" value="Zurücksetzen">
            </fieldset>
        
        </form>
        </div>
        `;
    }
}