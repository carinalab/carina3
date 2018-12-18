/* apirest.js file  Alexander Toscano Ricardo */

const env =
  process.env.NODE_ENV == undefined ? "production" : process.env.NODE_ENV;

const development = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT) || 3000,
    host: process.env.DEV_DB_HOST || "localhost"
  },
  dbSystem: {
    protocol: "mongodb",
    host: process.env.DEV_DB_HOST || "localhost",
    port: parseInt(process.env.DEV_DB_PORT) || 27017,
    name: process.env.DEV_DB_NAME || "systemdb"
  },
  dbCarina: {
    protocol: "mongodb",
    host: process.env.DEV_DB_HOST || "localhost",
    port: parseInt(process.env.DEV_DB_PORT) || 27017,
    name: process.env.DEV_DB_NAME || "carinadb"
  }
};

const production = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT) || 3000,
    host: process.env.DEV_DB_HOST || "localhost"
  },
  dbSystem: {
    protocol: "mongodb+srv",
    host:
      process.env.DEV_DB_HOST ||
      "carinaAdm:W1e2b3c4@cluster0-pc14x.mongodb.net/",
    name: process.env.DEV_DB_NAME || "carinag?retryWrites=true"
  },
  dbCarina: {
    protocol: "mongodb+srv",
    host:
      process.env.DEV_DB_HOST ||
      "admin:Z6r9GwAj5TrLB6dr@cluster0-a7xn6.mongodb.net/",
    name: process.env.DEV_DB_NAME || "carinabackup?retryWrites=true"
  }
};

const test = {
  app: {
    port: parseInt(process.env.TEST_APP_PORT) || 3000
  },
  db: {
    host: process.env.TEST_DB_HOST || "localhost",
    port: parseInt(process.env.TEST_DB_PORT) || 27017,
    name: process.env.TEST_DB_NAME || "test"
  }
};

const config = {
  production,
  development,
  test
};

exports.conf = config[env];
