import fs from'fs'
import path from 'path'
import { gql } from 'apollo-server-express'

export default (function (){
  var types = ''
  let queries = ``
  let mutations = ``
  let subscriptions = ``

  fs
    .readdirSync(__dirname)
    .filter(function (file) {
    return ((file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'))
  })
    .forEach(function (file) {
      // importo todos los squemas 
      let schema = require(path.join(__dirname, file))
      types = types + schema.types + '\n'
      queries = queries + schema.queries + '\n'
      mutations = mutations + schema.mutations + '\n'
      // si hay subscriptions
      if (schema.subscriptions) {
        subscriptions = subscriptions + schema.subscriptions + '\n'
      }

  })

  let subsSchema
  
  if (subscriptions !== ``) {
    subscriptions = `
      type Subscription {
        ${subscriptions}
      }
    `
    console.log('--: hay subscriptions: ', subscriptions)
    subsSchema = `
      subscription: Subscription
    `
  }

  return gql`
    ${types}

    type Query {
      ${queries}
    }

    type Mutation {
      ${mutations}
    }

    # ${subscriptions}

    schema {
      query: Query,
      mutation: Mutation,
      ${subsSchema || ''}
    }

  `
})()
