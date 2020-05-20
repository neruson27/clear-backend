import { createToken } from "../../utils/token-generator";
import { authorize } from "../../utils/authorize-resolvers";
import User from "../../models/user";
import Wedding from "../../models/wedding";
import Provider from "../../models/provedores";
import moment from "moment";
import { UserInputError } from "apollo-server-express";

export const Query = {
  Login: authorize([], (obj, { data }, context) => {
    const matchEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let isEmail = data.email.match(matchEmail) ? true : false;
    console.log(isEmail);
    return User.validatePassword(data.email, data.password, isEmail)
      .then(res => {
        if (res === "password-incorrecto")
          return new UserInputError("Contraseña incorrecta");
        if (res === "user-dont-find")
          return new UserInputError("Usuario no encontrado");

        const token = createToken({
          id: res._id,
          username: res.email,
          role: res.im
        });
        return {
          token: {
            code: token.code,
            expire: token.payload.exp
          },
          user: res
        };
      })
      .catch(e => {
        console.error(e);
        return e;
      });
  }),
  LoginP: authorize([], (obj, { data }, context) => {
    console.log('----------------')
    console.log(data)
    const matchEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let isEmail = data.email.match(matchEmail) ? true : false;
    return Provider.validatePassword(data.email, data.password, isEmail)
      .then(res => {
        console.log(res)
        if (res === "password-incorrecto")
          return new UserInputError("Contraseña incorrecta");
        if (res === "providers-dont-find")
          return new UserInputError("Usuario no encontrado");

        const token = createToken({
          id: res._id,
          username: res.email,
          role: res.im
        });
        console.log('-------------------')
        console.log(res)
        return {
          token: {
            code: token.code,
            expire: token.payload.exp
          },
          provedor: res
        };
      })
      .catch(e => {
        console.log('- aqui -')
        console.error(e);
        return e;
      });
  }),
  EmailUnique: authorize([], (_, { email }) => {
    try {
      console.log(email)
      return User.findOne({ email })
        .then((user) => {
          // console.log(user)
          if (!user) throw 'user-not-exist'
          return user.email
        })
    } catch (error) {
      // console.log('Email Unique error: ', error);
      return new UserInputError(error)
    }
  }),
};

export const Mutation = {
  SignUp: authorize([], async (obj, { data }, context) => {
    try {
      console.log(data)
      return User.create(data)
        .then(async user => {
          let message = 'user-created'
          let wed = await Wedding.findOne( {$or: [{'husband.email': user.email}, {'wife.email': user.email}]})
          if (wed){
            if (wed.wife.id === ''){
              wed.wife.id = user.id
              user.im = 'novia'
            } else if (wed.husband.id === ''){
              wed.husband.id = user.id
              user.im = 'novio'
            }
            await wed.save()
            await user.save()
            message = 'user-created-and-linked'
          }
          return {
            user: user,
            message: message
          };
        })
        .catch(err => {
          console.error(err);
          throw err;
        });
    } catch (error) {}
  }),
  SignUpWedding: authorize([], async (obj, { data }, context) => {
    try {
      console.log(data)

      let userId
      if (data.husband.id !== '')
        userId = data.husband.id
      else if (data.wife.id !== '')
        userId = data.wife.id

      await User.updateOne({_id: userId}, {im: data.im})

      let body = {
        husband: data.husband,
        wife: data.wife,
        date: data.date,
        guestsNumber: data.guestsNumber,
        budget: {
          budget: data.budget
        }
      }
      return Wedding.create(body)
      .then(res => {
        console.log(res)
        return {
          message: 'Todo correcto'
        }
      })
    } catch (error) {
      console.error(error)
    }
  }),
  SignUpProvedor: authorize([], (obj, { data }, context) => {
    try {
      console.log(data)
      return Provider.create(data)
        .then(proveedor => {
          console.log(proveedor);
          return proveedor;
        })
        .catch(err => {
          console.error(err);
          return err;
        });
    } catch (error) {}
  })
};
