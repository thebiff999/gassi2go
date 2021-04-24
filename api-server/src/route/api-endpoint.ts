/* Autor: Martin Feldman */

import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
  //logik einfügen, was soll passieren wenn ein post an diese Adresse gehen
});

// req = request, res = response (Antwort auf die Anfrage)

//Anfrage Post, Get, Patch, Delete

export default router;
