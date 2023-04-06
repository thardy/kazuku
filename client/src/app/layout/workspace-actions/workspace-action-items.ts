import {WorkspaceActionItem} from '@common/models/workspace-actions.model';
import {faCoffee} from '@fortawesome/free-solid-svg-icons';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import {faUser} from '@fortawesome/free-solid-svg-icons';

export const WorkspaceActionItems: WorkspaceActionItem[] = [
    {
        action: 'Profile',
        icon: faUser,
        label: 'Profile'
    },
    {
        action: 'logout',
        icon: faSignOutAlt,
        label: 'Logout'
    }
];
