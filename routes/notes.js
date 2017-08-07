const util = require('util')
const express = require('express')
const router = express.Router()
const notes = require('../models/notes-memory')

router.get('/view', (req, res, next) => {
  const keyOfNote = req.query.key
  notes.read(keyOfNote)
  .then( (note) => {
    res.render('noteview', {
      title: note ? note.title : "",
      notekey: req.query.key,
      note: note
    })
  })
  
})

router.get('/add', (req, res, next) => {
  res.render('noteedit', {
    title: 'Add a Note',
    docreate: true,
    notekey: '',
    note: undefined
  })
})

router.post('/save', (req, res, next) => {
  let p
  
  if (req.body.docreate === "create") {
    p = notes.create(req.body.notekey, req.body.title, req.body.body)
  } else {
    p = notes.update(req.body.notekey, req.body.title, req.body.body)
  }

  p.then( (note) => {
    res.redirect('/notes/view?key=' + note.key)
  })
  .catch( (err) => { next(err) })
})

router.get('/edit', (req, res, next) => {
  notes.read(req.query.key)
  .then( (note) => {
    res.render('noteedit', {
      title: note ? ("Edit " + note.title) : "Add a Note",
      docreate: false,
      notekey: req.query.key,
      note: note
    })
  })
  .catch( (err) => { next(err) })
})

router.get('/destroy', (req, res, next) => {
  notes.read(req.query.key)
  .then( (note) => {
    res.render('notedestroy', {
      title: note ? note.title : "",
      notekey: req.query.key,
      note: note
    })
  })
})

router.post('/destroy/confirm', (req, res, next) => {
  const keyOfNote = req.body.notekey

  notes.destroy(keyOfNote)
  .then( () => { res.redirect('/') })
  .catch( (err) => {   
    next(new Error(err)) 
  })
})

module.exports = router