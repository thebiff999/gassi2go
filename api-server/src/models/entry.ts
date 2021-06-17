/* Autor: Dennis Heuermann */

import { Entity } from './entity';

export interface Entry extends Entity{
    id: string;
    createdAt: number;
    type: 'walk' | 'care';
    date: string;
    pay: number;
    status: 'open' | 'assigned' | 'done';
    description: string;
    ownerId: string;
    dogId: string;
    dogName: string;
    dogRace: string;
    lat: string;
    lng: string;
    imgName: string;
    imgData: string;
    requesterId?: string | null;
}