const config = {
  development: {
    PORT: 3000,
    DB_CONNECTION_URL: "mongodb://localhost/login_system_v1",
    COOKIE_PARSER_SECRET: "keyboard cats",
    EXPRESS_SESSION_SECRET: "keyboard cats"
  },
  production: {
    PORT: 3000,
    DB_CONNECTION_URL: "mongodb://localhost/login_system_v1",
    COOKIE_PARSER_SECRET: "keyboard cats",
    EXPRESS_SESSION_SECRET: "keyboard cats"
  }
}

module.exports = config[process.env.NODE_ENV];