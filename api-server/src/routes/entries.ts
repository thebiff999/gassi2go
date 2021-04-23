/* Autor: Dennis Heuermann */

import express from 'express';
import { GenericDAO } from '../models/generic.dao';
import { Entry } from '../models/entry';
import {} from 'uuid';

const router = express.Router();

router.post('/', async (req, res) => {
    const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;
    const errors: string[] = [];

    //const newEntry = await entryDAO.create({
    //
    //});
});