import path from 'path'

import express from 'express'
import cors from 'cors';
import helmet from 'helmet';
import initMongo from './utils/mongodb'
import graphql from './graphql'
import authorization from './middleware/authorization'


/**
 * incremento el numero de clientes conectados a las subscripcion
 * pero esto es una solución temporal, lo idela es utilizar:
 * - https://github.com/davidyaha/graphql-redis-subscriptions
 * - https://github.com/davidyaha/graphql-mqtt-subscriptions
 */
require('events').EventEmitter.defaultMaxListeners = 30

let env;
if (process.env.NODE_ENV) {
    env = process.env.NODE_ENV
}
// si no se indica el entorno, siempre será dev
else {
  env = 'development'
  process.env.NODE_ENV = 'development';
}

const serveStatic = require('serve-static')

const app = express();

// setear cabeceras de seguridad
app.use(helmet());

// solo usado para probar 
app.use(cors());

// habilitar cors solo si no es produccion
if (env !== 'production') {
  // let whitelist = ['http://192.168.1.10', 'http://192.168.1.17']
  // let corsOptions = {
  //   origin: function (origin, callback) {
  //     console.log('-------> origin: ', origin);
  //     if (whitelist.indexOf(origin) !== -1) {
  //       callback(null, true)
  //     } else {
  //       callback(new Error('Not allowed by CORS'))
  //     }
  //   }
  // }
  // habilitar cors usando la libreria y pasando opciones
  // app.use(cors(corsOptions));
  
  // habilitar cors usando la libreria
  app.use(cors());

  // habilitar cors manualmente
  // app.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   next();
  // });
}

// asignación de directorio base
app.dirBase = __dirname;
console.log(app.dirBase)

app.use("/files", serveStatic (__dirname + '/files' ));
console.log(`
  :---------------------------------------

    port: ${process.env.PORT || 4000}

  :------------------------------------------

  `)


/*
  sobre apollo graphql
  - seguridad
  https://www.apollographql.com/docs/guides/security.html
  For security, Apollo Server introspection is automatically disabled when the NODE_ENV is set to production or testing. For those wishing to allow introspection, the functionality can be explicitly enabled by setting introspection to true on the ApolloServer constructor options.
  
  - subir archivos
  https://www.apollographql.com/docs/guides/file-uploads.html  

  - gestionar errores
  https://www.apollographql.com/docs/apollo-server/features/errors.html
 */


app.use(authorization);

// habiliar peticions options
app.options('/graphql', (req, res, next) => {
  console.log('---> peticion options....');
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.status(200).send('Permitted!');
});


// inicializar dependencias y modulos
const init = async () => {
  try {
    // statements
    await initMongo(app);
    await graphql(app);

    const listen = { 
      port: process.env.PORT || 3000 
    }
  } catch(e) {
    // statements
    console.log(e);
  }
  
  process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
    // Recommended: send the information to sentry.io
    // or whatever crash reporting service you use
  })
}

init()