import pkg from '@apollo/datasource-rest';
const { RESTDataSource, AugmentedRequest } = pkg;
import { ApolloServerErrorCode } from '@apollo/server/errors';
import parser from 'body-parser';
const { json } = parser;

class LoginAPI extends RESTDataSource
{

  constructor ( $restURL )
  {
    super();
    this.baseURL = $restURL;
  }

  willSendRequest ( _path, request )
  {



    request.headers[ 'Content-Type' ] = 'application/json';
    request.headers[ 'Accept-Encoding' ] = 'gzip';
  }

  async parseBody ( response )
  {
    const text = await response.text();

    if ( text.startsWith( '{' ) || text.startsWith( '[' ) )
    {
      try
      {
        return JSON.parse( text );
      } catch ( error )
      {
        return text;
      }
    } else
    {
      return text;
    }
  }

  // GET
  async getPing ()
  {
    return this.get( `${ this.baseURL }webresources/login` );

  }

  // POST
  async postLogin ( username, password )
  {
    try
    {
      console.log( username + " " + password );
      /* const data = await this.post( `${ this.baseURL }webresources/login`,
        {
          "username": "075502",
          "password": "mgf"
        }
      ); */

      const stringify = JSON.stringify( {

        username: "075502",

        password: "mgf"

      } );
      console.log( stringify + "  stringify " );

      const path = `${ this.baseURL }webresources/login`;

      const request = {

        body: stringify,
        headers: { 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip' }

      };

      let data = await this.post( path, request )

        .then( response =>
        {

          console.log( response );

        } )

        .catch( error =>
        {
          console.log( " ERROR!" );
          console.error( error );

        } );

      console.log( data + "--------------------" );
      return {
        id: data.id,
        name: data.name,
        firstName: data.firstName,
        salutation: data.salutationLabel,
        status: data.status,
        username: data.userName,
        roles: data.promoterRoles,
        //companyName: data.company.companyName,
        // areaName: data.company.areaName,
        locked: data.status != 'AKTIV',
        jwtToken: data.jwtToken,
        errorMessage: '',
        //deliveryArea: data.company.deliveryArea

      }
    } catch ( error )
    {
      console.log( "ERROR" );
      console.log( error );
      if ( error.extensions?.code === 'FORBIDDEN' )
      {
        console.log( 'User is not authorized, blocked, or not active' );

        return {
          id: 0,
          name: '',
          firstName: '',
          salutation: 'Frau',
          status: 'INAKTIV',
          username: '',
          roles: [ '' ],
          companyName: '',
          areaName: '',
          locked: true,
          jwtToken: '',
          errorMessage: error.extensions?.response.body,
          deliveryArea: [ '' ]

        }

      } else if ( error.errno === 'ECONNREFUSED' )
      {
        console.log( 'Server not reachable! Errors:\n ECONNREFUSED' + error );
        return {
          id: 0,
          name: '',
          firstName: '',
          salutation: 'Frau',
          status: 'INAKTIV',
          username: '',
          roles: [ '' ],
          companyName: '',
          areaName: '',
          locked: true,
          jwtToken: '',
          errorMessage: 'Server not reachable',
          deliveryArea: [ '' ]

        }
      } else
      {
        console.log( "Other mistakes in server distribution" );
        console.log( error.extensions?.response.body );
        return {
          id: 0,
          name: '',
          firstName: '',
          salutation: 'Frau',
          status: 'INAKTIV',
          username: '',
          roles: [ '' ],
          companyName: '',
          areaName: '',
          locked: true,
          jwtToken: '',
          errorMessage: error.extensions?.response.body,
          deliveryArea: [ '' ]

        }
      }
    }
  }
}
export default LoginAPI;