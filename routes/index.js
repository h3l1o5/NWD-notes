var express = require('express');
var notes = require('../models/notes-memory')
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
