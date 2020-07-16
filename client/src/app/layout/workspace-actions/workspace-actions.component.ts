import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {WorkspaceActionItem} from '../../common/models/workspace-actions.model';
import {WorkspaceActionsService} from './workspace-actions.service';
import {UserService} from '../../users/user.service';
import {UserContext} from '../../users/user-context.model';

@Component({
    selector: 'kz-workspace-actions',
    templateUrl: './workspace-actions.component.html',
    styleUrls: ['./workspace-actions.component.less']
})
export class WorkspaceActionsComponent implements OnInit {
    actionItems$: Observable<WorkspaceActionItem[]>;
    userContext$: Observable<UserContext>;

    constructor(private userService: UserService,
                private actionItemsService: WorkspaceActionsService) {
    }

    ngOnInit() {
        this.userContext$ = this.userService.currentUserContext;
        this.actionItems$ = this.actionItemsService.getActions();
    }

    logout() {
        this.userService.logout();
    }

}
