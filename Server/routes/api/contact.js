const axios = require('axios');
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
router.post('/send', async (req, res) => {
    const { firstname,lastname, email, subject, message, token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Captcha manquant.' });
    }

    const secretKey = process.env.RECAPTCHA_SECRET;

    try {
        const { data } = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            null,
            {
                params: {
                    secret: secretKey,
                    response: token
                }
            }
        );

        if (!data.success || (data.score !== undefined && data.score < 0.5)) {
            return res.status(403).json({ message: 'Captcha invalide.' });
        }
        // Envoi de l’email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: email,
            to: process.env.GMAIL_USER,
            subject: `Message de ${firstname} - ${lastname} - ${subject}`,
            text: `${email}\n${message}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Votre message a bien été envoyé !' });

    } catch (err) {
        console.error('Erreur reCAPTCHA ou email :', err?.response?.data || err);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

module.exports = router;
