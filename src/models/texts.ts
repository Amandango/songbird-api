import { Entity, property, model } from '@loopback/repository';

@model({
    name: "texts"
})

export class Texts extends Entity {
    @property({
        type: 'number',
        id: true
    })
    id?: number;

    @property({
        type: 'string',
        required: true
    })
    userId: string;

    @property({
        type: 'string',
        required: true
    })
    momentText: string;

    @property({
        type: 'string',
        required: true
    })
    momentTitle: string;

    @property({
        type: 'string',
        required: true
    })
    createdOn: string;
    
    getId() {
        return this.id;
    }
}