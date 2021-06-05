/* Autor: Simon Flathmann */

import express from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
//import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { GenericDAO } from '../models/generic.dao';
import { Hund } from '../models/hunde';
import { authService } from '../services/auth.service';
import path from 'path';
const router = express.Router();
//const upload = multer({ dest: '../../../client/resources/uploads/'});

router.use(fileUpload());
//<any> upload.single('image')
//router.use(express.urlencoded({extended: true}));

router.post('/', async(req, res) => {
    let uploadPath =  './../../../client/resources/uploads/';  //Pfad zum Verschieben der Images
    let imagePath = './../../../resources/uploads/';  //Pfad zum Hinterlegen in der DB
    var image = req.files?.image as UploadedFile;
    var uniqueName = uuidv4() + image?.name; //Erzeugung eines eindeutigen Namen, um Dopplungen zu vermeiden
    var finalPath = imagePath + uniqueName;  
    console.log('__dirnamne: ' + __dirname);
    console.log("post-anfrage auf hunde.ts");
    console.log("Req.body (Partial):");
    console.log(req.body);
    console.log("req.files (image-Datei):");
    console.log(req.files);
    
    const hundeDAO: GenericDAO<Hund> = req.app.locals.hundeDAO;
    const fehler: string[] = [];

    const sendeFehlermeldung = (meldung: string) => {
        authService.removeToken(res);
        res.status(400).json({meldung});
    };

    //Validierung, dass alle Pflichtfelder gesetzt sind
    if(allePflichtfelderVorhanden(req.body, ['besitzerId', 'name', 'rasse', 'gebDate', 'infos'], fehler)){
        return sendeFehlermeldung(fehler.join('\n'));
    }

    //TODO weitere Validierungen

    if(req.files){
        image.mv(path.join(__dirname, uploadPath + uniqueName), (error) => {
            if(error){
                res.send(error);
            }
            else{
                res.send('Image hochgeladen');
            }
        })
    }
    else{
        //Falls kein Foto hochgeladen wurde, wird auf ein Default-Foto verwiesen
        finalPath = './../../../../resources/default/defaultdog.png';
    }

    console.log("Vor hundeDAO.create");
    //Nach erfolgreicher Validierung, wird der Hund erstellt
    const hundNeu = await hundeDAO.create({
        besitzerId: req.body.besitzerId,
        name: req.body.name,
        rasse: req.body.rasse,
        gebDate: req.body.gebDate,
        infos: req.body.infos,
        imgPath: finalPath
    });
    console.log("Nach hundeDAO.create");

    //erfolgreiche Erstellung
    authService.createAndSetToken({id: hundNeu.id}, res);
    res.status(201).json(hundNeu);
});

//ExpressMiddleware
router.get('/', async(req, res) => {
    console.log("Get-Anfrage an hunde.ts");
    console.log(res.locals);
    const hundeDAO: GenericDAO<Hund> = req.app.locals.hundeDAO;
    const filter: Partial<Hund> = { besitzerId: "TODO" }  //TODO besitzerId
    const hunde = (await hundeDAO.findAll(filter)).map(hund => {
        return { ...hund };
    });
    res.json({results: hunde });
});

//Überprüft für jedes Pflichtfeld, ob dieses gesetzt ist und gibt das Ergebnis zurück.
function allePflichtfelderVorhanden(objekt: { [key: string]: unknown}, pflichtfelder: string[], fehler: string[]){
    let fehlerVorhanden = false;
    pflichtfelder.forEach(feldname => {
        if(!objekt[feldname]){
            fehler.push(feldname + " ist leer.");
            fehlerVorhanden = true;
        }
    });
    return fehlerVorhanden;
}

export default router;