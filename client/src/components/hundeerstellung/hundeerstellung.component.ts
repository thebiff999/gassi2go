import { css, customElement, html, LitElement, query, unsafeCSS } from "lit-element";

const hundeerstellungComponentSCSS = require('./hundeerstellung.component.scss');

@customElement('app-hundeerstellung')
class HundeerstellungComponent extends LitElement{

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

            <div class="border border-success" id="formdiv">
                <form class="needs-validation" novalidate>
                    <div class="form-row m-4">
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
                                    <div class="invalid-feedback">Bitte wähle ein Datum in der Vergangenheit.</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="picture m-auto">
                                <img src="./../../../../resources/images/dog_logo.png" id="hunde-image">
                            </div>
                            <div class="pictureinput m-4">
                                <input type="file" id="file" class="form-control" hidden>
                                <button id="uploadbtn" class="btn btn-sm btn-white d-table mx-auto mt-4" type="button">Foto hochladen</button>
                                <div class="invalid-feedback">Der Datentyp ist nicht valide. Die erlaubten Datentypen sind: jpg, jpeg und png.</div>
                            </div>
                        </div>
                    </div>
                    <div class="form-row m-4">
                        <div class="form-group col-md-12">
                                    <label for="info">Zusätzliche Informationen</label>
                                    <textarea class="form-control" id="info" rows="5" minlength="30" maxlength="1000" required
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

    async create() {
        console.log("erstellung");
        if(this.checkInputs()){
            console.log("checked successfully")
        }
        else{
            this.form.classList.add('was-validated');
        }
    }
    
    //Validierung der eingegebenen Daten
    checkInputs(){
        console.log('checkingInputs');
        var file = this.file;
        var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
        console.log(this.file);
        console.log(this.file.value);

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
            console.log('opened Dialog');
            component!.getElementById('file')!.click();
        }

        file!.addEventListener('change', function(){
            let file2 = file! as HTMLInputElement;
            let uploadedFile = file2.files![0];

            if(uploadedFile){
                //Preview
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