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

router.post('/sendBilan', async (req, res) => {
 const {
        status,          // proprio / locataire
        housing,         // maison / appartement
        occupants,       // 1 / 2 / 3 / 4 / 5+
        year,            // année de construction
        surface,         // m²
        heating,         // gaz / elec / fioul / autre
        bill,            // facture mensuelle
        income,          // revenu fiscal
        isolation,       // oui / non / inconnu
        firstname,
        lastname,
        email,
        phone,
        subject,
        message,
        token
    } = req.body;

    if (!token) {
        return res.status(400).json({ message: "Captcha manquant." });
    }

    try {
        // Vérification reCAPTCHA
        const { data } = await axios.post(
            "https://www.google.com/recaptcha/api/siteverify",
            null,
            {
                params: {
                    secret: process.env.RECAPTCHA_SECRET,
                    response: token,
                },
            }
        );

        if (!data.success || (data.score !== undefined && data.score < 0.5)) {
            return res.status(403).json({ message: "Captcha invalide." });
        }

        // Config transport mail
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
            tls: { rejectUnauthorized: false },
        });

        // Corps du mail = toutes les infos collectées
        const mailText = `
📋 Bilan énergétique demandé

👤 Infos personnelles :
- Prénom : ${firstname}
- Nom : ${lastname}
- Email : ${email}
- Téléphone : ${phone}
- Objet : ${subject}

🏡 Infos logement :
- Statut : ${status}
- Habitation : ${housing}
- Occupants : ${occupants}
- Année construction : ${year}
- Surface : ${surface} m²
- Chauffage : ${heating}
- Facture énergie : ${bill} €/mois
- Revenu fiscal : ${income}
- Isolation : ${isolation}

📝 Message / attentes :
${message}
        `;

        const mailOptions = {
            from: email,
            to: process.env.GMAIL_USER,
            subject: `Bilan énergétique - ${firstname} ${lastname}`,
            text: mailText,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Votre bilan a bien été envoyé !" });
    } catch (err) {
        console.error("Erreur reCAPTCHA ou email :", err?.response?.data || err);
        res.status(500).json({ message: "Erreur serveur." });
    }
});

module.exports = router;
