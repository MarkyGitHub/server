const { RESTDataSource } = require( 'apollo-datasource-rest' );

class CustomerAPI extends RESTDataSource
{
    // $jwt;

    constructor ( $restURL )
    {
        super();
        this.baseURL = $restURL;
        // this.$jwt = $jwtToken;
    }

    willSendRequest ( request )
    {
        request.headers.set( 'Content-Type', 'application/json' );
        request.headers.set( 'Accept-Encoding', 'gzip' );
        //request.headers.set( 'Authorization', 'Basic ' + this.$jwt );

    }

    // POST
    async postCreate ( entity )
    {
        const data = this.post( `webresources/customer/${ encodeURIComponent( a ) }`, // path
            { entity }, // request body
        );
    }

    // PUT
    async newEdit ( id, entity )
    {
        return this.put( `webresources/customer/${ encodeURIComponent( id ) }`, // path
            entity, // request body
        );
    }

    // DELETE
    async deleteRemove ( id )
    {
        return this.delete(
            `webresources/customer/${ encodeURIComponent( id ) }`, // path
        );
    }

    // GET
    async getFind ( id )
    {
        const data = await this.get(
            `webresources/customer/${ encodeURIComponent( id ) }` // path
        );
        return data;
    }

    // GET
    async getFindByUser ( user )
    {
        const data = await this.get(
            `webresources/customer/` // path
        );
        return data;
    }

    // GET
    async getFindRange ( from, to )
    {
        const data = await this.get(
            `webresources/customer/${ encodeURIComponent( from / to ) }` // path
        );
        return data;
    }

    // GET
    async getCount ()
    {
        const data = await this.get( `webresources/customer/count` // path
        );
        return data;
    }

}
module.exports = CustomerAPI;