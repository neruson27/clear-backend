import mongoose from 'mongoose'
import config from '../config'

export default function (app) {
  try{
    mongoose.Promise = global.Promise
    /*
      fix para utiliar los campos ID en los esquemas de graphql, porque la  version actual de graphql no soporta datos de tipo bson
      error: ID cannot represent value: _bsontype
    */
    mongoose.Types.ObjectId.prototype.valueOf = function () {
      return this.toString()
    }

    const env = process.env.NODE_ENV || 'development'

    mongoose.set('debug', env !== 'production')

    const url = config.db.mongo[env]

    console.log('url mongo: ', url)

    return mongoose.connect(url, { useNewUrlParser: true })
    .then(()=> {
      console.log('db inicializada')
    })
    .catch(err => {
      console.log('error al inicializar mongo: ', err)
      throw err
    })
  }
  catch(error) {
    console.log('error mongoose: ', error)
  }
}



/*async function commitWithRetry(session) {
  try {
    await session.commitTransaction()
    console.log('Transaction committed.')
  } catch (error) {
    if (
      error.errorLabels &&
      error.errorLabels.indexOf('UnknownTransactionCommitResult') >= 0
    ) {
      console.log('UnknownTransactionCommitResult, retrying commit operation ...')
      await commitWithRetry(session)
    } else {
      console.log('Error during commit ...')
      throw error
    }
  }
}

async function runTransactionWithRetry(txnFunc, client, session) {
  try {
    await txnFunc(client, session)
  } catch (error) {
    console.log('Transaction aborted. Caught exception during transaction.')

    // If transient error, retry the whole transaction
    if (error.errorLabels && error.errorLabels.indexOf('TransientTransactionError') >= 0) {
      console.log('TransientTransactionError, retrying transaction ...')
      await runTransactionWithRetry(txnFunc, client, session)
    } else {
      throw error
    }
  }
}

async function updateEmployeeInfo(client, session) {
  session.startTransaction({
    readConcern: { level: 'snapshot' },
    writeConcern: { w: 'majority' },
    readPreference: 'primary'
  })

  const employeesCollection = client.db('hr').collection('employees')
  const eventsCollection = client.db('reporting').collection('events')

  await employeesCollection.updateOne(
    { employee: 3 },
    { $set: { status: 'Inactive' } },
    { session }
  )
  await eventsCollection.insertOne(
    {
      employee: 3,
      status: { new: 'Inactive', old: 'Active' }
    },
    { session }
  )

  try {
    await commitWithRetry(session)
  } catch (error) {
    await session.abortTransaction()
    throw error
  }
}

return client.withSession(session =>
  runTransactionWithRetry(updateEmployeeInfo, client, session)
)*/




export class TransactionsDB {
  constructor () {
    this.counterTryError = 0
  }

  async initSession () {
    try {
      // statements
      this.session = await mongoose.startSession({ readPreference: { mode: "primary" } })
      this.session.startTransaction({ readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } })
    } catch(e) {
      // statements
      console.log('error iniciando transaccions mongodb: ', e)
    }
  }

  getSecondRandom () {
    // Math.floor(Math.random() * (max - min + 1)) + min;
    return  (Math.floor(Math.random() * (9 - 1 + 1)) + 1) * 1000
  }

  getSession () {
    return this.session
  }

  async commitWithRetry() {

    this.counterTryError++
    console.log(`
      -----------------------------------
          commiting transaction to db, try ${this.counterTryError}
      -----------------------------------
    `)
    
    return this.session.commitTransaction()
    .then(async result => {

      await this.session.endSession()
      console.log('--: Transaction committed: ')
      return result
    })
    .catch (async error => {
      console.log(`
      ------------------------------------------  
           error commiting transaction to db in trying ${this.counterTryError} 
      ------------------------------------------
      `)
      console.log(error)
        // error.errorLabels.indexOf('UnknownTransactionCommitResult') >= 0 &&
      // codeName: 'WriteConflict'
      // if (error.errorLabels && error.errorLabels.indexOf('TransientTransactionError') >= 0 && this.counterTryError < 5) {
      //   let seconds = this.getSecondRandom()
      //   console.log(`TransientTransactionError, retrying commit operation in ${seconds} second ...`)
      //   const vm = this
      //   return await setTimeout(()=>{
      //     vm.commitWithRetry()
      //   }, seconds)

      // } else if (error.codName === 'TransactionCommitted') {
      if (error.codName === 'TransactionCommitted') {
        console.log('------: Error TransactionCommitted, transaction aborted')
        return await this.session.abortTransaction()
        
      } else {
        console.log('Error during commit ...')
        await this.session.endSession()
        return error
      }
    })
  }

  /*async commitWithRetry() {
    let count = 0
    try {
      count++
      console.log('--------: count ', count)
      let response = await this.session.commitTransaction()
      
      console.log('--: Transaction committed')
      return response
    } catch (error) {
      console.log(`------: error commitWithRetry ------
        ${error}

        `)
      if (
        error.errorLabels &&
        // error.errorLabels.indexOf('UnknownTransactionCommitResult') >= 0 &&
        error.errorLabels.indexOf('TransientTransactionError') >= 0 &&
        count < 5
      ) {
        console.log('UnknownTransactionCommitResult, retrying commit operation ...')
        await this.commitWithRetry()

      } else {
        console.log('Error during commit ...')
        await this.session.abortTransaction()
        await this.session.endSession()
        return error
      }
    }
  }*/

}