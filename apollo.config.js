module.exports = {
    service: {
        name: 'Apollo-Server@Test-GraphQL',
        endpoint: {
            url:  "http://localhost:4000",
           /*  headers: {
              // optional
              //authorization: "Bearer lkjfalkfjadkfjeopknavadf",
            }, */
            skipSSLValidation: true, // optional, disables SSL validation check
          },

    },
};