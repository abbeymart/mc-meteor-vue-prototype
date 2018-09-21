/**
 * Created by abbeymart on 2017-02-12.
 */
import Convert from '../../apps/central/conversion/Convert.vue';
import ConvertList from '../../apps/central/conversion/ConvertList.vue';
import ConvertDetail from '../../apps/central/conversion/ConvertDetail.vue';
import ConvertNew from '../../apps/central/conversion/ConvertNew.vue';

export const utilRoutes = [
    {
        path      : '/convert',
        name      : 'convert',
        redirect  : '/convert/list',
        components: {
            default: Convert,
        },
        children  : [
            {
                path      : 'list',
                name      : 'convertList',
                components: {
                    default: ConvertList,
                }
            },
            {
                path      : 'detail',
                name      : 'convertDetail',
                components: {
                    default: ConvertDetail,
                }
            },
            {
                path      : 'new',
                name      : 'convertNew',
                components: {
                    default: ConvertNew,
                }
            },
        ]
    },

];

