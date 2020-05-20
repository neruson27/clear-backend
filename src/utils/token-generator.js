'use strinct'

import jwt from 'jsonwebtoken';
import moment from 'moment';
import config from '../config';

// token para la sesion de un usuario
const sessionToken = (user, expire) =>{
  const token = {}
  expire = moment().add(expire, "seconds").unix();
  token.payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    iat: moment().unix(),
    exp: expire,
  };                  
  token.code = jwt.sign(token.payload, config.secret);
  token.expire = expire
  return { code: token.code, expire: token.expire };
}

const createChallengeToken = (play) =>{
  
  const expire = moment().add(5, "minutes").unix();
  const token = {}
  token.payload = {
    play: play,
    // action: 'create'
    // iat: moment().unix(),
    // exp: expire,
  };               
  // token.expire = expire
  return jwt.sign(token.payload, config.secret);
}

const acceptChallengeToken = (challengeId, play) =>{
  // expire = moment().add(expire, "seconds").unix();
  const token = {}
  token.payload = {
    challengeId: challengeId,
    play: play,
    action: 'accept'
    // iat: moment().unix(),
    // exp: expire,
  };               
  // token.expire = expire
  return jwt.sign(token.payload, config.secret);
}

// genera token para recuperar contraseña y validar cuenta de correo
// 
const emailToken = (user) =>{
  const token = {}
    token.payload = {
      id: user._id,
      action: 'verify-account',
      iat: moment().unix(),
      exp: moment().add(24, "hours").unix(),
    };                  
    token.code = jwt.sign(token.payload, config.secret);
    return token;
}

// valida y decodifica un token
const verifyToken = async (token) =>{
  return await jwt.verify(token, config.secret, function(err, decoded) {
     console.log("token decoded error: ", err);
    return {error: err, data: decoded}
  })
}

const createToken = (options) => {
  // options tendran todas las opcines del token
  // id --> user_id
  // action --> acción a realizar, solo operaciones puntuales por seguridad, para evitar usar el token para otra tarea
  //  - verify-account
  //  - reset-password
  // role --> el role del usuario
  
  const token = {}
  const times = {
    iat: moment().unix(),
    exp: moment().add(24, "hours").unix(),
  }
  token.payload = Object.assign(options, times);
  token.code = jwt.sign(token.payload, config.secret);
  return token;
}

export { sessionToken, emailToken, verifyToken, createToken, createChallengeToken, acceptChallengeToken }


