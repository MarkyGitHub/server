import { GraphQLError } from 'graphql';

throw new GraphQLError( message, {
    extensions: { code: 'YOUR_ERROR_CODE', myCustomExtensions },
} );