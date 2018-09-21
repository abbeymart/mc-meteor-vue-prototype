/**
 * Created by abbeymart on 2017-01-10.
 */
import ApolloClient from 'apollo-client';
import { meteorClientConfig } from 'meteor/apollo';

const client = new ApolloClient(meteorClientConfig());