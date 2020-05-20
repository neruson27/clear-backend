import config from '../config'

export function randomPlayMachine (hash, env) {
  //Will return a number inside the given range, inclusive of both minimum and maximum
  //i.e. if min=1, max=3, returns a number from 0-2
  // return Math.floor(Math.random() * (max - min + 1)) + min;
  // const random = Math.floor(Math.random() * (2 - 0 + 1)) + 0
  // console.log(`----: random: ${random} = ${config._plays[random}]}`)
  // return config._plays[random]

  /*// hash con random

  // solucion usando un random para obtener el caracter
  const random = Math.floor(Math.random() * (hash.length - 1 + 1)) + 0

  // para development se usa slice(0,1) porque si se usa la misma posicion que la primera jugada
  // siempre es empate
  const character = (env && env === 'development') ? hash.slice(0,1) : hash.slice(random, random + 1)
  
  const play = config._plays.find(play => {
    return play.character.indexOf(character) > -1
  })*/
  

  // se obtiene el caracter a buscar para determinar la jugada
  // la primera opcion es solo para pruebas
  // la segura para produccion y es la correcta
  const character = (env && env === 'development') ? hash.slice(0,1) : hash.slice(-1)
  const play = config._plays.find(play => {
  // se obtiene el ultimo caracter del hash y en funcion del mismo se busca la jugada
    return play.character.indexOf(character) > -1
  })

  console.log(`para hash ${hash} la jugada es ${play.play}`)
  
  return play.play
}