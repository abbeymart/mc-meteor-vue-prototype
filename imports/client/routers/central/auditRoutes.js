/**
 * Created by abbeymart on 2017-03-06.
 */
import Audit from '../../apps/central/audit/Audit.vue';
import AuditList from '../../apps/central/audit/AuditList.vue';
import AuditDetail from '../../apps/central/audit/AuditDetail.vue';
import AuditNew from '../../apps/central/audit/AuditNew.vue';
import AuditListAccess from '../../apps/central/audit/AuditListAccess.vue';
import AuditListCreate from '../../apps/central/audit/AuditListCreate.vue';
import AuditListUpdate from '../../apps/central/audit/AuditListUpdate.vue';

export const auditRoutes = [
    {
        path      : '/audit',
        name      : 'audit',
        redirect  : '/audit/access',
        components: {
            default: Audit,
        },
        children  : [
            {
                path      : 'list',
                name      : 'auditList',
                components: {
                    default: AuditList,
                }
            },
            {
                path      : 'detail',
                name      : 'auditDetail',
                components: {
                    default: AuditDetail,
                }
            },
            {
                path      : 'new',
                name      : 'auditNew',
                components: {
                    default: AuditNew,
                }
            },
            {
                path      : 'access',
                name      : 'auditListAccess',
                components: {
                    default: AuditListAccess,
                }
            },
            {
                path      : 'create',
                name      : 'auditListCreate',
                components: {
                    default: AuditListCreate,
                }
            },
            {
                path      : 'update',
                name      : 'auditListUpdate',
                components: {
                    default: AuditListUpdate,
                }
            },
        ]
    },
];
