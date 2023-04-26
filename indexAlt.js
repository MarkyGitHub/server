require('dotenv').config();
// Server declarations
const { ApolloServer } = require('apollo-server');
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
const { ApolloServerPluginInlineTrace } = require("apollo-server-core");

// Rest data source delarations
const { RESTDataSource } = require("apollo-datasource-rest");
const CustomerAPI = require("./services/rest/CustomerAPI");
const LoginAPI = require("./services/rest/LoginAPI");
const TimeRecordingAPI = require("./services/rest/TimeRecordingAPI");
const UserAPI = require("./services/rest/UserAPI");

// GraphQL types, etc. delarations
const { gql } = require('apollo-server');
const typeDefs = require('./graphql/schema');
//const resolvers = require('./graphql/resolvers');

const logger = require('./log/indexAlt');

/*  const aPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart(requestContext) {
    logger.log('Request started! Query:\n' +
      requestContext.request.query);

    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      async parsingDidStart(requestContext) {
        logger.log('Parsing started!');
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      async validationDidStart(requestContext) {
        console.log('Validation started!');
      },

    }
  },
};  */

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
 // resolvers,
  logger,
  introspection: true,
  // csrfPrevention: true,
  // cache: 'bounded',
  /* cors: {
    origin: process.env.yourOrigin,
    credentials: true
  }, */
  /*  apollo: {
     key: process.env.APOLLO_KEY,
   }, */
  /*  context: ({ req }) => {
     // Note: This example uses the `req` argument to access headers,
     // but the arguments received by `context` vary by integration.
     // This means they vary for Express, Koa, Lambda, etc.
     //
     // To find out the correct arguments for a specific integration,
     // see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields
 
     // Get the user token from the headers.
     const token = req.headers.authorization || '';
 
     // Try to retrieve a user with the token
     const user = getUser(token);
 
     // Add the user to the context
     return { user };
   }, */
  plugins: [
    {
      async requestDidStart(requestContext) {
        console.log('Request started ... Query is:\n' +
          requestContext.request.query);
        return {
          // Fires whenever Apollo Server will parse a GraphQL
          // request to create its associated document AST.
          async parsingDidStart(requestContext) {
            console.log('Parsing started....');
          },
          // Fires whenever Apollo Server will validate a
          // request's document AST against your GraphQL schema.
          async validationDidStart(requestContext) {
            console.log('Validation started ...');
          },
        }
      },
      async serverWillStart() {
        console.log('Server Bry-IT starting up....');
        //logger.log('Server Bry-IT starting up....');
      },
    },

    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ApolloServerPluginInlineTrace()],

  dataSources: () => {    
    return {
      restURL: process.env.pwabackend_local,
      //customerAPI: new CustomerAPI(restURL),
      loginAPI: new LoginAPI(restURL),
     // timeRecordingAPI: new TimeRecordingAPI(restURL),
     // userAPI: new UserAPI(restURL),
    };
  },
 
});

// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test
if (process.env.NODE_ENV !== 'test') {  
  server.listen().then(() => {
    console.log(`Server is running at http://localhost:4000`);
    //ogger.info('verbose', `Server is running at http://localhost:4000`);
  });
}

// export all the important pieces for integration/e2e tests to use
module.exports = {
  typeDefs,
  logger,
  ApolloServer,
  server,
};