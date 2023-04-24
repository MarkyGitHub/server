import { ApolloServer } from 'apollo-server-express';
import fs from 'fs';
import https from 'https';
import http from 'http';

require('dotenv').config();
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');

const typeDefs = require('./graphql/schema');

async function startApolloServer() {
    const configurations = {
      // Note: You may need sudo to run on port 443
      production: { ssl: true, port: 443, hostname: 'morgengold.de' },
      development: { ssl: true, port: 4000, hostname: 'mogo.ibry-it.local' },
      playground: { ssl: false, port: 4000, hostname: 'localhost' },
    };
  
    const environment = process.env.NODE_ENV || 'production';
    const config = configurations[environment];
  
    const server = new ApolloServer({
        typeDefs,
        introspection: true,
        csrfPrevention: true,
        cache: 'bounded',
        cors: {
            origin: process.env.yourOrigin,
            credentials: true
        },
        apollo: {
            key: process.env.APOLLO_KEY,
        },
        context: ({ req }) => {
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
          },
        plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
    });
    await server.start();
  
    const app = express();
    server.applyMiddleware({ app });
  
    // Create the HTTPS or HTTP server, per configuration
    let httpServer;
    if (config.ssl) {
      // Assumes certificates are in a .ssl folder off of the package root.
      // Make sure these files are secured.
      httpServer = https.createServer(
        {
          key: fs.readFileSync(`./ssl/${environment}/server.key`),
          cert: fs.readFileSync(`./ssl/${environment}/server.crt`),
        },
  
        app,
      );
    } else {
      httpServer = http.createServer(app);
    }
  
    await new Promise((resolve) => httpServer.listen({ port: config.port }, resolve));
  
    console.log('🚀 Server ready at', `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${server.graphqlPath}`);
  
    return { server, app };
  }






// Set up Apollo Server
const server = new ApolloServer({
    typeDefs,
    introspection: true,
    csrfPrevention: true,
    cache: 'bounded',
    cors: {
        origin: process.env.yourOrigin,
        credentials: true
    },
    apollo: {
        key: process.env.APOLLO_KEY,
    },
    context: ({ req }) => {
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
      },
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
});

// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test
if (process.env.NODE_ENV !== 'test') {
    server.listen().then(() => {
        console.log(`Server is running at http://localhost:4000`);
    });
}

// export all the important pieces for integration/e2e tests to use
module.exports = {
    typeDefs,
    ApolloServer,
    server,
};