/* Autor: Simon Flathmann */

import { Entity } from './entity';

export interface Hund extends Entity {
  besitzerId: string;
  name: string;
  rasse: string;
  gebDate: string;
  infos: string;
  imgName: string;
  imgData: string;
}
