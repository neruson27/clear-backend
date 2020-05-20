import { authorize } from '../../utils/authorize-resolvers';
import { UserInputError, withFilter } from 'apollo-server-express';
import User from '../../models/user'
import pubsub from '../pubsub'
import config from '../../config'

export const Query = {
  GetUser: authorize(['novio', 'novia', 'invitado', 'familiar', 'prensa', 'proveedor', 'admin'], (obj, {id}, {credentials: { user}}, info) => {
    try {
      if (user.role !== 'admin' &&  id !== '') throw 'operation-not-permited'
      let userId = !id ? user.id : id 
      return User.findOne({_id: userId})
      .then(user => {
        if (!user) throw 'user-not-exists'
        return user
      })
      .catch(err => {
        console.log('err: ', err);
        return err
      })
    } catch(e) {
      // statements
      console.log(e);
      return new UserInputError(e)
    }
  }),
  // PARTE SOLO DEL ADMIN
  GetUsers: authorize(['admin'], (obj, options, {credentials: { user }}, info) => {
    try {
      return User.find()
    } catch(e) {
      console.error(e)
      return new UserInputError(e)
    }
  })
}

export const Mutation = {
  EditUser: authorize(['novio', 'novia', 'invitado', 'familiar', 'prensa', 'proveedor', 'admin'], (obj, {data}, {credentials: { user }}, info) => {
    try {
      return User.findOne({_id: user.id})
      .then(user => {
        if (!user) throw 'user-not-exists'
        if(data.profileImage) user.profileImage = data.profileImage
        if(data.fullName) user.fullName = data.fullName
        if(data.from) user.from = data.from
        if(data.country) user.country = data.country
        if(data.weddingDate) user.weddingDate = data.weddingDate
        if(data.phone) user.phone = data.phone
        return user.save()
      })
      .catch(err => {
        console.log('err: ', err);
        return new UserInputError(err);
      })
    } catch(e) {
      console.error(e)
    }
  })
}