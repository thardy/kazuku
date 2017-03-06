export class Query {
    id: number;
    orgId: number;
    siteId: number;
    name: string;
    query: string;
    results: string;

    constructor(options: {
        id?: number,
        orgId?: number,
        siteId?: number,
        name?: string,
        query?: string,
        results?: string
    } = {}) {
        this.id = options.id;
        this.orgId = options.orgId;
        this.siteId = options.siteId;
        this.name = options.name || '';
        this.query = options.query || '';
        this.results = options.results || '';
    }

}

