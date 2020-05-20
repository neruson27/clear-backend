import { verifyToken } from '../utils/token-generator'
import {User} from '../models/user'

export async function getCredentials (authorization) {
  let credentials = {}
  if (authorization) {
    const token = await verifyToken(authorization);
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
    }
    else {
      credentials = {
        user : token.data
      }
    }
  }
  // si no hay authorization en header
  
  return credentials
}

export default async function authozation(req, res, next) {
  // authorization viene como una cadena vacia ''
  const autorization = req.headers.authorization
  req.credentials = await getCredentials(autorization)
  console.log('middleware authorization .................');
  return next();
}
