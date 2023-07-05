const { RESTDataSource } = require( 'apollo-datasource-rest' );
const cookie = require('cookie');

class PromoterActivityHAAPI extends RESTDataSource
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

        request.headers.set( 'Authorization', `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJNb3JnZW5nb2xkIiwiZXhwIjoxNjg3NTI3ODkyLCJ1c2VySWQiOiIwNzU1MDIiLCJpYXQiOjE2ODY2NjM4OTIsImp0aSI6IjE1NjAwYzBmLTc5NWMtNDY0Yy1iZjQ4LTRiODU3MWI1ZjIxNSJ9.L0TgRM_gRp-4uXYrEmGGBIkN4WQM6jarIQW2CFHBan4` );

        /*if (this.context.req.headers.cookie) {
        const cookieHeader = this.context.req.headers.cookie;
        const cookies = cookie.parse(cookieHeader);
        const jwtToken = cookies.jwtToken;

        request.headers.set( 'Authorization', `Bearer ${jwtToken}` );
        }*/
    }

    // POST
    async postCreatePromoterActivityHA ( entities )
    {
        const data = this.post( `webresources/promoterActivityHA`, entities);
        return data;
    }

}
module.exports = PromoterActivityHAAPI;