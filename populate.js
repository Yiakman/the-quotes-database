const path = require('path')

const elastic = require('./lib/elastic')
const server = require('./lib/server')

const { populateDatabase, setOhsumedMapping } = require('./lib/ohsumed')
const ohsumed = require('./lib/ohsumed')

const dirPaths = [
  path.normalize('D:/Datasets/Ohsumed/C02')
]



async function main() {
  const isElasticReady = await elastic.checkConnection();

  if (isElasticReady) {
    const elasticIndex = await elastic.esclient.indices.exists({index: elastic.index})
    
    //await elastic.createIndex(ohsumed.index)
    //await setOhsumedMapping()
    await populateDatabase(dirPaths[0], 10000)
    
  }
}

const start = Date.now()
main().then(() => {
  console.log('⌛', Date.now() - start)
})