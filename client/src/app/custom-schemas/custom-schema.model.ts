export class CustomSchema {
    id: string;
    orgId: string;
    contentType: string;
    jsonSchema: any;

    constructor(options: {
        id?: string,
        orgId?: string,
        contentType?: string,
        jsonSchema?: string
    } = {}) {
        this.id = options.id;
        this.orgId = options.orgId || '';
        this.contentType = options.contentType || '';
        this.jsonSchema = options.jsonSchema || '';
    }
}

//{
//    id: 1,
//    orgId: 1,
//    contentType: 'Applicant',
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

