import dotenv from 'dotenv'

// dotenv.config()

// console.log('--: NODE_ENV: ', process.env.NODE_ENV)

const ENV = process.env.NODE_ENV || 'development'
// const ENV = process.env.ENV



export default  {
  env: ENV,
  server: {
    port: process.env.PORT || 4000
  },
  db: {
    mongo: {
      development: 'mongodb://127.0.0.1:27017/verticeaudio',
      production: 'mongodb+srv://neruson:n3rus0n@orinoco27-i9v0z.mongodb.net/vertice?retryWrites=true&w=majority'
    },
    debug: true
  },
  bcrypt:{
    saltRounds: 10
  },
  secret: '3sp3r0ofunc1o0n3e3st4c0s4',
  wif: '5JEaSswQ4XMEdzEVnKBPGXByGDqvhEx7gDCHdPou7hJ5t1HDsjy',
  cors: {
      origins: (ENV === 'production') ? ['']: ['http://localhost:4000'],
      allowCredentials: 'true',
      exposeHeaders: ['content-type', 'content-length'],
      maxAge: 600,
      methods: ['POST, GET, OPTIONS'],
      headers: ['Accept', 'Content-Type', 'Authorization','authentication','origin']
    }
}