import { RESTDataSource } from '@apollo/datasource-rest';

class TimeRecordingAPI extends RESTDataSource
{
    //$jwt;

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
        // request.headers.set( 'Authorization', 'Basic ' + this.token );
    }

    // POST
    async postCreate ( entities )
    {
        const data = this.post( `webresources/timerecording`, // path
            { entities }, // request body
        );
    }

    // PUT
    async newEdit ( id, entity )
    {
        const data = this.put( `webresources/timerecording/${ encodeURIComponent( id ) }`, // path
            entity, // request body
        );
    }

    // DELETE
    async deleteRemove ( id )
    {
        const data = this.delete(
            `webresources/timerecording/${ encodeURIComponent( id ) }`, // path
        );
    }

    // GET
    async getFind ( id )
    {
        const data = await this.get(
            `webresources/timerecording/${ encodeURIComponent( id ) }` // path
        );
        return data;
    }

    // GET
    async getFindByUser ( user )
    {
        const data = await this.get( `webresources/timerecording/` // path
        );
        return data;
    }

    // GET
    async getFindRange ( from, to )
    {
        const data = await this.get(
            `webresources/timerecording/${ encodeURIComponent( from / to ) }` // path
        );
        return data;
    }

    // GET
    async getCount ()
    {
        const data = await this.get( `webresources/timerecording/count` // path
        );
        return data;
    }

}
module.exports = TimeRecordingAPI;