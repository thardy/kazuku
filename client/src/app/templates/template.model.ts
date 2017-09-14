export class Template {
    id: string;
    orgId: string;
    siteId: string;
    name: string;
    description: string;
    url: string;
    layout: string;
    template: string;

    constructor(options: {
        id?: string,
        orgId?: string,
        siteId?: string,
        name?: string,
        description?: string,
        url?: string,
        layout?: string,
        template?: string
    } = {}) {
        this.id = options.id;
        this.orgId = options.orgId;
        this.siteId = options.siteId;
        this.name = options.name || '';
        this.description = options.description;
        this.url = options.url;
        this.layout = options.layout || '';
        this.template = options.template || '';
    }

}
