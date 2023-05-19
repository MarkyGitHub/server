const { RESTDataSource } = require( 'apollo-datasource-rest' );

class UserAPI extends RESTDataSource
{

    //$jwt;

    constructor ( $restURL )
    {
        super();
        this.baseURL = $restURL;
        //  this.$jwt = $jwtToken;
    }

    willSendRequest ( request )
    {
        request.headers.set( 'Content-Type', 'application/json' );
        request.headers.set( 'Accept-Encoding', 'gzip' );
        //  request.headers.set( 'Authorization', 'Basic ' + this.token );
    }

    // GET
    async getFind ()
    {
        const data = await this.get( `webresources/user/userName` // path
        );

        return data;
    }

    // PUT
    async newEdit ( id, entity )
    {
        return this.put( `webresources/user/${ encodeURIComponent( id ) }`, // path
            entity, // request body
        );
    }

    // GET
    async getUserData ()
    {
        const data = await this.get( `webresources/user/userData` // path
        );
        return data;
    }

    // GET
    async getCount ()
    {
        const data = await this.get( `webresources/user/count` // path
        );
        return data;
    }

}
module.exports = UserAPI;