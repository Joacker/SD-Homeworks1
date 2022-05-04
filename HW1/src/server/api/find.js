/* IMPORTS */
const { Router } = require('express')
const express = require('express')
const router = express.Router()
const { getItems } = require('../controllers/find.controller')
const { getRedis } = require('../controllers/find.controller')
const { cache } = require('../controllers/find.controller')

/* APIS */
/*router.post('/insert',DataInserted)*/
router.get('/items',getItems)

router.get('/search', getRedis)


module.exports = router