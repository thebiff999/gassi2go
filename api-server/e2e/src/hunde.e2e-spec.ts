/* Autor: Simon Flathmann */

import { UserSession } from './user-session';

describe('/hunde', () => {
  let userSession: UserSession;

  beforeEach(async () => {
    userSession = new UserSession();
    await userSession.registerUser();
  });

  afterEach(async () => {
    await userSession.deleteUser();
  });

  describe('#POST', () => {
    it('should return a json with the created dog', async () => {
      const response = await userSession.post('/hunde', {
        name: 'Felix',
        rasse: 'Bolonka',
        gebDate: '2003-03-10',
        infos: 'Ein kleiner, verschmuster Hund. Bellt immer, wenn jemand an der Tür klingelt.'
      });
      const jsonRes = await response.json();
      expect(response.status).toBe(201);
      expect(jsonRes.name).toBe('Felix');
      expect(jsonRes.rasse).toBe('Bolonka');
      expect(jsonRes.gebDate).toBe('2003-03-10');
      expect(jsonRes.infos).toBe('Ein kleiner, verschmuster Hund. Bellt immer, wenn jemand an der Tür klingelt.');
      expect(jsonRes.imgName).toBeTruthy();
      expect(jsonRes.imgData).toBeTruthy();
      expect(jsonRes.id).toBeTruthy();
      expect(jsonRes.createdAt).toBeTruthy();
    });

    it('should fail required fields test', async () => {
      const response = await userSession.post('/hunde', {
        name: 'Felix',
        gebDate: '2003-03-10',
        infos: 'Ein kleiner, verschmuster Hund. Bellt immer, wenn jemand an der Tür klingelt.'
      });
      expect(response.status).toBe(400);
    });
  });

  describe('#GET', () => {
    it('should get status 404 because no dogs were found', async () => {
      const response = await userSession.get('/hunde');
      expect(response.status).toBe(404);
    });

    it('should return a list with 2 dogs', async () => {
      await userSession.post('/hunde', {
        name: 'Felix',
        rasse: 'Bolonka',
        gebDate: '2003-03-10',
        infos: 'Ein kleiner, verschmuster Hund. Bellt immer, wenn jemand an der Tür klingelt.'
      });
      await userSession.post('/hunde', {
        name: 'Maja',
        rasse: 'Landseer',
        gebDate: '2013-05-20',
        infos: 'Sie ist ein tollpatschiges, aber liebenswertes Mädchen.'
      });
      const response = await userSession.get('/hunde');
      const jsonRes = await response.json();
      expect(response.status).toBe(200);
      expect(jsonRes.results.length).toBe(2);
      expect(jsonRes.results[0].name).toBe('Maja');
      expect(jsonRes.results[1].name).toBe('Felix');
    });

    it('should return the a specific dog', async () => {
      await userSession.post('/hunde', {
        name: 'Felix',
        rasse: 'Bolonka',
        gebDate: '2003-03-10',
        infos: 'Ein kleiner, verschmuster Hund. Bellt immer, wenn jemand an der Tür klingelt.'
      });
      await userSession.post('/hunde', {
        name: 'Maja',
        rasse: 'Landseer',
        gebDate: '2013-05-20',
        infos: 'Sie ist ein tollpatschiges, aber liebenswertes Mädchen.'
      });
      const response = await userSession.get('/hunde');
      expect(response.status).toBe(200);
      const jsonRes = await response.json();
      const dogId = jsonRes.results[1].id;
      const singleRes = await userSession.get(`/hunde/${dogId}`);
      expect(singleRes.status).toBe(200);
      const jsonSingle = await singleRes.json();
      expect(jsonSingle.name).toBe('Felix');
    });
  });

  describe('#DELETE', () => {
    it('should create and delete the only dog', async () => {
      const response = await userSession.post('/hunde', {
        name: 'Felix',
        rasse: 'Bolonka',
        gebDate: '2003-03-10',
        infos: 'Ein kleiner, verschmuster Hund. Bellt immer, wenn jemand an der Tür klingelt.'
      });
      expect(response.status).toBe(201);
      const beforeDelete = await userSession.get('/hunde');
      expect(beforeDelete.status).toBe(200);
      const jsonRes = await response.json();
      const dogId = jsonRes.id;
      const delResponse = await userSession.delete(`/hunde/${dogId}`);
      expect(delResponse.status).toBe(200);
      const afterDelete = await userSession.get('/hunde');
      expect(afterDelete.status).toBe(404);
    });
  });
});
