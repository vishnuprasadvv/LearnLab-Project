import nodemailer from 'nodemailer';

export const sendEmail = async (to:string, subject : string, text : string) => {
    console.log('sendEmail service hit', to)
    const transporter = nodemailer.createTransport({
        service : 'Gmail',
        auth:{
            user : process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASS   
        },
            tls: {
              rejectUnauthorized: false, // Ignore SSL certificate errors
            },
    })

    await transporter.sendMail({from : process.env.EMAIL_USER, to , subject, text})
    console.log('email sent')
}
