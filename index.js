require( 'dotenv' ).config();
// Server declarations
const { ApolloServer, gql } = require( 'apollo-server' );
const { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginInlineTrace } = require( 'apollo-server-core' );
const { GraphQLJSON, GraphQLJSONObject } = require( 'graphql-type-json' );

// Rest data source delarations
const { RESTDataSource } = require( "apollo-datasource-rest" );
const CustomerAPI = require( "./services/rest/CustomerAPI" );
const LoginAPI = require( "./services/rest/LoginAPI" );
const TimeRecordingAPI = require( "./services/rest/TimeRecordingAPI" );
const UserAPI = require( "./services/rest/UserAPI" );

// GraphQL types, etc. delarations
const typeDefs = require( './graphql/schema' );
const resolvers = require( './graphql/resolvers' );

//Logger
const winston = require( 'winston' );
const { format, createLogger, transports } = require( "winston" );
const { combine, timestamp, label, printf, prettyPrint } = format;
const CATEGORY = "VertriebsApp format";

// Error handling
const { ApolloServerErrorCode } = require( '@apollo/server/errors' );
const { GraphQLError } = require( 'graphql' );

// Security, Authentication, CORS, etc.


const myPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart ( requestContext )
  {
    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      async parsingDidStart ( requestContext )
      {
        console.log( 'Parsing started!' );
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      async validationDidStart ( requestContext )
      {
        console.log( 'Validation started!' );
      },
      // Fires whenever Apollo Server will have errors
      async didEncounterErrors ( errors )
      {
        console.log( 'Request has errors! Errors:\n' + errors.extensions );
        console.log( 'Request has errors! Errors:\n' + errors.extensions.code );
        if ( errors.extensions?.code === ApolloServerErrorCode.INTERNAL_SERVER_ERROR )
        {
          //GraphQLError.extensions.code
          console.log( 'Request has internal server errors! Errors:\n' + errors );
        } else if ( errors.extensions?.code === 'ECONNREFUSED' )
        {
          console.log( 'Request has errors! Errors:\n ECONNREFUSED' + errors );

        }
        console.log( 'Request has errors! Errors:\n' + errors );
      }
    };
  },
};

const logger = winston.createLogger( {
  level: 'info',
  format: combine(
    label( { label: CATEGORY } ),
    timestamp( {
      format: "MMM-DD-YYYY HH:mm:ss",
    } ),
    prettyPrint()
  ),
  transports: [
    new transports.File( {
      filename: './log/error.log',
      level: 'error',
    } ),
    new transports.File( {
      filename: './log/combined.log',
      level: 'verbose',
    } ),
    new transports.Console(),
  ],
} );

const aOrigin = process.env.yourOrigin
const restURL = process.env.pwabackend_local

// Set up Apollo Server
const server = new ApolloServer( {
  typeDefs,
  resolvers,
  dataSources: () =>
  {
    return {
      customerAPI: new CustomerAPI( restURL ),
      loginAPI: new LoginAPI( restURL ),
      timeRecordingAPI: new TimeRecordingAPI( restURL ),
      userAPI: new UserAPI( restURL ),
    }
  },
  context: async () =>
  {
    return {
      logger,
    };
  },
  introspection: true,
  csrfPrevention: true,
  cache: 'bounded',
  cors: {
    origin: [ aOrigin, "https://studio.apollographql.com", 'http://localhost:3000', 'http://v50gf.ibry-it.local:4000/' ],
    credentials: true
  },
  plugins: [
    {
      async serverWillStart ()
      {
        console.log( 'Server Bry-IT starting up....' );
      },
      /* async requestDidStart ()
      {
        // token is properly inferred as a string
        console.log( 'Server Bry-IT stared!' );
      }, */
    },
    ApolloServerPluginLandingPageLocalDefault( { embed: true } ),
    ApolloServerPluginInlineTrace(), myPlugin
  ]
} );

/* const { url } = await startStandaloneServer( server, {
  context: async () =>
  {
    const customerAPI = new CustomerAPI( restURL );
    const loginAPI = new LoginAPI( restURL );
    const timeRecordingAPI = new TimeRecordingAPI( restURL );
    const userAPI = new UserAPI( restURL );
    return {
      dataSources: {
        customerAPI, loginAPI, timeRecordingAPI, userAPI
      },
      logger,
    };
  },
} ); */

// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test
if ( process.env.NODE_ENV !== 'test' )
{
  server.listen().then( () =>
  {
    console.log( `Server is running at ` + aOrigin );
    logger.log( 'verbose', `Server is running at ` + aOrigin );
  } );
}

// export all the important pieces for integration/e2e tests to use
module.exports = {
  typeDefs,
  resolvers,
  logger,
  ApolloServer,
  server,
};