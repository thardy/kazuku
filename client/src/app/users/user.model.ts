export class User {
    id: string;
    orgId: string;
    email: string;
    password: string;

    constructor(options: {
        id?: string,
        orgId?: string,
        email?: string,
        password?: string,
    } = {}) {
        this.id = options.id;
        this.orgId = options.orgId;
        this.email = options.email || '';
        this.password = options.password || '';

    }

}
