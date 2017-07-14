export class Organization {
    id: number;
    name: string;
    code: string;
    description: string;
    statusId: number;
    isMetaOrg: boolean;

    constructor(options: {
        id?: number,
        name?: string,
        code?: string,
        description?: string,
        statusId?: number,
        isMetaOrg?: boolean
    } = {}) {
        this.id = options.id;
        this.name = options.name || '';
        this.code = options.code || '';
        this.description = options.description || '';
        this.statusId = options.statusId || 0;
        this.isMetaOrg = options.isMetaOrg || false;
    }

}
