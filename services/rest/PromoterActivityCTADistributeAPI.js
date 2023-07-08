import { RESTDataSource } from '@apollo/datasource-rest';

import cookie from 'cookie';

class PromoterActivityCTADistribute extends RESTDataSource
{

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

        //request.headers.set( 'Authorization', `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJNb3JnZW5nb2xkIiwiZXhwIjoxNjg2MzgzNzIwLCJ1c2VySWQiOiIwNzU1MDIiLCJpYXQiOjE2ODU1MTk3MjAsImp0aSI6IjM2YTQ4YjE2LTAyYWUtNDljNS1hYzY4LWIyYTg0NTY3ZjI1NSJ9.VUyUnJ_WHWY15SdwWTF3meDDkKSOF7tW4YvoM_iwukM` );

        if (this.context.req.headers.cookie) {
        const cookieHeader = this.context.req.headers.cookie;
        const cookies = cookie.parse(cookieHeader);
        const jwtToken = cookies.jwtToken;

        request.headers.set( 'Authorization', `Bearer ${jwtToken}` );
        }
    }

    // POST
    async postCreatePromoterActivityCTADistribute ( entities )
    {
        console.log("POST CREATE PROMOTER ACTIVITY DRIVE");
        console.log(entities);
        const data = this.post( `webresources/promoterActivityCTADistribute`, entities);
        return data;
    }

}
module.exports = PromoterActivityCTADistribute;