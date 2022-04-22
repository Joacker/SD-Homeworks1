/* IMPORTS */
const { Router } = require('express')
const express = require('express')
const router = express.Router()
const { getItems } = require('../controllers/find.controller')

/* APIS */
/*router.post('/insert',DataInserted)*/
router.post('/items',getItems)

module.exports = router