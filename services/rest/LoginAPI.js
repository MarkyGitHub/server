import pkg from "@apollo/datasource-rest";
const { RESTDataSource, AugmentedRequest } = pkg;
import { ApolloServerErrorCode } from "@apollo/server/errors";
import parser from "body-parser";
const { json } = parser;

class LoginAPI extends RESTDataSource
{
  constructor ( $restURL )
  {
    super();
    this.baseURL = $restURL;
  }

  async postData ( url = "", data = {} )
  {
    const response = await fetch( url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify( data ),
    } );
    if ( !response.ok )
    {
      throw new Error( `HTTP error! status: ${ response.status }` );
    }
    try
    {
      const text = await response.text();
      //console.log("LENGTH", text.length);
      if ( text.length > 0 )
      {
        const jsonResponse = JSON.parse( text );
        return jsonResponse;
      }
      return {};
    } catch ( error )
    {
      console.error( 'Error:', error );
      return {};
    }
  }

  willSendRequest ( _path, request )
  {
    request.headers[ "Content-Type" ] = "application/json";
    request.headers[ "Accept-Encoding" ] = "gzip";
  }

  async parseBody ( response )
  {
    const text = await response.text();

    if ( text.startsWith( "{" ) || text.startsWith( "[" ) )
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
      const data = await this.postData( `${ this.baseURL }webresources/login`,
        {
          "username": username,
          "password": password
        }
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
        locked: data.status != "AKTIV",
        jwtToken: data.jwtToken,
        errorMessage: "",
        deliveryArea: data.company.deliveryArea
      };
    } catch ( error )
    {
      console.log( "ERROR" );
      console.log( error );
      if ( error.message.indexOf( '401' ) != -1 )
      {
        console.log( "User is not authorized, blocked, or not active" );

        return {
          id: 0,
          name: "",
          firstName: "",
          salutation: "Frau",
          status: "INAKTIV",
          username: "",
          roles: [ "" ],
          companyName: "",
          areaName: "",
          locked: true,
          jwtToken: "",
          errorMessage: "Falscher Benutzername oder Passwort",
          deliveryArea: [ "" ],
        };
      } else
        if ( error.message.indexOf( '403' ) != -1 )
        {
          console.log( "User is not authorized, blocked, or not active" );

          return {
            id: 0,
            name: "",
            firstName: "",
            salutation: "Frau",
            status: "INAKTIV",
            username: "",
            roles: [ "" ],
            companyName: "",
            areaName: "",
            locked: true,
            jwtToken: "",
            errorMessage: "Benutzer nicht authorisiert, blockiert oder nicht aktiv",
            deliveryArea: [ "" ],
          };
        } else if ( error.message.indexOf( 'Fetch failed' ) != -1 )
        {
          console.log( "REST-Server nicht erreichbar!" );
          return {
            id: 0,
            name: "",
            firstName: "",
            salutation: "Frau",
            status: "INAKTIV",
            username: "",
            roles: [ "" ],
            companyName: "",
            areaName: "",
            locked: true,
            jwtToken: "",
            errorMessage: "REST-Server nicht erreichbar",
            deliveryArea: [ "" ],
          };
        } else
        {
          console.log( "Other mistakes in server distribution" );

          return {
            id: 0,
            name: "",
            firstName: "",
            salutation: "Frau",
            status: "INAKTIV",
            username: "",
            roles: [ "" ],
            companyName: "",
            areaName: "",
            locked: true,
            jwtToken: "",
            errorMessage: error.message,
            deliveryArea: [ "" ],
          };
        }
    }
  }
}
export default LoginAPI;
