import {FormControl} from "@angular/forms";

export class SetupConfig {
    id: string; // here just to satisfy BaseModel requirement (oh the joys of typed programming forced onto javascript)
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
        this.id = null;
        this.adminPassword = options.adminPassword || '';
        this.adminPasswordConfirm = options.adminPasswordConfirm || '';
        this.metaOrgName = options.metaOrgName || '';
        this.metaOrgCode = options.metaOrgCode || '';
    }

}

export interface SetupConfigForm {
    adminPassword: FormControl<string>;
    adminPasswordConfirm: FormControl<string>;
    metaOrgName: FormControl<string>;
    metaOrgCode: FormControl<string>;
}

