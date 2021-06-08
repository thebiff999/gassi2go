/* Autor: Dennis Heuermann */

import { Entity } from './entity';

export interface Entry extends Entity{
    id: string;
    createdAt: number;
    type: 'walk' | 'care';
    date: string;
    pay: number;
    status: 'open' | 'requested' | 'assigned';
    description: string;
    ownerId: string;
    ownerName: string;
    dogId: string;
    dogName: string;
    dogRace: string;
    lat: string;
    lng: string;
    imageUrl: string;
    requesterId?: string;
    requesterName?: string;
}