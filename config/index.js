module.exports = {
    "development": {
        "username": "bryITApollo",
        "password": "ApolloDev",
        "database": "ApolloDB",
        "host": "localhost",
        "dialect": "mariadb",
        "pool": {
            "max": 5,
            "min": 0,
            "acquire": 30000,
            "idle": 10000
        }
    },
    "production": {       
        "username": process.env.username,
        "password": process.env.password,
        "database": process.env.database,
		 "host": process.env.host,
        "logging": false,
        "dialect": "mariadb",
        "pool": {
            "max": 5,
            "min": 0,
            "acquire": 30000,
            "idle": 10000
        }
    }
}
