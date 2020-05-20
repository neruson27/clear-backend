import Boom from 'boom'
import { verifyToken } from '../utils/token-generator'
import { getCredentials } from '../utils/get-credentials'



const scheme = (server, options) => {
  return {
    authenticate: async function (request, h) {
      const credentials = await getCredentials(request.headers.authorization)
      console.log('credentials authentication: ', credentials);
      return h.authenticated(credentials)

      /*const req = request.raw.req;
      const authorization = req.headers.authorization;
      if (!authorization) {
          throw Boom.unauthorized(null, 'Custom');
      }

      return h.authenticated({ credentials: { user: 'john' } });*/

      /*let token = request.headers.authorization;
      let credentials;
      console.log('----> middleware authorization excecuted: ', token);

      // if (!token) return h.authenticated({credentials:{user: null}});
      if (!token) return h.authenticated({credentials:{}});

          // if (err.name === 'TokenExpiredError') 
          //   return h.response({ message: 'token expired' })
          //   .code(400)
          //   .type('application/json')
          
          //{ TokenExpiredError: jwt expired
          //    ....
          //  name: 'TokenExpiredError',
          //  message: 'jwt expired',
          //  expiredAt: 2018-06-29T19:29:32.000Z }
           
          
          console.log('hay token: ', token);
          token = await verifyToken(token);
          // name: 'TokenExpiredError',
          // message: 'jwt expired',

          if (token.error) {
            if (token.error.message === 'jwt expired'){
              credentials = {
                error: 'token-expired'
              }
            }
            // invalid signature ocurre cuando el token no fue verificado con la misma secret con la que fue generado
            else if (token.error.message === 'invalid signature'){
              credentials = {
                error: 'invalid-token'
              }
            }
            else {
              credentials = {
                error: token.error.message
              }
            }
            return h.authenticated({credentials});
          }
          // si no hubo error al verificar el token
          else {
            credentials = {
              user:{ 
                id: token.data.id,
                username: token.data.username,
                role: token.data.role
              }
            }
            return h.authenticated({credentials});
          }*/
          
          
          // nota: si se hace una solicitud con token y este esta caducado, se rechaza la solicitud y en el frontend se 
          // determina que hacer:
          // 1. si el path de la consultado no auth, se elimina el token de localStorage y se vuelve hacer la consulta o se redirige a a home
          // 2. si el path de la consulta require auth, entonces se solicita 
          
          // return Boom.forbidden(err[err.name], {message: err.message});

    }
  }
}

const validate = (decoded, request) => {

  console.log('----> validate strategy jwt :D');
  return { isValid: true }
}


exports.plugin = {
  name:'get-header-token',
  version: '1.0.0',
  register: async (server, options, next) => {
    console.log('plugin get-header-token registered');
    server.auth.scheme('custom', scheme);
    server.auth.strategy('default', 'custom');
    server.auth.default({
      strategy: 'default',
      mode: 'optional'
    })
    

    // server.register(require('hapi-auth-jwt2'));
    // server.auth.strategy('jwt','jwt', {
    //   key: server.app.server.config.secret,
    //   validate: validate,
    //   verifyOptions: {
    //     algorithms: ['HS256']
    //   },
    //   mode: 'optional'
    // });

    /*server.auth.default({
      mode: 'optional',
      strategy: 'jwt'
    });*/
  }

  // const validate = async (request, username, password) => {

  //     const user = users[username];
  //     if (!user) {
  //         return { credentials: null, isValid: false };
  //     }

  //     const isValid = await Bcrypt.compare(password, user.password);
  //     const credentials = { id: user.id, name: user.name };

  //     return { isValid, credentials };
  // };
  
}
