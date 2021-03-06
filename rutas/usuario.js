const { request } = require('express');
const { Router } = require('express');
const Usuario = require('../modelos/Usuario');
const router = Router();
const {validarUsuario} = require('../helpers/validar-usuario')


router.get('/', async function(req,res){
    try {
        let usuario = await Usuario.find(); 
        res.send(usuario);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});

router.post('/', async function(req,res){
    
    try{
        const validaciones = validarUsuario(req);

        if (validaciones.length > 0){
            return res.status(400).send(validaciones);
        }
        console.log('Objeto recibido', req.body);

        const existeUsuario = await Usuario.findOne({email: req.body.email});
        if (existeUsuario){
            return res.send('Email ya existe');
        }

        let usuario = new Usuario();
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;
        usuario.fechaCreacion = new Date();
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save();
        
        res.send(usuario);
   
    } catch(error){
        console.log(error);
        res.send('Ocurrio un error');
    }
}); 
    

router.put('/usuarioId', async function(req,res){
    try {
        const validaciones = validarUsuario(req);

        if (validaciones.length > 0){
            return res.status(400).send(validaciones);
        }
        console.log(req.body, req.params.email);
        let usuario = await Usuario.findOne(req.params.email);
        
        if (!usuario) {
            return res.status(400).send('Usuario no existe');
        }
        const usuarioExiste = await Usuario.findOne({ usuario: req.body.email, _id: { $ne: usuario._id } });
        if (usuarioExiste) {
            return res.status(400).send('Usuario ya existe');
 
        }
        
        usuario.email = req.body.email;
        usuario.nombre = req.body.nombre;
        usuario.estado = req.body.estado;
        usuario.fechaActualizacion = new Date();
       
       usuario = await usuario.save();
       res.send(usuario);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});

module.exports = router;