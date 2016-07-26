const request = require('request')
const geolib = require('geolib')
const config = require('./config')
const pokedex = require('./pokedex.json')

validate(config)

fetchPokemon(config.latitude, config.longitude)

function fetchPokemon (lat, lon) {
  const url = `https://pokevision.com/map/data/${lat}/${lon}`
  console.log(`Requesting url ${url}`)
  request(url, (err, res, body) => {
    if (err) {
      return console.error('failed to fetch pokemon', err)
    }
    printPokemon(body)
  })
}

function printPokemon (res) {
  console.dir(res)
  const pokemon = JSON.parse(res.toString()).pokemon
  const sorted = sortPokemonByDistance(pokemon, config)
  const pretty = sorted.map((pokemon) => {
    return {
      name: pokedex[String(pokemon.pokemonId)].name,
      lat: pokemon.latitude,
      lon: pokemon.longitude,
      distance: geolib.getDistance(pokemon, config),
      meta: pokemon,
    }
  })
  console.dir(pretty)
}

function sortPokemonByDistance (pokemon, location) {
  return pokemon.sort((a, b) => {
    return geolib.getDistance(a, location) - geolib.getDistance(b, location)
  })
}

function imageUrlForNumber (number) {
  return `http://ugc.pokevision.com/images/pokemon/${number}.png`
}

function validate (config) {
  if (!config ||
      !config.latitude ||
      !config.longitude) {
    throw new Error(`You must create a config.js file that exports your latitude and longitude. See sample-config.js for an example.`)
  }
}
