'use strict'

import http from 'http'
import { ApolloServer } from 'apollo-server-express';
import { extractMessage } from '../utils/handle-errors';
import { getCredentials } from '../middleware/authorization'
import config from '../config'

import typeDefs from './schemas'
import resolvers from './resolvers'

const env = process.env.NODE_ENV

async function captureError (error) {
  // hay errores de validacion de mongo que anexan otro texto al mensaje de error peronalizado
  // ej: ValidationError: bankAccounts.1.dni: dni-invalid-format, 
  // se filtra el mensaje con la expresion regular
  const match = await error.message.match(regexSearchError)
  if (match) error.message = message[0]
  return error
}


export default async function (app) {

  
  const server = new ApolloServer({
    typeDefs, 
    resolvers,
    method: 'POST',
    playground: env == 'development', // nueva interfaz grafica para probar esquema
    subscribe: true,
    onOperation: (message, params) => {
      console.log(`
          -----------------------
          - onOperation - 
          message: ${message}
          params: ${params}
          -----------------------
          `)
    },
    context: async ({req, connection}) => {
    // context: (req) => {
      if (connection) {
        // console.log('---: req: ', req)
        // console.log('---: connection: ', connection)
        connection.context.credentials = await getCredentials(connection.variables.authorization)
        return connection.context
      }
      if (req) {
        // console.log('----:: context rq: ', req)
        const params = {dirBase: app.dirBase}
        params.credentials = req.credentials
        return params
      }
      return;
    },
    // debe estar activo para que los errores se envien en modo produccion,
    // para evitar enviar toda la traza, se formatea
    debug: true,
    subscriptions: {
      path: '/subscriptions',
      onConnect: async (connectionParams, webSocket) => {
        console.log('-------: subscription client connected')
        console.log('-------: subscription connectionParams: ',connectionParams)
        const req = {authorization: connectionParams.authorization}
        const credentials = await getCredentials(connectionParams.authorization)
        console.log('-------: subscription credentials: ', credentials)
        return {credentials}
      },
      onOperation: (message, params, websocket) => {
        console.log(`
          -----------------------
          message: ${message}
          params: ${params}
          websocket: ${websocket}
          -----------------------
          `)
        return
      },
      execute: (schema, document, rootValue, contextValue, variableValues, operationName) => {
        console.log(`
          -----------------------
          schema: ${schema}
          document: ${document}
          rootValue: ${rootValue}
          contextValue: ${contextValue}
          variableValues: ${variableValues}
          operationName: ${operationName}
          -----------------------
          `)
      },
      onDisconnect: (webSocket, context) => {
        console.log('---- cliente subscription desconected ............')
      }
    },
    formatError: error => {
      console.log(error);
      console.log(error.extensions.exception.stacktrace);
      try {
        // const code = error.extensions.exception.name
        // error.extensions.code = code;
        // error.code = code;
        console.log('error message: ', error.message);

        // hay errores de validacion de mongo que anexan otro texto al mensaje de error peronalizado
        // ej: ValidationError: bankAccounts.1.dni: dni-invalid-format, 
        // se filtra el mensaje con la expresion regular
        error.message = extractMessage(error);
        // if (match) error.message = match[0]

        // si el servidor corre en modo dev, se retorna el error completo
        if (env == 'development') {
          return error;
        }

        // de lo contrario solo se retorna el codigo del error
        // return {message: error.message}
        return {message: error.message};
        // return error;
      }
      catch(error) {
        console.log('formatError: ', error);
      }
    },
  });

  // ruta para graphql
  const path = '/graphql'

  // aplicar middleware auth aqui
  // app.use(path, authorization);

  server.applyMiddleware({ 
    app, 
    path
  });

  const httpServer = http.createServer(app)

  // await server.installSubscriptionHandlers({port: config.server.port});
  await server.installSubscriptionHandlers(httpServer);

  httpServer.listen(config.server.port,() => {
    console.log(`🚀 Server ready at http://localhost:${config.server.port}${server.graphqlPath}`)
    console.log(`🚀 Subscriptions ready at ws://localhost:${config.server.port}${server.subscriptionsPath}`)  })

}