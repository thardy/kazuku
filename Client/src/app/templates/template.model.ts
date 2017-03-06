export class Template {
    id: number;
    orgId: number;
    siteId: number;
    name: string;
    layout: string;
    template: string;

    constructor(options: {
        id?: number,
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
