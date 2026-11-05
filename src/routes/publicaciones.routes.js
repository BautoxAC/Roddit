const router = require('express').Router();
const controller = require('../controllers/publicaciones.controller');
const {
  validarPaginacion,
  validarId,
  validarCrearPublicacion,
  validarEditarPublicacion
} = require('../middlewares/validaciones');

router.get('/', validarPaginacion, controller.listar);
router.get('/:id', validarId, controller.obtener);
router.post('/', validarCrearPublicacion, controller.crear);
router.put('/:id', validarId, validarEditarPublicacion, controller.actualizar);

module.exports = router;
