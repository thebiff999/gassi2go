/* Autor: Dennis Heuermann */

import express from 'express';
import { GenericDAO } from '../models/generic.dao';
import { Entry } from '../models/entry';
import {} from 'uuid';

const router = express.Router();

//returns all open entries
router.get('/', async (req, res) => {
    try {
        console.log('received get on entries/ change test');
        const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
        const filter: Partial<Entry> = {status: 'open'};
        const entries = (await entryDAO.findAll(filter)).map(entry => {
            return {...entry}
        })
        res.json({ results: entries});
    }
    catch (err) {
        console.log(err.stack);
    }    
});

//returnes the entry with the requested id
router.get('/id/:id', async(req, res) => {
    console.log('received get on entries/' + req.params.id);
    try {
        const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
        const entry = (await entryDAO.findOne({id: req.params.id}));
        res.status(200).json(entry);
    }
    catch (err){
        console.log(err.stack);
    }     
});

//returns all entries assigned to the requesting user
router.get('/assigned', async (req, res) => {
    try {
        console.log('received get on /entries/assigned')
        const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
        const filter: Partial<Entry> = {requesterId: '123'};
        const entries = (await entryDAO.findAll(filter)).map(entry => {
            console.log('mapped entry');
            return {...entry};
        });
        res.json({ results: entries});
        console.log(entries);
    }
    catch (err) {
        console.log(err.stack);
    }    
});

//creates a new entry
router.post('/', async (req,res) => {
    console.log('received post on entries/');
    const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
    const createdEntry = await entryDAO.create({
        type: req.body.art,
        date: req.body.datum,
        pay: req.body.entlohnung,
        status: 'open',
        description: req.body.beschreibung,
        ownerId: '1',
        ownerName: 'Max Mustermann',
        dogId: req.body.hundId,
        dogName: req.body.hundName,
        dogRace: req.body.hundRasse,
        lat: req.body.lat,
        lng: req.body.lng,
        imageUrl: req.body.imgPath
    });
    res.status(2021).json({
        createdEntry
    })
});

//update entry with the requesterId
router.patch('/:id', async (req, res) => {
    console.log('received patch on entries/id/' + req.params.id);
    const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;

    const partialEntry: Partial<Entry> = { id: req.params.id};
    partialEntry.requesterId = '123';
    partialEntry.requesterName = 'Max Mustermann';
    partialEntry.status = 'assigned';

    await entryDAO.update(partialEntry);
    res.status(200).end();
});

//delete entry with requested id
router.delete('/:id', async (req, res) => {

});

export default router;