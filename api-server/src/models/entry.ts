/* Autor: Dennis Heuermann */

import { Entity } from './entity';

export interface Entry extends Entity{
    id: string;
    createdAt: number;
    type: 'walk' | 'care';
    date: Date;
    pay: number;
    status: 'open' | 'requested' | 'assigned';
    description: string;
    ownerId: number;
    ownerName: string;
    dogId: number;
    dogName: string;
    dogRace: string;
    lat: string;
    lng: string;
    imageUrl: string;
    requesterId?: number;
    requesterName?: string;
}