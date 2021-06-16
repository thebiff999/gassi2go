/* Autor: Simon Flathmann */

import express from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import { GenericDAO } from '../models/generic.dao';
import { Hund } from '../models/hunde';
import { authService } from '../services/auth.service';
import path from 'path';

const router = express.Router();

router.use(fileUpload());

router.post('/', async(req, res) => {
    console.log('Post-Request an /hunde/');
    let uploadPath =  './../../../client/resources/uploads/';  //Pfad zum Verschieben der Images
    let imagePath = './../../../resources/uploads/';  //Pfad zum Hinterlegen in der DB
    var image = req.files?.image as UploadedFile;
    var uniqueName = uuidv4() + image?.name; //Erzeugung eines eindeutigen Namen, um Dopplungen zu vermeiden
    var finalPath = imagePath + uniqueName;  
    
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

    //Nach erfolgreicher Validierung, wird der Hund erstellt
    const hundNeu = await hundeDAO.create({
        besitzerId: req.body.besitzerId,
        name: req.body.name,
        rasse: req.body.rasse,
        gebDate: req.body.gebDate,
        infos: req.body.infos,
        imgPath: finalPath
    });

    //erfolgreiche Erstellung
    authService.createAndSetToken({id: hundNeu.id}, res);
    res.status(201).json(hundNeu);
});

router.get('/', authService.expressMiddleware, async(req, res) => {
    console.log("Get-Request an /hunde/");
    const hundeDAO: GenericDAO<Hund> = req.app.locals.hundeDAO;
    const filter: Partial<Hund> = { besitzerId: res.locals.user.id }
    const hunde = (await hundeDAO.findAll(filter)).map(hund => {
        return { ...hund };
    });
    if(hunde.length == 0){
        console.log('404');
        res.sendStatus(404);
    }
    else{
        console.log('200');
        res.status(200).json({results: hunde });
    }
});

router.delete('/:id', authService.expressMiddleware, async(req, res) =>{
    console.log('Delete-Anfrage auf /' + req.params.id + 'erhalten');
    const hundeDAO: GenericDAO<Hund> = req.app.locals.hundeDAO;
    await hundeDAO.delete(req.params.id);
    res.status(200).end();
});


router.get('/:id', authService.expressMiddleware, async(req, res) => {
    console.log('Get-Anfrage an hunde/' + req.params.id);
    try{
        const hundDAO: GenericDAO<Hund> = req.app.locals.hundeDAO;
        const hund = await hundDAO.findOne({ id : req.params.id});
        if(!hund){
            res.status(404).json({message: `Es wurde kein Hund mit der ID ${req.params.id} gefunden.`});
        }else{
            res.status(200).json({
                hund
            });
        }
    }
    catch(error){
        console.log(error);
    }
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