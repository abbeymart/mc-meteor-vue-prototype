/**
 * Created by abbeymart on 2016-12-27.
 */
import UserAccount from '../../apps/central/user/UserAccount.vue';
import UserList from '../../apps/central/user/UserList.vue';
import UserDetail from '../../apps/central/user/UserDetail.vue';
import UserNew from '../../apps/central/user/UserNew.vue';
import Register from '../../apps/central/user/Register.vue';
import VerifyUser from '../../apps/central/user/VerifyUser.vue';
import SendVerifyUser from '../../apps/central/user/SendVerifyEmail.vue';
import Login from '../../apps/central/user/Login.vue';
import Logout from '../../apps/central/user/Logout.vue';
import ChangeEmail from '../../apps/central/user/ChangeEmail.vue';
import ChangeUsername from '../../apps/central/user/ChangeUsername.vue';
import ChangePassword from '../../apps/central/user/ChangePassword.vue';
import ResetPassword from '../../apps/central/user/ResetPassword.vue';
import SetPassword from '../../apps/central/user/SetPassword.vue';
import RecoverPassword from '../../apps/central/user/RecoverPassword.vue';
import RecoverUsername from '../../apps/central/user/RecoverUsername.vue';
import Address from '../../apps/central/address/Address.vue';
import AddressList from '../../apps/central/address/AddressList.vue';
import AddressDetail from '../../apps/central/address/AddressDetail.vue';
import AddressNew from '../../apps/central/address/AddressNew.vue';
import Phone from '../../apps/central/phone/Phone.vue';
import PhoneList from '../../apps/central/phone/PhoneList.vue';
import PhoneDetail from '../../apps/central/phone/PhoneDetail.vue';
import PhoneNew from '../../apps/central/phone/PhoneNew.vue';
import Contact from '../../apps/central/contact/Contact.vue';
import ContactList from '../../apps/central/contact/ContactList.vue';
import ContactDetail from '../../apps/central/contact/ContactDetail.vue';
import ContactNew from '../../apps/central/contact/ContactNew.vue';
import Role from '../../apps/central/role/Role.vue';
import RoleList from '../../apps/central/role/RoleList.vue';
import RoleDetail from '../../apps/central/role/RoleDetail.vue';
import RoleNew from '../../apps/central/role/RoleNew.vue';
import Grant from '../../apps/central/role/grant/Grant.vue';
import GrantList from '../../apps/central/role/grant/GrantList.vue';
import GrantDetail from '../../apps/central/role/grant/GrantDetail.vue';
import GrantNew from '../../apps/central/role/grant/GrantNew.vue';
import UserRole from '../../apps/central/user/UserRole.vue';

