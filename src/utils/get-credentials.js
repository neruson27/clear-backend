import { verifyToken } from './token-generator'

export async function getCredentials (token) {
  let credentials;
  // console.log('----> middleware authorization excecuted: ', token);

  // if (!token) return h.authenticated({credentials:{user: null}});
  if (!token) return {credentials:{}};

    // if (err.name === 'TokenExpiredError') 
    //   return h.response({ message: 'token expired' })
    //   .code(400)
    //   .type('application/json')
    /*
    { TokenExpiredError: jwt expired
        ....
      name: 'TokenExpiredError',
      message: 'jwt expired',
      expiredAt: 2018-06-29T19:29:32.000Z }
     */
    
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
      return {credentials};
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
      return {credentials};
    }
}