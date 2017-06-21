export class Template {
    id: string;
    orgId: number;
    siteId: number;
    name: string;
    layout: string;
    template: string;

    constructor(options: {
        id?: string,
        orgId?: number,
        siteId?: number,
        name?: string,
        layout?: string,
        template?: string
    } = {}) {
        this.id = options.id;
        this.orgId = options.orgId;
        this.siteId = options.siteId;
        this.name = options.name || '';
        this.layout = options.layout || '';
        this.template = options.template || '';
    }

}