export const userAccountRoutes = [
    {
        path      : '/register',
        name      : 'register',
        components: {
            default: Register
        }
    },
    {
        path      : '/verify-email/:token',
        components: {
            default: VerifyUser
        }
    },
    {
        path      : '/reset-password/:token',
        components: {
            default: SetPassword
        }
    },
    {
        path      : '/sendVerifyEmail',
        name      : 'sendVerifyEmail',
        components: {
            default: SendVerifyUser
        }
    },
    {
        path      : '/login',
        name      : 'login',
        components: {
            default: Login
        }
    },
    {
        path      : '/logout',
        name      : 'logout',
        components: {
            default: Logout
        }
    },
    {
        path      : '/resetPassword',
        name      : 'resetPassword',
        components: {
            default: ResetPassword
        }
    },
    {
        path      : '/recoverPassword',
        name      : 'recoverPassword',
        components: {
            default: RecoverPassword
        }
    },
    {
        path      : '/recoverUsername',
        name      : 'recoverUsername',
        components: {
            default: RecoverUsername
        }
    },
    {
        path      : '/userAccount',
        name      : 'userAccount',
        redirect  : '/userAccount/userList',
        components: {
            default: UserAccount,
        },
        children  : [
            {
                path      : 'userList',
                name      : 'userList',
                components: {
                    default: UserList
                }
            },
            {
                path      : 'userDetail',
                name      : 'userDetail',
                components: {
                    default: UserDetail
                }
            },
            {
                path      : 'userNew',
                name      : 'userNew',
                components: {
                    default: UserNew
                }
            },
            {
                path      : 'changePassword',
                name      : 'changePassword',
                components: {
                    default: ChangePassword
                }
            },
            {
                path      : 'changeUsername',
                name      : 'changeUsername',
                components: {
                    default: ChangeUsername
                }
            },
            {
                path      : 'changeEmail',
                name      : 'changeEmail',
                components: {
                    default: ChangeEmail
                }
            },
            {
                path      : 'verifyUser',
                name      : 'verifyUser',
                components: {
                    default: VerifyUser
                }
            },
            {
                path      : 'userRole',
                name      : 'userRole',
                components: {
                    default: UserRole
                }
            },
            {
                path      : 'role',
                name      : 'role',
                redirect  : 'role/list',
                components: {
                    default: Role
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'roleList',
                        components: {
                            default: RoleList
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'roleDetail',
                        components: {
                            default: RoleDetail
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'roleNew',
                        components: {
                            default: RoleNew
                        }
                    },
                ],
            },
            {
                path      : 'grant',
                name      : 'grant',
                redirect  : 'grant/list',
                components: {
                    default: Grant
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'grantList',
                        components: {
                            default: GrantList
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'grantDetail',
                        components: {
                            default: GrantDetail
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'grantNew',
                        components: {
                            default: GrantNew
                        }
                    },
                ]
            },
            {
                path      : 'address',
                name      : 'userAddress',
                redirect  : 'address/list',
                components: {
                    default: Address
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'userAddressList',
                        components: {
                            default: AddressList
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'userAddressDetail',
                        components: {
                            default: AddressDetail
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'userAddressNew',
                        components: {
                            default: AddressNew
                        }
                    },
                ]
            },
            {
                path      : 'phone',
                name      : 'userPhone',
                redirect  : 'phone/list',
                components: {
                    default: Phone
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'userPhoneList',
                        components: {
                            default: PhoneList
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'userPhoneDetail',
                        components: {
                            default: PhoneDetail
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'userPhoneNew',
                        components: {
                            default: PhoneNew
                        }
                    },
                ]
            },
            {
                path      : 'contact',
                name      : 'userContact',
                redirect  : 'contact/list',
                components: {
                    default: Contact
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'userContactList',
                        components: {
                            default: ContactList
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'userContactDetail',
                        components: {
                            default: ContactDetail
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'userContactNew',
                        components: {
                            default: ContactNew
                        }
                    },
                ]
            },
        ],
    },
    {
        path      : 'address',
        name      : 'address',
        components: {
            default: Address
        },
        children  : [
            {
                path      : 'list',
                name      : 'addressList',
                components: {
                    default: AddressList
                }
            },
            {
                path      : 'detail',
                name      : 'addressDetail',
                components: {
                    default: AddressDetail
                }
            },
            {
                path      : 'new',
                name      : 'addressNew',
                components: {
                    default: AddressNew
                }
            },
        ]
    },
    {
        path      : 'phone',
        name      : 'phone',
        components: {
            default: Phone
        },
        children  : [
            {
                path      : 'list',
                name      : 'phoneList',
                components: {
                    default: PhoneList
                }
            },
            {
                path      : 'detail',
                name      : 'phoneDetail',
                components: {
                    default: PhoneDetail
                }
            },
            {
                path      : 'new',
                name      : 'phoneNew',
                components: {
                    default: PhoneNew
                }
            },
        ]
    },
    {
        path      : 'contact',
        name      : 'contact',
        components: {
            default: Contact
        },
        children  : [
            {
                path      : 'list',
                name      : 'contactList',
                components: {
                    default: ContactList
                }
            },
            {
                path      : 'detail',
                name      : 'contactDetail',
                components: {
                    default: ContactDetail
                }
            },
            {
                path      : 'new',
                name      : 'contactNew',
                components: {
                    default: ContactNew
                }
            },
        ]
    },
];
