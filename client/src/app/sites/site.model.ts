export interface ISite {
    id: string;
    orgId: string;
    code: string;
    name: string;
    domain: string;
}

export class Site {
    id: string;
    orgId: string;
    code: string;
    name: string;
    domain: string;

    constructor(options: {
        id?: string,
        orgId?: string,
        code?: string,
        name?: string,
        domain?: string,
    } = {}) {
        this.id = options.id;
        this.orgId = options.orgId;
        this.code = options.code ?? '';
        this.name = options.name ?? '';
        this.domain = options.domain ?? '';
    }

}

export function compareSites(a: ISite, b: ISite) {
    // a decent way to sort strings (it might work for numbers too)
    return +(a.code > b.code) || -(a.code < b.code)
}

