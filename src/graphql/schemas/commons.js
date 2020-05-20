const types = `
  scalar Date

  enum Order {
    asc
    desc
  }

  type Pagination {
    total: Int
    page: Int
    pages: Int
    limit: Int
  } 

  type Social {
    facebook: String
    instagram: String
    web: String
  }

  type FAQ {
    question: String
    answer: String
  }

  type Image {
    name: String
    image: String
  }

  type File {
    filename: String
    mimetype: String
    encoding: String
    relativePath: String
  }
`

const queries = `

`

const mutations = `
  singleUpload(file: Upload!): File
`


export { types, queries, mutations }
