const API_BASE = "https://tp-web-messagerie.onrender.com/";

function update() {
  let liste = document.getElementById("liste-messages");
  liste.innerHTML = "<li>⏳ Chargement des messages...</li>";

  fetch(API_BASE + "msg/getAll")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      liste.innerHTML = "";

      if (data.length === 0) {
        liste.innerHTML = "<li>Aucun message</li>";
        return;
      }

      for (let i = 0; i < data.length; i++) {
        let li = document.createElement("li");

        let texte = document.createElement("span");
        texte.textContent = data[i].pseudo + " - " + data[i].date + " : " + data[i].msg + " ";

        let btnSupprimer = document.createElement("button");
        btnSupprimer.textContent = "Supprimer";

        btnSupprimer.addEventListener("click", function() {
          fetch(API_BASE + "msg/del/" + i)
            .then(function(response) {
              return response.json();
            })
            .then(function(resultat) {
              update();
            })
            .catch(function(error) {
              liste.innerHTML = "<li>❌ Erreur lors de la suppression</li>";
              console.log("Erreur lors de la suppression :", error);
            });
        });

        li.appendChild(texte);
        li.appendChild(btnSupprimer);
        liste.appendChild(li);
      }
    })
    .catch(function(error) {
      liste.innerHTML = "<li>❌ Impossible de contacter le serveur</li>";
      console.log("Erreur lors de la récupération des messages :", error);
    });
}

document.getElementById("btn-update").addEventListener("click", function() {
  update();
});

document.getElementById("btn-envoyer").addEventListener("click", function() {
  let pseudo = document.getElementById("pseudo").value.trim();
  let message = document.getElementById("message").value.trim();

  if (pseudo !== "" && message !== "") {
    let maintenant = new Date();
    let dateTexte = maintenant.getFullYear() + "-"
      + String(maintenant.getMonth() + 1).padStart(2, "0") + "-"
      + String(maintenant.getDate()).padStart(2, "0") + " "
      + String(maintenant.getHours()).padStart(2, "0") + ":"
      + String(maintenant.getMinutes()).padStart(2, "0");

    fetch(
      API_BASE + "msg/post?pseudo=" + encodeURIComponent(pseudo)
      + "&msg=" + encodeURIComponent(message)
      + "&date=" + encodeURIComponent(dateTexte)
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        document.getElementById("pseudo").value = "";
        document.getElementById("message").value = "";
        update();
      })
      .catch(function(error) {
        let liste = document.getElementById("liste-messages");
        liste.innerHTML = "<li>❌ Erreur lors de l'envoi du message</li>";
        console.log("Erreur lors de l'envoi du message :", error);
      });
  }
});

document.getElementById("btn-theme").addEventListener("click", function() {
  document.body.classList.toggle("dark-mode");
});

update();