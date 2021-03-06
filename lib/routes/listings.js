const Listing = require('../models/Listing');
const { ensureAuth } = require('../middleware/ensureAuth');
const { Router } = require('express');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const {
      title,
      user,
      location,
      category,
      dietary,
      dateListed,
      expiration
    } = req.body;

    Listing
      .create({ title, user, location, category, dietary, dateListed, expiration })
      .then(created => res.send(created))
      .catch(next);
  })

  .get('/', ensureAuth, (req, res, next) => {
    Listing
      .find()
      .select({
        __v: false,
        location: false
      })
      .lean()
      .then(listing => res.send(listing))
      .catch(next);
  })
  
  .get('/:id', ensureAuth, (req, res, next) => {
    Listing
      .findById(req.params.id)
      .select({
        __v: false,
        location: false,
      })
      .lean()
      .then(found => res.send(found))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    if(req.body.expiration) {
      const error = new Error('Cannot adjust expiration date');
      error.status = 311;
      return next(error);
    }

    Listing
      .findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
      .select({
        __v: false,
        location: false
      })
      .lean()
      .then(updatedListing => res.send(updatedListing))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Listing
      .findByIdAndDelete(req.params.id)
      .select({
        _id: true
      })
      .lean()
      .then(deleted => res.send(deleted))
      .catch(next);
  });
