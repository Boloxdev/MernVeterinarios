import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
const registrar = async(req, res) => {
    const { nombre, email, password } = req.body;

    //Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email: email});

    if(existeUsuario){
        const error = new Error('El usuario ya existe');
        return res.status(400).json({msg: error.message});
    } 
    try {
        //guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //Enviar el mail
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });
        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(`Error: ${error}`)
    }
    
};
const perfil = (req, res) => {
    const { veterinario } = req;
    console.log(`Veterinario on VetController: ${veterinario}`)
    res.json(veterinario);
};

const confirmar = async(req, res) => {
    const { token } = req.params;

    const usuarioConfirmar = await Veterinario.findOne({token});

    if(!usuarioConfirmar){
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message });
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({msg: 'Usuario confirmado correctamente'});

    } catch (error) {
        console.log(error);
    }
}

const autenticar = async(req, res) => {
    const { email, password } = req.body;

    //comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email});
    if(!usuario){
        const error = new Error('Usuario no existe');
        return res.status(404).json({msg: error.message });
    }
    //Comprobar si el usuario está confirmado
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    }
    //revisar el password
    if( await usuario.comprobarPassword(password)){
        //autenticar
        res.json({token: generarJWT(usuario.id)});
    } else {
        const error = new Error("El password es incorrecto");
        return res.status(403).json({msg: error.message});
    }
    
}

const olvidePassword = async(req, res) => {
    const { email } = req.body;
    const existeVeterinario = await Veterinario.findOne({email});
    if(!existeVeterinario){
        const error = new Error('El usuario no existe');
        return res.status(400).json({msg: error.message});
    }

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();
        //Enviar email con instrucciones
        emailOlvidePassword({
           email,
           nombre: existeVeterinario.nombre,
           token: existeVeterinario.token
        })
        res.json({msg: "Hemos enviado un mail con las instrucciones"});
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async(req, res) => {
    const token = req.params.token;

    const tokenValido = await Veterinario.findOne({token});

    if(tokenValido){
        //El token es valido, el usuario existe
        res.json({msg: 'Token valido y el user existe'});
    } else {
        const error = new Error('Token no válido');
        return res.status(400).json({msg: error.message});
    }
}

const nuevoPassword = async(req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({token});
    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }
    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: "Password modificado correctamente"});
    } catch (error) {
        console.log(error);
    }
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword
}