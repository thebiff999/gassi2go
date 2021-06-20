/* Autor: Simon Flathmann */

import express from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { GenericDAO } from '../models/generic.dao';
import { Hund } from '../models/hunde';
import { Entry } from '../models/entry';
import { authService } from '../services/auth.service';
import fs from 'fs';
import { cryptoService } from '../services/crypto.service';

const router = express.Router();

router.use(fileUpload());

/* API-Service zum Anlegen eines Hundes in der Datenbank. */
router.post('/', authService.expressMiddleware, async (req, res) => {
  console.log('Post-Request an /hunde/');
  const image = req.files?.image as UploadedFile;
  let stringBuffer = '';
  let imageName = '';

  const hundeDAO: GenericDAO<Hund> = req.app.locals.hundeDAO;
  const fehler: string[] = [];

  const sendeFehlermeldung = (meldung: string) => {
    authService.removeToken(res);
    res.status(400).json({ meldung });
  };

  //Validierung, dass alle Pflichtfelder gesetzt sind
  if (allePflichtfelderVorhanden(req.body, ['name', 'rasse', 'gebDate', 'infos'], fehler)) {
    return sendeFehlermeldung(fehler.join('\n'));
  }

  /* Falls ein Bild mitgeschickt wurde, werden die Übergabeparameter hier gesetzt.
        Wenn kein Bild mitgeschickt wurde, werden Defaultwerte gesetzt. */
  if (req.files) {
    stringBuffer = image?.data.toString('base64');
    imageName = image?.name;
  } else {
    stringBuffer = fs.readFileSync(__dirname + '../../../resources/default.txt').toString();
    imageName = 'defaultImage';
  }

  /* Nach erfolgreicher Validierung, wird eine hundeDAO erstellt, die den Hund in der Datenbank anlegt.
        Dabei werden alle Daten verschlüsselt, die möglicherweise persönliche Daten beinhalten könnten. */
  const hundNeu = await hundeDAO.create({
    besitzerId: res.locals.user.id,
    name: cryptoService.encrypt(req.body.name),
    rasse: cryptoService.encrypt(req.body.rasse),
    gebDate: cryptoService.encrypt(req.body.gebDate),
    infos: cryptoService.encrypt(req.body.infos),
    imgName: cryptoService.encrypt(imageName),
    imgData: cryptoService.encrypt(stringBuffer)
  });
  console.log('hund ' + req.body.name + ' angelegt');
  res.status(201).json({
    ...hundNeu,
    name: cryptoService.decrypt(hundNeu.name),
    rasse: cryptoService.decrypt(hundNeu.rasse),
    gebDate: cryptoService.decrypt(hundNeu.gebDate),
    infos: cryptoService.decrypt(hundNeu.infos),
    imgName: cryptoService.decrypt(hundNeu.imgName),
    imgData: cryptoService.decrypt(hundNeu.imgData)
  });
});

/* API-Service zum Holen aller Hunde zum aktuellen User. */
router.get('/', authService.expressMiddleware, async (req, res) => {
  console.log('Get-Request an /hunde/');
  const hundeDAO: GenericDAO<Hund> = req.app.locals.hundeDAO;
  const filter: Partial<Hund> = { besitzerId: res.locals.user.id };
  /* Ruft alle zum aktuellen User zugehörigen Hunde aus der Datenbank
    und entschlüsselt die persönlichen Daten */
  const hunde = (await hundeDAO.findAll(filter)).map(hund => {
    return {
      ...hund,
      name: cryptoService.decrypt(hund.name),
      rasse: cryptoService.decrypt(hund.rasse),
      gebDate: cryptoService.decrypt(hund.gebDate),
      infos: cryptoService.decrypt(hund.infos),
      imgName: cryptoService.decrypt(hund.imgName),
      imgData: cryptoService.decrypt(hund.imgData)
    };
  });
  if (hunde.length == 0) {
    res.sendStatus(404);
  } else {
    res.status(200).json({ results: hunde });
  }
});

/* API-Service zum Löschen eines Hundes mithilfe der ID. Außerdem werden
    alle Aufträge gelöscht, mit diesem Hund. */
router.delete('/:id', authService.expressMiddleware, async (req, res) => {
  console.log('Delete-Anfrage auf /' + req.params.id + 'erhalten');
  const hundeDAO: GenericDAO<Hund> = req.app.locals.hundeDAO;
  const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
  await hundeDAO.delete(req.params.id);
  await entryDAO.deleteAll({ dogId: req.params.id });
  res.status(200).end();
});

/* API-Service zum Abfragen eines spezifischen Hundes aus der Datenbank mithilfe der ID */
router.get('/:id', authService.expressMiddleware, async (req, res) => {
  console.log('Get-Anfrage an hunde/' + req.params.id);
  const hundDAO: GenericDAO<Hund> = req.app.locals.hundeDAO;
  const hund = await hundDAO.findOne({ id: req.params.id });
  if (!hund) {
    res.status(404).json({ message: `Es wurde kein Hund mit der ID ${req.params.id} gefunden.` });
  } else {
    //Entschlüsselung der persönlichen Daten und Rückgabe des Hundes
    res.status(200).json({
      ...hund,
      name: cryptoService.decrypt(hund.name),
      rasse: cryptoService.decrypt(hund.rasse),
      gebDate: cryptoService.decrypt(hund.gebDate),
      infos: cryptoService.decrypt(hund.infos),
      imgName: cryptoService.decrypt(hund.imgName),
      imgData: cryptoService.decrypt(hund.imgData)
    });
  }
});

//Überprüft für jedes Pflichtfeld, ob dieses gesetzt ist und gibt das Ergebnis zurück.
function allePflichtfelderVorhanden(objekt: { [key: string]: unknown }, pflichtfelder: string[], fehler: string[]) {
  let fehlerVorhanden = false;
  pflichtfelder.forEach(feldname => {
    if (!objekt[feldname]) {
      fehler.push(feldname + ' ist leer.');
      fehlerVorhanden = true;
    }
  });
  return fehlerVorhanden;
}

export default router;
