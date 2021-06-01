/* Autor: Simon Flathmann */

import express from 'express';
import {GenericDAO} from '../models/generic.dao';
import { Hund } from '../models/hunde';
import { authService } from '../services/auth.service';

const router = express.Router();

router.post('/', async(req, res) => {
    console.log("post-anfrage auf hunde.ts");
    
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

    console.log("Vor hundeDAO.create");
    //Nach erfolgreicher Validierung, wird der Hund erstellt
    const hundNeu = await hundeDAO.create({
        besitzerId: req.body.besitzerId,
        name: req.body.name,
        rasse: req.body.rasse,
        gebDate: req.body.gebDate,
        infos: req.body.infos,
        image: req.body.image
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