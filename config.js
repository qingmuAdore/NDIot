module.exports = {
  db: {
    host: 'localhost',
    port: 27017,
    database: 'iot',
    url: 'mongodb://localhost/iot' // mongodb://59.37.16.12/iot
  },
  mqtt: {
    host: 'localhost',
    port: 1883,
    topic: 'cmpp/+', //+ 通配同级主题
    options: {
      reconnectPeriod: 5000
    }
  }
}