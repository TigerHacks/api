var CheckitError = require('checkit').Error;
var _ = require('lodash');

var CheckIn = require('../models/CheckIn');
var UserService = require('../services/UserService');
var errors = require('../errors');
var utils = require('../utils');


/**
 * Finds a CheckIn by User ID
 * @param {Number} userId id of requested user
 * @returns {Promise} the resolved CheckIn for the user
 * @throws {NotFoundError} when the user has no check in
 */
module.exports.findCheckInByUserId = function (userId){
    return CheckIn
        .findByUserId(userId)
        .then(function (checkin){
            if (_.isNull(checkin)) {
                var message = "A check in record cannot be found for the given user";
                var source = "userId";
                throw new errors.NotFoundError(message, source);
            }
            return checkin;
        })
};

/**
 * Updates the CheckIn values to request
 * @param {Obejct} attributes to be updated
 * @returns {Promise} the resolved CheckIn for the user
 */
module.exports.updateCheckIn = function (attributes){
    return module.exports.findCheckInByUserId(attributes.userId)
        .then(function(checkin) {
            var updates = {
                "swag": attributes.swag || checkin.get('swag'),
                "location": attributes.location || checkin.get('location')
            };
            checkin.set(updates, {patch: true});
            return checkin.save();
        });
};

/**
 * Creates a CheckIn object for given user with the given attributes
 * @param {Object} attribute values requested
 * @returns {Promise} resolving to CheckIn object
 * @throws {InvalidParameterError} when the user has already checked in
 */
module.exports.createCheckIn = function (attributes){
    var checkin = CheckIn.forge(attributes);
    return checkin.validate()
        .catch(CheckitError, utils.errors.handleValidationError)
        .then(function(validation) {
            return CheckIn.findByUserId(attributes.userId);
        })
        .then(function (existingCheckin) {
            if (!_.isNull(existingCheckin)) {
                var message = "A check in record already exists for this user";
                var source = "userId";
                throw new errors.InvalidParameterError(message, source);
            }
            return checkin.save();
        });
};
