export class CustomSchema {
    id: string;
    orgId: string;
    contentType: string;
    description: string;
    jsonSchema: any;

    constructor(options: {
        id?: string,
        orgId?: string,
        contentType?: string,
        description?: string,
        jsonSchema?: any
    } = {}) {
        this.id = options.id;
        this.orgId = options.orgId;
        this.contentType = options.contentType || '';
        this.description = options.description || '';
        this.jsonSchema = options.jsonSchema || {};
    }
}

//{
//    id: 1,
//    orgId: 1,
//    contentType: 'Applicant',
//    description: 'this is cool'
//    jsonSchema: {
//    "type": "object",
//        "properties": {
//        "affiliatedWith": {
//            "type": "string",
//                "name": "affiliatedWith",
//                "title": "Affiliated With"
//        },
//        "favoriteNumber": {
//            "type": "number",
//                "name": "favoriteNumber",
//                "title": "Favorite Number"
//        },
//        "likes": {
//            "type": "string",
//                "name": "likes",
//                "title": "Likes"
//        }
//    }
// };

