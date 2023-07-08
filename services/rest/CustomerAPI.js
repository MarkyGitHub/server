import { RESTDataSource } from '@apollo/datasource-rest';

import cookie from 'cookie';

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

        if (this.context.req.headers.cookie) {
        const cookieHeader = this.context.req.headers.cookie;
        const cookies = cookie.parse(cookieHeader);
        const jwtToken = cookies.jwtToken;

        request.headers.set( 'Authorization', `Bearer ${jwtToken}` );
        }

    }

    // POST
    async postCreatePromoSamples ( entities )
    {
        const data = this.post( `webresources/customer`, entities        );
        return data;
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