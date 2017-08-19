export class Site {
    id: string;
    orgId: string;
    code: string;
    name: string;
    domainName: string;

    constructor(options: {
        id?: string,
        orgId?: string,
        code?: string,
        name?: string,
        domainName?: string,
    } = {}) {
        this.id = options.id;
        this.orgId = options.orgId;
        this.code = options.code || '';
        this.name = options.name || '';
        this.domainName = options.domainName || '';
    }

}

