/* Autor: Dennis Heuermann */

import { Entity } from './entity';

export interface Entry extends Entity{
    ownerId: number;
    dogId: number;
    dogName: string;
    coords: {lat: number, lng: number};
    imageUrl: string;
}