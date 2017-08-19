import {Template} from "../templates/template.model";

export class Page extends Template {
    url: string;

    constructor(options: {
        id?: string,
        orgId?: string,
        siteId?: string,
        name?: string,
        layout?: string,
        template?: string,
        url?: string
    } = {}) {
        super(options);
        this.url = options.url;
    }
}

