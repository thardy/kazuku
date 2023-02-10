import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {WorkspaceActionItem} from '../../common/models/workspace-actions.model';
import {WorkspaceActionsService} from './workspace-actions.service';
import {IUserContext} from '../../common/auth/user-context.model';
import {AuthActions, AuthSelectors} from '../../common/auth/store';
import {Store} from '@ngrx/store';

@Component({
    selector: 'kz-workspace-actions',
    templateUrl: './workspace-actions.component.html',
    styleUrls: ['./workspace-actions.component.less']
})
export class WorkspaceActionsComponent implements OnInit {
    actionItems$: Observable<WorkspaceActionItem[]>;
    userContext$: Observable<IUserContext>;

    constructor(private actionItemsService: WorkspaceActionsService,
                private store: Store) {
    }

    ngOnInit() {
        this.userContext$ = this.store.select(AuthSelectors.selectUserContext);
        this.actionItems$ = this.actionItemsService.getActions();
    }

    logout() {
        this.store.dispatch(AuthActions.logoutButtonClicked());
    }

}
