import fs from'fs';
import path from 'path';

export default (() => {
  let resolvers = {Query: {}, Mutation: {}};
  // let resolvers = {Query: {}, Mutation: {}, Subscription: {}};
  fs
    .readdirSync(__dirname)
    .filter((file) => {
    return ((file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'));
  })
    .forEach((file) => {
      // importo todos los squemas 
        let rsver = require(path.join(__dirname, file));
        // console.log('rsver: ', rsver);
        Object.assign(resolvers.Query, rsver.Query);
        Object.assign(resolvers.Mutation, rsver.Mutation);
        // Object.assign(resolvers.Subscription, rsver.Subscription);
  });
  return resolvers
})()