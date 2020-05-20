
// schema
const types = `
  type User {
    id: ID
    profileImage: String
    fullName: String
    fullName2: String
    email: String
    city: String
    departament: String
    weddingDate: Date
    phone: String
    phone2: String
    email2: String
    presupuesto: String
    numberByInveted: Float
    im: Who
    lastConection: Date
  }

  input UserInput {
    profileImage: String
    fullName: String
    fullName2: String
    city: String
    departament: String
    weddingDate: Date
    phone: String
    phone2: String
    email2: String
    presupuesto: String
    numberByInveted: Float
    lastConection: Date
  }
`

const queries = `
  GetUser(id: ID): User
  GetUsers: [User]
`

const mutations = `
  EditUser(data: UserInput): User
`

export { types, queries, mutations }