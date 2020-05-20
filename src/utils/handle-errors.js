import { UserInputError } from 'apollo-server-express';
import { regexError } from './regular-expressions'

export function mongoError (error, res, next) {
  console.log('mongoError: ', error);
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new UserInputError('duplicate-index'));
  } else {
    next(); // The `update()` call will still error out.
  }
}


export function extractMessage (error) {
  const match = error.message.match(regexError)
  console.log('match extractMessage: ', match);
  const duplicate = error.message.indexOf('E11000 duplicate');
  console.log('duplicate extractMessage: ', duplicate);
  let message = error.message;
  if (match) message = match[0]
  else if (duplicate > -1) message = 'duplicate-index-field'
  return message;
}