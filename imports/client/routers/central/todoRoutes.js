/**
 * Created by abbeymart on 2017-02-22.
 */
import Todo from '../../apps/central/todo/Todo.vue';
import TodoList from '../../apps/central/todo/TodoList.vue';
import TodoDetail from '../../apps/central/todo/TodoDetail.vue';
import TodoNew from '../../apps/central/todo/TodoNew.vue';
import Assignment from '../../apps/central/todo/assignment/Assignment.vue';
import AssignmentList from '../../apps/central/todo/assignment/AssignmentList.vue';
import AssignmentDetail from '../../apps/central/todo/assignment/AssignmentDetail.vue';
import AssignmentNew from '../../apps/central/todo/assignment/AssignmentNew.vue';

export const todoRoutes = [
    {
        path      : '/todo',
        name      : 'todo',
        redirect  : '/todo/list',
        components: {
            default: Todo,
        },
        children  : [
            {
                path      : 'list',
                name      : 'todoList',
                components: {
                    default: TodoList,
                }
            },
            {
                path      : 'detail',
                name      : 'todoDetail',
                components: {
                    default: TodoDetail,
                }
            },
            {
                path      : 'new',
                name      : 'todoNew',
                components: {
                    default: TodoNew,
                }
            },
            {
                path      : 'assignment',
                name      : 'assignment',
                redirect  : 'assignment/list',
                components: {
                    default: Assignment,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'assignmentList',
                        components: {
                            default: AssignmentList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'assignmentDetail',
                        components: {
                            default: AssignmentDetail,
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'assignmentNew',
                        components: {
                            default: AssignmentNew,
                        }
                    },
                ]
            },
        ],
    },
];
