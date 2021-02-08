const config = {
  development: {
    PORT: 3000,
    DB_CONNECTION_URL: "mongodb://localhost/login_system_v1"
  },
  production: {
    PORT: 3000,
    DB_CONNECTION_URL: "mongodb://localhost/login_system_v1"
  }
}

module.exports = config["development"];