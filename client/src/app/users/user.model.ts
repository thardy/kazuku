export class User {
    id: number;
    orgId: number;
    email: string;
    password: string;

    constructor(options: {
        id?: number,
        orgId?: number,
        email?: string,
        password?: string,
    } = {}) {
        this.id = options.id;
        this.orgId = options.orgId;
        this.email = options.email || '';
        this.password = options.password || '';

    }

}
