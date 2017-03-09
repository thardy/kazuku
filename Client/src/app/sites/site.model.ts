export class Site {
    id: number;
    orgId: number;
    siteCode: string;
    name: string;
    domainName: string;

    constructor(options: {
        id?: number,
        orgId?: number,
        siteCode?: string,
        name?: string,
        domainName?: string,
    } = {}) {
        this.id = options.id;
        this.orgId = options.orgId;
        this.siteCode = options.siteCode || '';
        this.name = options.name || '';
        this.domainName = options.domainName || '';
    }

}

