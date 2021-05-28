import { css, customElement, html, LitElement, unsafeCSS } from "lit-element";

const hundeerstellungComponentSCSS = require('./hundeerstellung.component.scss');

@customElement('app-hundeerstellung')
class HundeerstellungComponent extends LitElement{

    static styles = [
        css`${unsafeCSS(hundeerstellungComponentSCSS)}`
    ]

    constructor(){
        super();
    }

    render(){
        return html`
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
            integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

            <div class="border border-success" id="formdiv">
                <form class="needs-validation" novalidate>
                    <div class="form-row m-4">
                        <div class="col-lg-8">
                            <div class="form-row">
                                <div class="form-group col-md-12">
                                    <label for="name">Name</label>
                                    <input type="text" class="form-control" id="name" placeholder="Max">
                                </div>
                                <div class="form-group col-md-12">
                                    <label for="rasse">Rasse</label>
                                    <input type="text" class="form-control" id="rasse" placeholder="Bernasenne">
                                </div>
                                <div class="form-group col-md-12">
                                    <label for="geb">Geburtsdatum</label>
                                    <input type="date" class="form-control" id="geb">
                                </div>
                                <div class="form-group col-md-12">
                                    <label for="info">zusätzliche Informationen</label>
                                    <textarea class="form-control" id="info" rows="5" minlength="30" maxlength="1000" required
                                        placeholder="Hier können Sie ihren Hund beschreiben."></textarea>
                                </div>
                            </div>

                        </div>
                        <div class="col-lg-4">
                            <div class="picture m-auto">
                                <img id="hunde-image" src="./../../../../resources/images/dog_logo.png">
                            </div> 
                            <button class="btn btn-sm btn-white d-table mx-auto mt-4">Foto hochladen</button>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group mx-4 col-md-12">
                            <button class="btn btn-primary" type="button" @click="${this.create}">Hund anlegen</button>
                        </div>
                    </div>
                </form>
            </div>
        `
    }

    async create() {
        console.log("erstellung");
    }

}