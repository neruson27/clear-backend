import crypto from 'crypto';
import moment from 'moment'
import querystring from 'querystring'
import config from '../config'

class Signature {
  constructor () {
    // this.nonce = new Date() * 1000 // esta forma agrega 3 ceros al final siempre
    this.nonce = moment().unix().toString()
  }


  getSignature (play, nonce) {
    // para garantiar que siempre haya un hash diferente en la generación, this.nonce se incrementa en uno
    nonce = (nonce) ? nonce : this.nonce++
    try {

      // statements
      const hmac_secret = config.secret.toString('utf-8')

      // const nonce = moment().unix().toString()
      // const nonce = new Date() * 1000
      const signature = nonce + config.hmac.key + play
      const signature_enconded = signature.toString('utf-8')

      const hash = crypto.createHmac('sha256', hmac_secret).update(signature_enconded).digest('hex')
      // console.log('signature: ', signature)
      // console.log('signature_enconded: ', signature_enconded)
      // console.log('hash: ', hash)
      const res = { hash: hash, nonce: nonce}
      return res

    } catch(e) {
      // statements
      console.log(e);
    }
  }

  getPlay (hash, nonce) {
    try {
      // statements
      const rock = 'rock'
      const paper = 'paper'
      const scissor = 'scissor'
      const sRock = this.getSignature(rock, nonce)
      const sPaper = this.getSignature(paper, nonce)
      const sScissor = this.getSignature(scissor, nonce)

      console.log('sRock: ', sRock.hash)
      console.log('sScissor: ', sScissor.hash)
      console.log('sPaper: ', sPaper.hash)

      if (sRock.hash == hash) return rock
      else if (sPaper.hash == hash) return paper
      else if (sScissor.hash == hash) return scissor
      else return
    } catch(e) {
      // statements
      console.log(e);
    }
  }
}

export default Signature

// const hmac = new Signature()
//   hmac.getSignature('piedra')

// console.log('piedra')
// for (var i = 1; i< 10 ; i++) {
//     console.log(hmac.getSignature('piedra'))
// }

// console.log('papel')
// for (var i = 1; i< 10 ; i++) {
//   console.log(hmac.getSignature('papel'))
// }

// console.log('tijera')
// for (var i = 1; i< 10 ; i++) {
//   console.log(hmac.getSignature('tijera'))
// }

// // console.log(hmac.getSignature('tijera', 1549645147740026))

// const signature = hmac.getSignature('paper')

// console.log('--: new hash para rock: ', signature)

// console.log(hmac.getPlay(signature.hash, signature.nonce))

/*

 ae98647955e7e1c5fa87c33f91f30f7ed1c6fb5c6ca0a927eb700cdba46e784b
 ae98647955e7e1c5fa87c33f91f30f7ed1c6fb5c6ca0a927eb700cdba46e784b

 */