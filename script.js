// Variables globales pour les cartes sélectionnées
let cartesJoueur = [];
let carteCroupier = '';

// Fonction pour créer les boutons de carte
function creerBoutonsCartes() {
  const cartes = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const conteneurCartes = document.getElementById('cartes-joueur');

  cartes.forEach(carte => {
    const bouton = document.createElement('button');
    bouton.textContent = carte;
    bouton.classList.add('carte');
    bouton.addEventListener('click', () => selectionnerCarte(carte, bouton));
    conteneurCartes.appendChild(bouton);
  });
}

// Fonction de sélection des cartes par le joueur
function selectionnerCarte(carte, bouton) {
  // Si la carte est déjà sélectionnée, on l'annule
  if (cartesJoueur.length < 2) {
    cartesJoueur.push(carte);
    bouton.classList.add('active');
  } else {
    // Si deux cartes ont été sélectionnées, on réinitialise la sélection
    cartesJoueur = [carte];
    document.querySelectorAll('#cartes-joueur .carte').forEach(b => b.classList.remove('active'));
    bouton.classList.add('active');
  }

  afficherStratégie();
}

// Calculer la somme des cartes, en prenant en compte l'As
function calculerSomme(cartes) {
  let somme = 0;
  let asPresent = false;

  cartes.forEach(carte => {
    if (carte === 'J' || carte === 'Q' || carte === 'K') {
      somme += 10;
    } else if (carte === 'A') {
      asPresent = true;
      somme += 11;
    } else {
      somme += parseInt(carte);
    }
  });

  // Si la somme est supérieure à 21 et qu'il y a un As, on compte l'As comme 1
  if (somme > 21 && asPresent) {
    somme -= 10;
  }

  return somme;
}

// Afficher la stratégie du Blackjack
function afficherStratégie() {
  const stratégie = document.getElementById('stratégie');
  stratégie.innerHTML = ''; // Réinitialiser l'affichage

  if (cartesJoueur.length === 2) {
    const sommeJoueur = calculerSomme(cartesJoueur);

    // Règles de la stratégie (simplifiées)
    if (sommeJoueur === 21) {
      stratégie.textContent = 'Vous avez un Blackjack!';
    } else if (cartesJoueur[0] === cartesJoueur[1]) {
      stratégie.textContent = 'Vous pouvez splitter.';
    } else if (sommeJoueur >= 10) {
      stratégie.textContent = 'Doubler est recommandé.';
    } else {
      stratégie.textContent = 'Tirer une carte est conseillé.';
    }
  }
}

// Lancer le jeu lorsque l'utilisateur a sélectionné ses cartes
function lancerJeu() {
  // Exemple de logique de jeu (simplifiée)
  carteCroupier = '10'; // Valeur par défaut du croupier

  if (cartesJoueur.length === 2) {
    afficherRésultat();
  }
}

// Affichage du résultat de la stratégie
function afficherRésultat() {
  const résultat = document.getElementById('résultat');
  const sommeJoueur = calculerSomme(cartesJoueur);

  let action = 'Tirer';
  if (sommeJoueur >= 17) {
    action = 'Rester';
  }

  résultat.textContent = `Stratégie : ${action}`;
}

// Appeler la fonction pour créer les boutons de cartes
creerBoutonsCartes();
