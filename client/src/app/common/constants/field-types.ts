import {faPalette, faCalendar, faGripVertical, faEllipsisH, faHashtag} from '@fortawesome/free-solid-svg-icons';

export enum FieldTypes {
    string = 'string',
    date = 'date',
    number = 'number',
    location = 'location',
    media = 'media',
    boolean = 'boolean',
    reference = 'reference'
}

export const FieldTypesUI = {
    gripIcon: faGripVertical,
    actionsIcon: faEllipsisH,
    string: {
        type: FieldTypes.string,
        label: 'Text',
        icon: faPalette
    },
    date: {
        type: FieldTypes.date,
        label: 'Date',
        icon: faCalendar
    },
    number: {
        type: FieldTypes.number,
        label: 'Number',
        icon: faHashtag
    }
};
