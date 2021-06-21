/* Autor: Dennis Heuermann */

import { UserSession } from './user-session';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

describe('/entries', () => {
  let userSession: UserSession;

  beforeEach(async () => {
    userSession = new UserSession();
    await userSession.registerUser();
  });

  afterEach(async () => {
    await userSession.deleteUser();
  });

  const image = fs.readFileSync(__dirname + '/../../../api-server/resources/default.txt').toString();

  const id = uuidv4();

  const entry = {
    art: 'walk',
    datum: '2022-12-12',
    entlohnung: 20,
    status: 'open',
    beschreibung: 'Wuffi ist ein ganz lieber und kann gut mit Kindern',
    hundId: id,
    hundName: 'Wuffi',
    hundRasse: 'Dackel',
    lat: '5.0000',
    lng: '40.0000',
    imgName: 'defaultImage',
    imgData: image
  };

  describe('#GET', () => {
    it('should return all entries', async () => {
      await userSession.post('entries', entry);
      const response = await userSession.get('entries');
      const entries = (await response.json()).results;
      expect(response.status).toBe(200);
      expect(entries[0]).not.toBeNull();
    });

    it('should return the requested entry', async () => {
      const resp = await userSession.post('entries', entry);
      const entryResp = await resp.json();
      const response = await userSession.get('entries/id/' + entryResp.id);
      expect(response.status).toBe(200);
    });

    it('should return 404 when requesting a non-existing entry', async () => {
      const wrongId = uuidv4();
      const response = await userSession.get('entries/id/' + wrongId);
      expect(response.status).toBe(404);
    });

    it('should return 400 when the requested id does not match the uuid4 pattern', async () => {
      const response = await userSession.get('entries/id/12345!');
      expect(response.status).toBe(400);
    });

    it('should return the assigned entries', async () => {
      const response1 = await userSession.post('entries', entry);
      const createdEntry = await response1.json();
      createdEntry.status = 'assigned';
      const id = createdEntry.id;
      await userSession.patch('entries/id/' + id, createdEntry);
      const response2 = await userSession.get('entries/assigned');
      const assignedEntries = (await response2.json()).results;
      expect(assignedEntries.length).toBeGreaterThan(0);
    });

    it('should return 404 status when no entries are assigned', async () => {
      const response = await userSession.get('entries/assigned');
      expect(response.status).toBe(404);
    });
  });

  describe('#POST', () => {
    it('should return status 201', async () => {
      const response = await userSession.post('entries', entry);
      expect(response.status).toBe(201);
    });
  });

  describe('#PATCH', () => {
    it('should return 200 when patching the entry', async () => {
      await userSession.post('entries', entry);
      const dog = entry;
      dog.status = 'assigned';
      const response = await userSession.patch('entries/id/' + id, dog);
      expect(response.status).toBe(200);
    });

    it('should return 400 status when patching with an invalid id', async () => {
      const response = await userSession.patch('entries/id/12345', entry);
      expect(response.status).toBe(400);
    });
  });

  describe('#DELETE', () => {
    it('should return 400 status for invalid delete requests', async () => {
      const wrongId = uuidv4();
      const response = await userSession.delete('entries/user/' + wrongId);
      expect(response.status).toBe(400);
    });
  });
});
