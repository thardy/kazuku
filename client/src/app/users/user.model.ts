export interface UserEmailLoginInformation {
    email: string;
    password: string;
}

export class User {
    id: string;
    orgId: string;
    email: string;
    password: string;
    isMetaAdmin: boolean;

    constructor(options: {
        id?: string,
        orgId?: string,
        email?: string,
        password?: string,
        isMetaAdmin?: boolean,
    } = {}) {
        this.id = options.id;
        this.orgId = options.orgId;
        this.email = options.email || '';
        this.password = options.password || '';
        this.isMetaAdmin = options.isMetaAdmin || false;
    }

}
