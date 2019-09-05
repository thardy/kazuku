import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {WorkspaceActionItem} from '../../common/models/workspace-actions.model';
import {WorkspaceActionItems} from './workspace-action-items';

@Injectable({
    providedIn: 'root'
})
export class WorkspaceActionsService {

    constructor() {
    }

    getActions(): Observable<WorkspaceActionItem[]> {
        return of(WorkspaceActionItems);
    }
}
