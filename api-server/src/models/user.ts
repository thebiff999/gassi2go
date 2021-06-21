/* Autor: Martin Feldman */

import { Entity } from './entity';

export interface User extends Entity {
  id: string;
  nickName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
