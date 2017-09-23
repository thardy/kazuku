import {SuiModal, ComponentModalConfig, ModalSize} from "ng2-semantic-ui"
import {Component} from "@angular/core";

interface IConfirmModalContext {
    title: string;
    question: string;
}

@Component({
    selector: 'modal-confirm',
    templateUrl: './modal.component.html'
})
export class ModalComponent {
    constructor(public modal: SuiModal<IConfirmModalContext, void, void>) {
    }
}
