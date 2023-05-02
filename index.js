require('dotenv').config();
// Server declarations
const { ApolloServer, gql } = require('apollo-server');
const { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginInlineTrace } = require('apollo-server-core');
//const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');

// Rest data source delarations
const { RESTDataSource } = require("apollo-datasource-rest");
//const CustomerAPI = require("./services/rest/CustomerAPI");
const LoginAPI = require("./services/rest/LoginAPI");
//const TimeRecordingAPI = require("./services/rest/TimeRecordingAPI");
//const UserAPI = require("./services/rest/UserAPI");

// GraphQL types, etc. delarations
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

//Logger
const winston = require('winston');
const { format, createLogger, transports } = require("winston");
const { combine, timestamp, label, printf, prettyPrint } = format;
const CATEGORY = "VertriebsApp format";

/* const aPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart(requestContext) {
    winston.log('Request started! Query:\n' +
      requestContext.request.query);

    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      async parsingDidStart(requestContext) {
        winston.log('Parsing started!');
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      async validationDidStart(requestContext) {
        console.log('Validation started!');
      },

    }
  },
}; */

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    label({ label: CATEGORY }),
    timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    prettyPrint()
  ),
  transports: [
    new transports.File({
      filename: './log/error.log',
      level: 'error',
    }),
    new transports.File({
      filename: './log/combined.log',
      level: 'verbose',
    }),
    new transports.Console(),
  ],
});

const url = process.env.yourOrigin
//process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  logger,
  dataSources: () => {
    return {
      //customerAPI: new CustomerAPI(restURL),     
      loginAPI: new LoginAPI(process.env.pwabackend_local),
      // timeRecordingAPI: new TimeRecordingAPI(restURL),
      // userAPI: new UserAPI(restURL), 
    }
  },
  context: async () => {
    return {logger}
  },
  introspection: true,
  csrfPrevention: true,
  cache: 'bounded',
  cors: {
    origin: [url, "https://studio.apollographql.com"],
    credentials: true
  },     
 
  /*  apollo: {
     key: process.env.APOLLO_KEY,
   }, */
  /* context: ({ req }) => {
     // Note: This example uses the `req` argument to access headers,
     // but the arguments received by `context` vary by integration.
     // This means they vary for Express, Koa, Lambda, etc.
     //
     // To find out the correct arguments for a specific integration,
     // see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields
 
     // Get the user token from the headers.
     const token = req.headers.authorization || '';
 
     // Try to retrieve a user with the token
     const user = getUser();
 
     // Add the user to the context
     return { user };
   }, */
  plugins: [
   // aPlugin,
    {
      /* async requestDidStart(requestContext) {
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
      }, */
      async serverWillStart() {
        console.log('Server Bry-IT starting up....');
      },
    },
    ApolloServerPluginLandingPageLocalDefault({ embed: true })]
  //ApolloServerPluginInlineTrace()],

});

// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test
if (process.env.NODE_ENV !== 'test') {
  server.listen().then(() => {
    console.log(`Server is running at ` + url);
    logger.log('verbose', `Server is running at ` + url);
  });
}

// export all the important pieces for integration/e2e tests to use
module.exports = {
  typeDefs,
  resolvers,
  logger,
  ApolloServer,
  server,
};