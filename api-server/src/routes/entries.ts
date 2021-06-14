/* Autor: Dennis Heuermann */

import express from 'express';
import { GenericDAO } from '../models/generic.dao';
import { Entry } from '../models/entry';
import { authService } from '../services/auth.service';
import {} from 'uuid';

const router = express.Router();

//returns all open entries
router.get('/', authService.expressMiddleware, async (req, res) => {
    try {
        console.log('received get on /entries');
        const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
        const filter: Partial<Entry> = {status: 'open'};
        const entries = (await entryDAO.findAll(filter)).map(entry => {
            return {...entry}
        })
        console.log(entries);
        if (entries.length > 0) {
            res.status(200).json({ results: entries});
        }
        else {
            res.status(404);
        }
        
    }
    catch (err) {
        console.log(err.stack);
    }    
});

//returnes the entry with the requested id
router.get('/id/:id', async(req, res) => {
    console.log('received get on /entries/' + req.params.id);
    try {
        const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
        const entry = (await entryDAO.findOne({id: req.params.id}));
        if (!entry) {
            res.status(404);
        }
        else {
            if (entry.status == 'done') {
                res.status(200).json(entry);
            }
            else {
                res.status(403);
            }
        }    
        
    }
    catch (err){
        console.log(err.stack);
    }     
});

//returns all entries assigned to the requesting user
router.get('/assigned', authService.expressMiddleware ,async (req, res) => {
    try {
        console.log('received get on /entries/assigned')
        const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
        const filter: Partial<Entry> = { requesterId: res.locals.user.id, status: 'assigned' };
        const entries = (await entryDAO.findAll(filter)).map(entry => {
            return {...entry};
        });
        console.log(entries);
        if (entries.length > 0) {
            res.status(200).json({ results: entries});
        }
        else {
            res.status(404);
        }
        
    }
    catch (err) {
        console.log(err.stack);
    }    
});

//creates a new entry
router.post('/', authService.expressMiddleware ,async (req,res) => {
    console.log('received post on /entries');
    const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
    const createdEntry = await entryDAO.create({
        type: req.body.art,
        date: req.body.datum,
        pay: req.body.entlohnung,
        status: 'open',
        description: req.body.beschreibung,
        ownerId: res.locals.user.id,
        dogId: req.body.hundId,
        dogName: req.body.hundName,
        dogRace: req.body.hundRasse,
        lat: req.body.lat,
        lng: req.body.lng,
        imageUrl: req.body.imgPath
    });
    res.status(201).json({
        createdEntry
    })
});

//update entry with the requesterId
router.patch('/id/:id', authService.expressMiddleware,async (req, res) => {
    console.log('received patch on /entries/id/' + req.params.id);
    const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;

    const partialEntry: Partial<Entry> = { id: req.params.id};
    partialEntry.requesterId = res.locals.user.id;
    partialEntry.status = req.body.status;

    await entryDAO.update(partialEntry);
    res.status(200).end();
});

export default router;