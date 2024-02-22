const getConfig = () => {
  let environment = "dev";
  return require(`./env_${environment}.json`)
}

module.exports = {
  getConfig
}
