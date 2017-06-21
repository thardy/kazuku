export class Organization {
    id: string;
    name: string;
    code: string;
    description: string;
    statusId: number;

    constructor(options: {
        id?: string,
        name?: string,
        code?: string,
        description?: string,
        statusId?: number
    } = {}) {
        this.id = options.id;
        this.name = options.name || '';
        this.code = options.code || '';
        this.description = options.description || '';
        this.statusId = options.statusId || 0;
    }

}
