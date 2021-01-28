const router = require('express').Router()
const controller = require('./controller')
const authMiddleware = require('../../middlewares/auth')
const User = require('../../models/user')

router.get('/', async (req, res) => {
    try {
        const output = await User.find();
        res.status(200).json(output);
    } catch (error) {
        res.status(500).json({ message: error });
    }
})
router.post('/signup', controller.signup)
router.post('/login', controller.login)
router.post('/addcoin', controller.addcoin)
router.post('/deleteuser', controller.deleteuser)
router.post('/finduser', controller.finduser)

router.use('/check', authMiddleware)
router.get('/check', controller.check)

module.exports = router