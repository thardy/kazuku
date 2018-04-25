export class Query {
    id: string;
    orgId: string;
    siteId: string;
    name: string;
    nameId: string;
    query: string;
    results: string;

    constructor(options: {
        id?: string,
        orgId?: string,
        siteId?: string,
        name?: string,
        nameId?: string,
        query?: string,
        results?: string
    } = {}) {
        this.id = options.id;
        this.orgId = options.orgId;
        this.siteId = options.siteId;
        this.name = options.name || '';
        this.nameId = options.nameId || '';
        this.query = options.query || '';
        this.results = options.results || '';
    }

}

