const checkit = require('checkit');

const database = require('../../database');
const databaseUtils = require('../utils/database');
const bookshelf = database.instance();

/**
 * Produces datastore transaction
 * @param  {Function} callback	method to start transaction
 * @return {Promise} 			the result of the callback
 */
function _transaction(callback) {
  return bookshelf.transaction(callback);
}

/**
 * Fetches a model by its ID
 * @param  {Number|String} id	the ID of the model with the appropriate type
 * @return {Promise<Model>}		a Promise resolving to the resulting model or null
 */
function _findById(id) {
  const _model = new this();

  const queryParams = {};
  queryParams[_model.idAttribute] = id;
  return _model.query({
    where: queryParams
  })
    .fetch();
}

const Model = bookshelf.Model.extend({
  // the default model has no validations, but more can be
  // added as desired
  validations: {}
}, {
  transaction: _transaction,
  findById: _findById
});

/**
 * Initializes the model by setting up all event handlers
 */
Model.prototype.initialize = function() {
  this.on('saving', this.validate);
};

/**
 * Ensures keys being inserted into the datastore have the correct format
 * @param  {Object} attrs the attributes to transform
 * @return {Object}       the transformed attributes (underscored)
 */
Model.prototype.format = function(attrs) {
  return databaseUtils.format(attrs);
};

/**
 * Ensures keys being retrieved from the datastore have the correct format
 * @param  {Object} attrs the attributes to transform
 * @return {Object}       the transformed attributes (camel-cased)
 */
Model.prototype.parse = function(attrs) {
  return databaseUtils.parse(attrs);
};

/**
 * Validates the attributes of this model based on the assigned validations
 * @return {Promise} resolving to the validity of the attributes, as decided by
 * the Checkit library
 */
Model.prototype.validate = function() {
  return checkit(this.validations)
    .run(this.attributes);
};

module.exports = Model;
