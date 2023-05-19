const { RESTDataSource } = require( 'apollo-datasource-rest' );
const { GraphQLJSON, GraphQLJSONObject } = require( 'graphql-type-json' );

class LoginAPI extends RESTDataSource
{

    // $jwt;

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

    // GET
    async getPing ()
    {
        const data = await this.get( `${ this.baseURL }webresources/login` );
        return data;
    }

    // POST
    async postLogin ( username, password )
    {
        try
        {
            const data = await this.post( `${ this.baseURL }webresources/login`, // path
                //{ "username": "marek", "password": "mgf" },
                { "username": username, "password": password }, // request body
            );
            /*   try
              {
                  this.$jwt = JSON.parse( data, arguments =>  defaultReviver() );
              } catch ( e )
              {
                  console.log( e );
                  return null;
              } */
            return data;
        } catch ( error )
        {
            console.log( error );

        }

    }

    /* defaultReviver ( key, value )
    {
        if ( key === 'jwtToken' )
        {
            return value;
        }

        if ( typeof value === 'undefined' ) { return null; }
        if ( reviver !== undefined ) { reviver(); }
    }; */
}

module.exports = LoginAPI;