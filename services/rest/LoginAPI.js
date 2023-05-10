const { RESTDataSource, Request } = require( 'apollo-datasource-rest' );

class LoginAPI extends RESTDataSource
{
    constructor ( $restURLs )
    {
        super();
        this.baseURL = $restURLs;
    }

    willSendRequest ( request )
    {
        request.headers.set( 'Content-Type', 'application/json' );
        request.headers.set( 'Accept-Encoding', 'gzip' );
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
            const data = this.post( `${ this.baseURL }webresources/login`, // path               
                { "username": username, "password": password }, // request body
            );
            return data;
        } catch ( error )
        {
            console.log( error );
        }
    }
}

module.exports = LoginAPI;