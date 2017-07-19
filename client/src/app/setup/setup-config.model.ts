export class SetupConfig {
    adminPassword: string;
    adminPasswordConfirm: string;
    metaOrgName: string;
    metaOrgCode: string;

    constructor(options: {
        adminPassword?: string,
        adminPasswordConfirm?: string,
        metaOrgName?: string,
        metaOrgCode?: string,
    } = {}) {
        this.adminPassword = options.adminPassword || '';
        this.adminPasswordConfirm = options.adminPasswordConfirm || '';
        this.metaOrgName = options.metaOrgName || '';
        this.metaOrgCode = options.metaOrgCode || '';
    }

}

