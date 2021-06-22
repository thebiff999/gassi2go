/* Autor: Dennis Heuermann */

import express from 'express';
import { GenericDAO } from '../models/generic.dao';
import { Entry } from '../models/entry';
import { authService } from '../services/auth.service';
import {} from 'uuid';
import validator from 'validator';
import { cryptoService } from '../services/crypto.service';

const router = express.Router();

//returns all open entries
router.get('/', authService.expressMiddleware, async (req, res) => {
  try {
    console.log('GET-Request on /entries');
    const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
    const filter: Partial<Entry> = { status: 'open' };
    const entries = (await entryDAO.findAll(filter)).map(entry => {
      return {
        ...entry,
        description: cryptoService.decrypt(entry.description),
        dogName: cryptoService.decrypt(entry.dogName),
        lat: cryptoService.decrypt(entry.lat),
        lng: cryptoService.decrypt(entry.lng),
        imgData: cryptoService.decrypt(entry.imgData),
        imgName: cryptoService.decrypt(entry.imgName)
      };
    });
    console.log('sent ' + entries.length + ' entries');
    if (entries.length > 0) {
      res.status(200).json({ results: entries });
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err.stack);
  }
});

//returnes the entry with the requested id
router.get('/id/:id', authService.expressMiddleware, async (req, res) => {
  console.log('GET-Request on /entries/id/' + req.params.id);
  //validate that the id in the requested url is a uuid
  if (!validator.isUUID(req.params.id, 4)) {
    res.sendStatus(400);
  } else {
    try {
      const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
      const entry = await entryDAO.findOne({ id: req.params.id });
      if (!entry) {
        res.sendStatus(404);
      } else {
        if (entry.status == 'open') {
          entry.description = cryptoService.decrypt(entry.description);
          entry.dogName = cryptoService.decrypt(entry.dogName);
          entry.lat = cryptoService.decrypt(entry.lat);
          entry.lng = cryptoService.decrypt(entry.lng);
          entry.imgData = cryptoService.decrypt(entry.imgData);
          entry.imgName = cryptoService.decrypt(entry.imgName);
          res.status(200).json(entry);
        } else {
          res.sendStatus(403);
        }
      }
    } catch (err) {
      console.log(err.stack);
    }
  }
});

//returns all entries assigned to the requesting user
router.get('/assigned', authService.expressMiddleware, async (req, res) => {
  try {
    console.log('GET-Request on /entries/assigned');
    const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
    const filter: Partial<Entry> = { requesterId: res.locals.user.id, status: 'assigned' };
    const entries = (await entryDAO.findAll(filter)).map(entry => {
      return {
        ...entry,
        description: cryptoService.decrypt(entry.description),
        dogName: cryptoService.decrypt(entry.dogName),
        lat: cryptoService.decrypt(entry.lat),
        lng: cryptoService.decrypt(entry.lng),
        imgData: cryptoService.decrypt(entry.imgData),
        imgName: cryptoService.decrypt(entry.imgName)
      };
    });
    if (entries.length > 0) {
      res.status(200).json({ results: entries });
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err.stack);
  }
});

//creates a new entry
router.post('/', authService.expressMiddleware, async (req, res) => {
  console.log('POST-Request on /entries');
  if (req.body.pay >= 0) {
    res.status(400).json({ message: 'Die Entlohnung darf nicht negativ sein' }).end();
  }
  try {
    const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
    const createdEntry = await entryDAO.create({
      type: req.body.art,
      date: req.body.datum,
      pay: req.body.entlohnung,
      status: 'open',
      description: cryptoService.encrypt(req.body.beschreibung),
      ownerId: res.locals.user.id,
      dogId: req.body.hundId,
      dogName: cryptoService.encrypt(req.body.hundName),
      dogRace: req.body.hundRasse,
      lat: cryptoService.encrypt(req.body.lat.toString()),
      lng: cryptoService.encrypt(req.body.lng.toString()),
      imgName: cryptoService.encrypt(req.body.imgName),
      imgData: cryptoService.encrypt(req.body.imgData)
    });
    console.log('created entry for dogId ' + createdEntry.dogId);
    res.status(201).json(createdEntry);
  } catch (err) {
    console.log(err.stack);
    res.status(500).end();
  }
});

//update entry with the requesterId
router.patch('/id/:id', authService.expressMiddleware, async (req, res) => {
  console.log('PATCH-Request on /entries/id/' + req.params.id);

  const invalidRequest = (message = 'Ungültige Nachfrage') => {
    authService.removeToken(res);
    res.status(400).json(message).end();
  };

  //validate that the id in the url is a uuid
  if (!validator.isUUID(req.params.id, 4)) {
    invalidRequest();
  }

  //validate the sent entry-status and that the url-id is a uuid
  // eslint-disable-next-line no-constant-condition
  if (!(req.body.status != 'assigned' || 'done')) {
    invalidRequest();
  }

  //validate that the user is actually assigned to the entry before checking it as 'done'
  if (req.body.status == 'done') {
    try {
      const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
      const entry = await entryDAO.findOne({ id: req.params.id });

      if (entry?.requesterId != res.locals.user.id) {
        invalidRequest();
      }
    } catch (err) {
      console.log(err.stack);
    }
  }

  const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;

  const partialEntry: Partial<Entry> = { id: req.params.id };
  partialEntry.requesterId = res.locals.user.id;
  partialEntry.status = req.body.status;

  await entryDAO.update(partialEntry);
  res.status(200).end();
});

router.delete('/user/:id', authService.expressMiddleware, async (req, res) => {
  console.log('DELETE-Request on /user/' + req.params.id);

  //validate that the requested id matches the user id
  if (req.params.id != res.locals.user.id) {
    const message = 'Ungültige Anfrage';
    authService.removeToken(res);
    res.status(400).json(message);
  } else {
    //delete entries where the user is owner and reset entries which he requested
    try {
      const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
      await entryDAO.deleteAll({ ownerId: req.params.id });
      const requestedEntries = await entryDAO.findAll({ requesterId: req.params.id, status: 'assigned' });

      for (let i = 0; i < requestedEntries.length; i++) {
        const partialEntry: Partial<Entry> = { id: requestedEntries[i].id, requesterId: null, status: 'open' };
        await entryDAO.update(partialEntry);
      }

      res.status(204).json('Verbundene Aufträge gelöscht');
    } catch (err) {
      console.log(err.stack);
      res.status(500).end();
    }
  }
});

export default router;
