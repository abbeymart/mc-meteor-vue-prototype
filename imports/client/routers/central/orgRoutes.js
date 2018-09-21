/**
 * Created by abbeymart on 2017-02-18.
 */

import Organization from '../../apps/central/organization/Organization.vue';
import OrganizationList from '../../apps/central/organization/OrganizationList.vue';
import OrganizationDetail from '../../apps/central/organization/OrganizationDetail.vue';
import OrganizationNew from '../../apps/central/organization/OrganizationNew.vue';
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

export const orgRoutes = [
    {
        path      : '/organization',
        name      : 'organization',
        redirect  : '/organization/list',
        components: {
            default: Organization,
        },
        children  : [
            {
                path      : 'list',
                name      : 'organizationList',
                components: {
                    default: OrganizationList,
                }
            },
            {
                path      : 'detail',
                name      : 'organizationDetail',
                components: {
                    default: OrganizationDetail,
                }
            },
            {
                path      : 'new',
                name      : 'organizationNew',
                components: {
                    default: OrganizationNew,
                }
            },
            {
                path      : 'address',
                name      : 'orgAddress',
                redirect  : 'address/list',
                components: {
                    default: Address
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'orgAdddressList',
                        components: {
                            default: AddressList
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'orgAddressDetail',
                        components: {
                            default: AddressDetail
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'orgAddressNew',
                        components: {
                            default: AddressNew
                        }
                    },
                ]
            },
            {
                path      : 'phone',
                name      : 'orgPhone',
                redirect  : 'phone/list',
                components: {
                    default: Phone
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'orgPhoneList',
                        components: {
                            default: PhoneList
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'orgPhoneDetail',
                        components: {
                            default: PhoneDetail
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'orgPhoneNew',
                        components: {
                            default: PhoneNew
                        }
                    },
                ]
            },
            {
                path      : 'contact',
                name      : 'orgContact',
                redirect  : 'contact/list',
                components: {
                    default: Contact
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'orgContactList',
                        components: {
                            default: ContactList
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'orgContactDetail',
                        components: {
                            default: ContactDetail
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'orgContactNew',
                        components: {
                            default: ContactNew
                        }
                    },
                ]
            },
        ]
    },
];
