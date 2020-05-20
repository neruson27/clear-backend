import fs from'fs';
import path from 'path';

exports.plugin = {
  name:'models',
  version:'1.0.0',
  register: async function(server, options, next) {
    server.app.models = {};
    fs
      .readdirSync(__dirname)
      .filter(function (file) {
      return ((file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'));
    })
      .forEach(function (file) {
      // model contiene el objeto del modelo importado
      const model = require(path.join(__dirname, file)).init(server);
      // se capitaliza el nombre del modelo
      const modelName = file.charAt(0).toUpperCase() + file.slice(0)
      // se expone el modelo a los demas plugines: server.plugins.models
      server.expose(model);
    });
  }
}