import { Entity } from './entity';

export interface User extends Entity {
  userId: string;
  firstName: string;
  lastName: string;
  screenName: string;
  email: string;
}
