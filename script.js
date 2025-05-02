const cards = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
let selectedPlayer = [];
let selectedDealer = null;

function createCardButtons(containerId, isPlayer = true) {
  const container = document.getElementById(containerId);
  cards.forEach(card => {
    const btn = document.createElement('button');
    btn.textContent = card;
    btn.classList.add('card');
    btn.addEventListener('click', () => {
      if (isPlayer) {
        // Permettre de sélectionner deux fois la même carte
        selectedPlayer.push(card); // Ajouter la carte à la main du joueur
        btn.classList.add('active'); // Marquer la carte comme sélectionnée
        // Si plus de 2 cartes sont sélectionnées, on réinitialise pour recommencer
        if (selectedPlayer.length > 2) {
          selectedPlayer = [card]; // Réinitialisation pour recommencer avec la dernière carte
          document.querySelectorAll('#player-cards .card').forEach(b => b.classList.remove('active')); // Réinitialiser l'affichage
          btn.classList.add('active'); // Ajouter la carte sélectionnée
        }
      } else {
        selectedDealer = card;
        document.querySelectorAll('#dealer-cards .card').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
      updateAdvice();
    });
    container.appendChild(btn);
  });
}

function getValue(card) {
  if (['J','Q','K'].includes(card)) return 10;
  if (card === 'A') return 11;
  return parseInt(card);
}

function updateAdvice() {
  const adviceDiv = document.getElementById('advice');
  if (selectedPlayer.length < 2 || !selectedDealer) {
    adviceDiv.textContent = 'Sélectionne 2 cartes + celle du croupier';
    return;
  }

  const c1 = selectedPlayer[0];
  const c2 = selectedPlayer[1];
  const dealerCard = selectedDealer;

  // Split case
  if (c1 === c2) {
    if (c1 === 'A' || getValue(c1) === 8) {
      adviceDiv.textContent = '🔵 Split';
      return;
    } else if (getValue(c1) === 10) {
      adviceDiv.textContent = '🟡 Stand';
      return;
    }
  }

  // Soft hands (with Ace)
  const hasAce = c1 === 'A' || c2 === 'A';
  const total = getValue(c1) + getValue(c2);
  const dealerValue = getValue(dealerCard);

  if (hasAce && total <= 21) {
    if (total <= 17) {
      adviceDiv.textContent = '🟢 Hit';
    } else if (total === 18) {
      adviceDiv.textContent = dealerValue >= 9 ? '🟢 Hit' : '🟡 Stand';
    } else {
      adviceDiv.textContent = '🟡 Stand';
    }
    return;
  }

  // Hard hands
  if (total <= 8) {
    adviceDiv.textContent = '🟢 Hit';
  } else if (total === 9) {
    adviceDiv.textContent = dealerValue >= 3 && dealerValue <= 6 ? '🔴 Double' : '🟢 Hit';
  } else if (total === 10) {
    adviceDiv.textContent = dealerValue <= 9 ? '🔴 Double' : '🟢 Hit';
  } else if (total === 11) {
    adviceDiv.textContent = '🔴 Double';
  } else if (total === 12) {
    adviceDiv.textContent = dealerValue >= 4 && dealerValue <= 6 ? '🟡 Stand' : '🟢 Hit';
  } else if (total >= 13 && total <= 16) {
    adviceDiv.textContent = dealerValue <= 6 ? '🟡 Stand' : '🟢 Hit';
  } else {
    adviceDiv.textContent = '🟡 Stand';
  }
}

createCardButtons('player-cards', true);
createCardButtons('dealer-cards', false);
