/* Autor: Prof. Dr. Norman Lahme-Hütig (FH Münster) */

import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import { BrowserContext } from 'playwright';
import config from './config';

export class UserSession {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  token?: string;

  name: string;
  rasse: string;
  gebDate: string;
  infos: string;

  constructor(public context: BrowserContext) {
    const uuid = uuidv4();
    this.firstName = `firstname_${uuid}`;
    this.lastName = `lastname_${uuid}`;
    this.email = `email_${uuid}@example.org`;
    this.password = `pw_${uuid}`;

    this.name = 'Janka';
    this.rasse = 'Bernasenne';
    this.gebDate = '2016-03-17';
    this.infos = 'Hund für die Auftragserstellung e2e-Tests';
  }

  signInData() {
    return { email: this.email, password: this.password };
  }

  signUpData() {
    return { firstName: this.firstName, lastName: this.lastName, email: this.email, password: this.password, passwordCheck: this.password };
  }

  dogData() {
    return { name: this.name, rasse: this.rasse, gebDate: this.gebDate,  infos: this.infos };
  }

  async registerUser() {
    const response = await fetch(config.serverUrl('users'), {
      method: 'POST',
      body: JSON.stringify(this.signUpData()),
      headers: { 'Content-Type': 'application/json' }
    });
    const cookie = response.headers.raw()['set-cookie'].find(cookie => cookie.startsWith('jwt-token'));
    if (!cookie) {
      throw new Error('Failed to extract jwt-token');
    }
    this.token = cookie.split('=')[1].split(';')[0];

    await this.context.addCookies([
      { name: 'jwt-token', value: this.token!, domain: new URL(config.serverUrl('')).hostname, path: '/' }
    ]);
  }

  async deleteUser() {
    const response = await fetch(config.serverUrl('users'), {
      method: 'DELETE',
      headers: { Cookie: `jwt-token=${this.token}` }
    });
    if (response.status !== 200) {
      throw new Error('Failed to delete user for token ' + this.token);
    }
    await this.context.clearCookies();
  }

  //Autor: Simon Flathmann
  async createDog() {
    const response = await fetch(config.serverUrl('hunde'), {
      method: 'POST',
      body: JSON.stringify(this.dogData()),
      headers: { Cookie: `jwt-token=${this.token}`, 'Content-Type': 'application/json' }
    });
  }

}
