/* Autor: Dennis Heuermann */

import express from 'express';
import { GenericDAO } from '../models/generic.dao';
import { Entry } from '../models/entry';
import {} from 'uuid';

const router = express.Router();

//create a new entry
router.post('/', async (req, res) => {
    const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
    const errors: string[] = [];

    //const newEntry = await entryDAO.create({
    //
    //});
});

//returns all open entries
router.get('/', async (req, res) => {
    console.log('received get on entries');
    const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
    const filter: Partial<Entry> = {status: 'open'};
    const entries = (await entryDAO.findAll(filter)).map(entry => {
        return {...entry}
    })
    res.json({ results: entries});
});

router.get('/:id', async(req, res) => {
    const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
    const entry = (await entryDAO.findOne({id: req.params.id}));
    if (!entry) {
        res.status(200).json(entry);
    }
});

router.post('/', async (req,res) => {
    const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
    const createdEntry = await entryDAO.create({
        type: req.body.type,
        date: req.body.date,
        pay: req.body.pay,
        status: 'open',
        description: req.body.description,
        ownerId: 123,
        ownerName: 'Max Mustermann',
        dogId: 123,
        dogName: 'Dackel',
        lat: '0',
        lng: '0',
        imageUrl: 'https://imgur.com'
    });
});
//returns all assigned entries
//TODO

//update entry with the requested id
router.patch('/:id', async (req, res) => {

});

//delete entry with requested id
router.delete('/:id', async (req, res) => {

});

export default router;