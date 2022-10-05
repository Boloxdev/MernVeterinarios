import nodemailer from 'nodemailer';

const emailOlvidePassword = async(datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      //email envio
      const { email, nombre, token } = datos;
      //enviar el mail
      const info = await transporter.sendMail({
        from: "APV- Administrador de Pacientes de Veterinaria",
        to: email,
        subject: 'Reestablece tu Password',
        text: 'Reestablece tu password',
        html: `<p>Hola: ${nombre}, Ha solicitado cambiar su contraseña. </p>
            <p>Para cambiar tu contraseña usa el siguiente enlace:
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer contraseña</a></p>
            <p>Si tu no creaste esta cuenta puedes ignorar este mensaje.</p>
        `
      });
      console.log('Mensaje enviado: %s', info.messageId);
}

export default emailOlvidePassword;