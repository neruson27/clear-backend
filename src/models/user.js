import mongoose from 'mongoose'
import moment from 'moment'
import { passwordMatch, createPassword } from '../utils/password';
import { mongoError } from '../utils/handle-errors'

const matchEmail = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'invalid-email-format']

const AccessTokenSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  expire: {
    type: Number,
    required: true
  },
}, { _id: false })

// const SocialSchema = new mongoose.Schema({
//   facebook: {
//     type:String,
//     default:''
//   },
//   instagram: {
//     type:String,
//     default:''
//   },
// }, {_id: false})

const parentsSchema = new mongoose.Schema({
  father: {
    type: String,
    default: ''
  },
  fatherBirthDate: {
    type: Date,
    default: ''
  },
  mother: {
    type: String,
    default: ''
  },
  motherBirthDate: {
    type: Date,
    default: ''
  }
}, {_id: false})
    
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    default: '',
    required: true
  },
  email: {
    type: String,
    match: matchEmail,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String, // pendiente definir un patron para la constraseña segura
    required: true
  },
  departament: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  typeUser: {
    type: String
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  parents: parentsSchema,
  accessToken: AccessTokenSchema,
  lastConection: {
    type: Date
  },
  // fullName2: {
  //   type: String,
  // },
  im: {
    type: String,
    enum: ['novio', 'novia', 'invitado', 'familiar', 'admin'],
    // required: true
  },
  // profileImage: {
  //   type: String,
  //   default: ''
  // },
  // weddingDate: {
  //   type: Date
  // },
  // phone2: {
  //   type: String
  // },
  // email2: {
  //   type: String,
  //   match: matchEmail,
  //   lowercase: true
  // },
  // presupuesto: {
  //   type: String
  // },
  // numberByInveted: {
  //   type: Number
  // },
  // verifyUser: {
  //   type: Boolean
  // },
  // verifyPair: {
  //   type: Boolean
  // },
  // tasks: {
  //   type: Array,
  //   default: []
  // },

}, { timestamps: true })

UserSchema.virtual('id').get(function () {
  return this._id
})

UserSchema.statics.validatePassword = function (email, password, isEmail) { // statics y methods no soportan arrow functions
  if (isEmail) {
    return this.model('user').findOne({ email: email.toLowerCase() })
    .then(user => {
      // si el user no existe
      if (!user) return null

      // si el password es distinto
      // if (!bcrypt.compare(password, user.password)) return null
      if (!passwordMatch(password, user.password)) return null
      // si pasa la prueba se retorna el user
      return user
    })
    .then(response => {
      return response
    })
  } else {
    return this.model('user').findOne({ phone: email })
    .then(user => {
      // si el user no existe
      if (!user) return 'user-dont-find'

      // si el password es distinto
      // if (!bcrypt.compare(password, user.password)) return null
      if (!passwordMatch(password, user.password)) return 'password-incorrecto'
      // si pasa la prueba se retorna el user
      return user
    })
    .then(response => {
      return response
    })
  }
}

UserSchema.pre('save', function (next) {
  var user = this
  // user.wasNew = user.isNew
  // user.isAuthenticatedModified = user.isModified('isAuthenticated')

  if (user.isNew || user.isModified('password')) {
    user.password = createPassword(user.password)

    next()
  }
  else {
    next()
  }
})

// UserSchema.post('validate',mongoError)
// UserSchema.post('save',mongoError)
// UserSchema.post('update',mongoError)
// UserSchema.post('findOneAndUpdate',mongoError)

const User = mongoose.model('user', UserSchema)

export default User