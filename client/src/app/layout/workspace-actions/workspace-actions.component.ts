import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {WorkspaceActionItem} from '../../common/models/workspace-actions.model';
import {WorkspaceActionsService} from './workspace-actions.service';
import {AuthService} from '../../common/auth/auth.service';
import {UserContext} from '../../common/auth/user-context.model';

@Component({
    selector: 'kz-workspace-actions',
    templateUrl: './workspace-actions.component.html',
    styleUrls: ['./workspace-actions.component.less']
})
export class WorkspaceActionsComponent implements OnInit {
    actionItems$: Observable<WorkspaceActionItem[]>;
    userContext$: Observable<UserContext>;

    constructor(private userService: AuthService,
                private actionItemsService: WorkspaceActionsService) {
    }

    ngOnInit() {
        this.userContext$ = this.userService.userContext$;
        this.actionItems$ = this.actionItemsService.getActions();
    }

    logout() {
        this.userService.logout();
    }

}
