/* Autor: Simon Flathmann */ 
import { css, customElement, html, LitElement, query, unsafeCSS } from 'lit-element';
import { router } from '../../router';
import { PageMixin} from '../page.mixin';
import defaultdog from '../../../resources/default/defaultdog.jpg';

const hundeerstellungComponentSCSS = require('./hundeerstellung.component.scss');

/* Custom-Element zur Erstellung eines neuen Hundes */
@customElement('app-hundeerstellung')
export class HundeerstellungComponent extends PageMixin(LitElement){

    static styles = [
        css`${unsafeCSS(hundeerstellungComponentSCSS)}`
    ]

    constructor(){
        super();
    }

    @query('form')
    form!: HTMLFormElement;

    @query('#name')
    name!: HTMLInputElement;

    @query('#rasse')
    rasse!: HTMLInputElement;

    @query('#geb')
    geb!: HTMLInputElement;

    @query('#info')
    info!: HTMLTextAreaElement;

    @query('#file')
    file!: HTMLInputElement;

    render(){
        return html`
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
            integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

            ${this.renderNotification()}
            <div class="border border-success" id="formdiv">
                <form action="/" class="needs-validation" method="post" enctype="multipart/form-data" novalidate>
                    <div class="form-row mx-4 mt-4">
                        <div class="col-lg-8">
                            <div class="form-row">
                                <div class="form-group col-md-12">
                                    <label for="name">Name</label>
                                    <input type="text" class="form-control" id="name" placeholder="Max" required>
                                    <div class="invalid-feedback">Der Name ist erforderlich.</div>
                                </div>
                                <div class="form-group col-md-12">
                                    <label for="rasse">Rasse</label>
                                    <input type="text" class="form-control" id="rasse" placeholder="Bernasenne" required>
                                    <div class="invalid-feedback">Die Rasse ist erforderlich.</div>
                                </div>
                                <div class="form-group col-md-12">
                                    <label for="geb">Geburtsdatum</label>
                                    <input type="date" class="form-control" id="geb" required>
                                    <div class="invalid-feedback">Bitte wähle ein valides Datum.</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="picture m-auto">
                                <img src="${defaultdog}" id="hunde-image" class="mt-4">
                            </div>
                            <div class="pictureinput m-4">
                                <input type="file" id="file" name="image" class="form-control" hidden>
                                <button id="uploadbtn" class="btn btn-sm btn-white d-table mx-auto mt-4" type="button">Foto hochladen</button>
                                <div class="invalid-feedback">Der Datentyp ist nicht valide. Die erlaubten Datentypen sind: jpg, jpeg und png.</div>
                            </div>
                        </div>
                    </div>
                    <div class="form-row mx-4 mb-4">
                        <div class="form-group col-md-12">
                                    <label for="info">Zusätzliche Informationen</label>
                                    <textarea class="form-control" id="info" rows="5" minlength="30" maxlength="600" required
                                        placeholder="Hier können Sie ihren Hund beschreiben."></textarea>
                                    <div class="invalid-feedback">Die Zusätzlichen Informationen sind erforderlich und müssen zwischen 30 und 1000 Zeichen lang sein.</div>
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

    //Wird im Lit-Lebenszyklus nach dem Rendern aufgerufen
    updated(){
        this.setMaxDate();
        this.initPictureUpload();
    }

    /* Erstellt nach einer erfolgreichen Validierung der Eingabedaten eine FormData, die in Form eines Post-Requests
     an den '/api/hunde' geschickt werden. Nach erfolgreichem Anlegen, wird der Nutzer nach '/user/dogs' navigiert. */
    async create() {
        if(this.checkInputs()){
            const formData = new FormData();
            formData.append('name', this.name.value);
            formData.append('rasse', this.rasse.value);
            formData.append('gebDate', this.geb.value);
            formData.append('infos', this.info.value); 
            formData.append('image', this.file.files![0]);

            try{
                /* const response = await httpClient.post('/hunde', hund);  
                Der HttpClient-Service kann an dieser Stelle nicht verwendet werden, da ein File mitgeschickt werden kann.
                */
                const port = location.protocol === 'https:' ? 3443 : location.protocol === 'https:' ? 3443 : 3000;
                const baseURL = `${location.protocol}//${location.hostname}:${port}/api/`; 
                const response = await fetch(`${baseURL}hunde`, {
                    method: 'post',
                    body: formData,
                    credentials: "include" //damit das jqt-token für den authService mitgeschickt werden kann
                });
                if(response.ok){
                    this.setNotification({ infoMessage: 'Ihr Hund wurde erfolgreich angelegt. Sie werden zur Hundeübersicht weitergeleitet. '});
                    window.setTimeout(() => {router.navigate('/user/dogs')}, 5000);
                    return response;
                }
                else{
                    let message = await response.text();
                    try{
                        message = JSON.parse(message).message;
                    } 
                    catch (error){
                        message = error.message;
                    }
                    message = message || response.statusText;
                    throw {message, statusCode : response.status};
                }
            }
            catch({message, statusCode}){
                switch(statusCode){
                    //Benachritigung, dass die Session abgelaufen ist und Navigation zur Anmeldung nach 5 Sekunden
                    case 401:
                        this.setNotification({ infoMessage: 'Die aktuelle Session ist abgelaufen. Sie werden zurück zur Anmeldung navigiert.'});
                        window.setTimeout(() => {router.navigate('/user/sign-in')}, 5000);
                        break;
                    default:
                        this.setNotification({ errorMessage: message });
                }
            }
        }
        else{
            this.form.classList.add('was-validated');
        }
    }
    
    //Validierung der eingegebenen Daten
    checkInputs(){
        var allowedExtensions = /(\.jpg|\.jpeg)$/i; //erlaubte Datentypen

        //Falls eine Datei hochgeladen wurde, wird diese auf den Datentypen überprüft
        if(this.file.value !== ""){
            if(!allowedExtensions.exec(this.file.value))
            {
                this.file.setCustomValidity("Der Datentyp ist nicht valide. Die erlaubten Datentypen sind: jpg, jpeg und png.")
            }
            else{
                this.file.setCustomValidity('');
            }
        }
        return this.form.checkValidity();
    }

    /* Setzt für das Input-Elements vom Geburtstag das max-Date auf den aktuellen Tag */
    setMaxDate(){
        var today = new Date();
        var ddNum = today.getDate();
        var dd = ddNum.toString();

        var mmNum = today.getMonth() + 1;
        var mm = mmNum.toString();

        var yyyyNum = today.getFullYear();
        var yyyy = yyyyNum.toString();

        if(ddNum < 10){
            dd = '0' + dd;
        }
        if(mmNum < 10){
            mm = '0' + mm;
        }

        var todayStr = yyyy+"-"+mm+"-"+dd;
        console.log("Attribut max vom Geburtsdatum wird auf " + todayStr + " gesetzt.");
        this.shadowRoot!.getElementById('geb')?.setAttribute('max', todayStr);
    }

    /* Setzt einen EventListener für den Upload-Button, welches das unsichtbare input-Element aufruft. 
        Diesem wird ein auch ein EventListener hinzugefügt, welcher beim Datenupload das src-Attribut vom img-Element ändert. */
    initPictureUpload(){
        var component = this.shadowRoot!;
        var uploadbtn = component!.getElementById('uploadbtn');
        var file = component!.getElementById('file');
        var img = component!.getElementById('hunde-image');

        uploadbtn!.addEventListener('click', openDialog);
        function openDialog(){
            component!.getElementById('file')!.click();
        }

        file!.addEventListener('change', function(){
            let file2 = file! as HTMLInputElement;
            let uploadedFile = file2.files![0];

            if(uploadedFile){
                //Preview der Bild-Datei
                const reader = new FileReader();
                reader.addEventListener('load', function(){
                    if(typeof reader.result === 'string' )
                    img!.setAttribute('src', reader.result);
                });
                reader.readAsDataURL(uploadedFile);
            }
        })
    };
}