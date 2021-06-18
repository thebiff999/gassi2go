import express from 'express';
import bcrypt from 'bcryptjs';
import { GenericDAO } from '../models/generic.dao.js';
import { User } from '../models/user.js';
import { Hund } from '../models/hunde';
import { Entry } from '../models/entry';
import { authService } from '../services/auth.service.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const userDAO: GenericDAO<User> = req.app.locals.userDAO;
  const errors: string[] = [];

  const sendErrorMessage = (message: string) => {
    authService.removeToken(res);
    console.log(`error: ${message}`);
    console.log(req.body);
    res.status(400).json({ message });
  };

  if (!hasRequiredFields(req.body, ['email', 'firstName', 'lastName', 'password', 'passwordCheck'], errors)) {
    return sendErrorMessage(errors.join('\n'));
  }

  if (req.body.password !== req.body.passwordCheck) {
    return sendErrorMessage('Die beiden Passwörter stimmen nicht überein.');
  }

  const filter: Partial<User> = { email: req.body.email };
  if (await userDAO.findOne(filter)) {
    return sendErrorMessage('Es existiert bereits ein Konto mit der angegebenen E-Mail-Adresse.');
  }

  const createdUser = await userDAO.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10)
  });
  authService.createAndSetToken({ id: createdUser.id }, res);
  res.status(201).json(createdUser);
});

router.post('/sign-in', async (req, res) => {
  console.log('received post on /users/sign-in');
  const userDAO: GenericDAO<User> = req.app.locals.userDAO;
  const filter: Partial<User> = { email: req.body.email };
  const errors: string[] = [];

  if (!hasRequiredFields(req.body, ['email', 'password'], errors)) {
    res.status(400).json({ message: errors.join('\n') });
    console.log(errors)
    return;
  }

  const user = await userDAO.findOne(filter);

  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    authService.createAndSetToken({ id: user.id }, res);
    res.status(201).json(user);
  } else {
    authService.removeToken(res);
    res.status(401).json({ message: 'E-Mail oder Passwort ungültig!' });
  }
});

router.delete('/sign-out', (req, res) => {
  authService.removeToken(res);
  res.status(200).end();
});

router.delete('/', authService.expressMiddleware, async (req, res) => {
  const userDAO: GenericDAO<User> = req.app.locals.userDAO;
  const hundeDAO: GenericDAO<Hund> = req.app.locals.hundeDAO;
  const entryDAO: GenericDAO<Entry> = req.app.locals.entryDAO;

  await hundeDAO.deleteAll({ besitzerId: res.locals.user.id });
  await entryDAO.deleteAll({ ownerId: res.locals.user.id });
  await userDAO.delete(res.locals.user.id);

  authService.removeToken(res);
  res.status(200).end();
});

function hasRequiredFields(object: { [key: string]: unknown }, requiredFields: string[], errors: string[]) {
  let hasErrors = false;
  requiredFields.forEach(fieldName => {
    if (!object[fieldName]) {
      errors.push(fieldName + ' darf nicht leer sein.');
      hasErrors = true;
    }
  });
  return !hasErrors;
}

export default router;
