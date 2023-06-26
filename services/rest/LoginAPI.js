const { RESTDataSource } = require( 'apollo-datasource-rest' );
const { GraphQLJSON, GraphQLJSONObject } = require( 'graphql-type-json' );

class LoginAPI extends RESTDataSource
{

    constructor ( $restURL )
    {
        super();
        this.baseURL = $restURL;
    }

    willSendRequest ( request )
    {
        request.headers.set( 'Content-Type', 'application/json' );
        request.headers.set( 'Accept-Encoding', 'gzip' );
        //request.headers.set('Access-Control-Allow-Origin', '*');
        //request.headers.set('Authorization', this.$token);
    }

    async parseBody(response) {
        const text = await response.text();
    
        if (text.startsWith('{') || text.startsWith('[')) {
          try {
            return JSON.parse(text);
          } catch (error) {
            return text;
          }
        } else {
          return text;
        }
      }

    // GET
    async getPing ()
    {
        const data = await this.get( `${ this.baseURL }webresources/login` );
        return data;
    }

    // POST
    async postLogin(username, password) {
        try {
          const data = await this.post(`${this.baseURL}webresources/login`,
            { "username": username, "password": password },
          );
            
          return {
              id: data.id,
              name: data.name,
              firstName: data.firstName,
              salutation: data.salutationLabel,
              status: data.status,
              username: data.userName,
              roles: data.promoterRoles,
              companyName: data.company.companyName,
              areaName: data.company.areaName,
              locked : data.status != 'AKTIV',
              jwtToken : data.jwtToken,
              errorMessage : ''

          }
        } catch (error) {
          console.log("ERROR");
          console.log(error);
          if (error.extensions?.code === 'FORBIDDEN') {
            console.log('User is not authorized, blocked, or not active');

            return {
              id: 0,
              name: '',
              firstName: '',
              salutation: 'Frau',
              status: 'INAKTIV',
              username: '',
              roles: [''],
              companyName: '',
              areaName: '',
              locked : true,
              jwtToken : '',
              errorMessage : error.extensions.response.body

          }
            
          } else if (error.extensions?.code === 'ECONNREFUSED') {
            console.log('Request has errors! Errors:\n ECONNREFUSED' + error);
          } else {
            console.log(error);
          }
        }
      }
}

module.exports = LoginAPI;