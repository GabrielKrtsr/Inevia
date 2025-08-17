    document.addEventListener('DOMContentLoaded', function() {

        // Page contact
    var contact = document.getElementById("contact-form")
    if (contact)
        contact.addEventListener('submit', async function (e) {
            e.preventDefault();

                // === Formulaire de contact avec reCAPTCHA et API ===
                const firstname = document.getElementById('firstname').value;
                const lastname = document.getElementById('lastname').value;
                const email = document.getElementById('email').value;
                const subject = document.getElementById('subject').value;
                const message = document.getElementById('message').value;

                const token = grecaptcha.getResponse();
                if (!token) {
                    alert("Veuillez valider le reCAPTCHA.");
                    return;
                }

                try {
                    const response = await fetch('/api/contact/send', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ firstname,lastname, email, subject, message, token })
                    });

                    const data = await response.json();
                    alert(data.message);
                    if (response.ok) {
                        this.reset();
                        grecaptcha.reset();
                    }
                } catch (error) {
                    alert("Erreur lors de l'envoi. Veuillez réessayer.");
                    console.error(error);
                }

                // === Autres formulaires ===
                alert('Formulaire envoyé.');
                this.reset();
        
    });

    //Bilan energetique
    const nextBtns = document.querySelectorAll(".next-btn");
    const prevBtns = document.querySelectorAll(".prev-btn");
    const steps = document.querySelectorAll(".form-step");
  const progressBar = document.getElementById("progress-bar");
  let currentStep = 0;

  function updateFormSteps() {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
    });

    // Progression en %
    let progress = (currentStep) / (steps.length - 1) * 100;
    progressBar.style.width = progress + "%";

    // Activer les numéros
    document.querySelectorAll(".progress-step").forEach((step, idx) => {
      step.classList.toggle("active", idx <= currentStep);
    });
  }
// Validation d’une étape
function validateStep(stepIndex) {
  const step = steps[stepIndex];
  const inputs = step.querySelectorAll("input, select, textarea");

  let valid = true;

  for (let input of inputs) {
    if (input.type === "radio") {
      // Vérifie qu’au moins un radio du même groupe est coché
      const radios = step.querySelectorAll(`input[name="${input.name}"]`);
      if (![...radios].some(r => r.checked)) {
        radios[0].setCustomValidity("Veuillez sélectionner une option."); 
        radios[0].reportValidity(); // affiche le tooltip natif
        valid = false;
        break;
      } else {
        radios.forEach(r => r.setCustomValidity("")); // reset si ok
      }
    } else if (!input.checkValidity()) {
      input.reportValidity(); // déclenche le tooltip du navigateur
      valid = false;
      break;
    }
  }

  return valid;
}


nextBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (validateStep(currentStep)) {
      currentStep++;
      updateFormSteps();
    }
  });
});

  // Précédent
  prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      currentStep--;
      updateFormSteps();
    });
  });
  
  // Soumission finale
var audit = document.getElementById("audit-form")
if (audit)
  audit.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const token = grecaptcha.getResponse();
    if (!token) {
      alert("Veuillez valider le reCAPTCHA.");
      return;
    }
    data.token = token;

    try {
      const response = await fetch('/api/contact/sendBilan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const res = await response.json();
      alert(res.message || "Formulaire envoyé !");
      if (response.ok) {
        e.target.reset();
        grecaptcha.reset();
        currentStep = 0;
      }
    } catch (err) {
      alert("Erreur lors de l'envoi");
      console.error(err);
    }
  });
});