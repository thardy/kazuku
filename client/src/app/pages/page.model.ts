import {Template} from "../templates/template.model";

export class Page extends Template {
    url: string;

    constructor(options: {
        id?: number,
        orgId?: number,
        siteId?: number,
        name?: string,
        layout?: string,
        template?: string,
        url?: string
    } = {}) {
        super(options);
        this.url = options.url;
    }
}

