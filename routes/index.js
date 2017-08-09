var express = require('express');
var path = require('path')
var notes = require(process.env.NOTES_MODEL ? path.join('..', process.env.NOTES_MODEL) : '../models/notes-memory')
var log = require('debug')('notes:router-home')
var error = require('debug')('notes:error')
var router = express.Router();

router.get('/', (req, res, next) => {
  notes.keylist()
  .then( (keylist) => {
    let keyPromises = []
    for (let key of keylist) {
      keyPromises.push(
        notes.read(key).then( (note) => {
        return { key: note.key, title: note.title }
      }))
    }
    return Promise.all(keyPromises)
  })
  .then( (notelist) => {
    res.render('index', { 
      title: 'Notes',
      notelist: notelist,
      breadcrumbs: [
        { href: '/', text: 'Home' }
      ] 
    })
  })
  .catch( (err) => { next(err) })
})

module.exports = router;
