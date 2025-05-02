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
        selectedPlayer.push(card); // Ajouter la carte à la main du joueur
        btn.classList.add('active');
        if (selectedPlayer.length > 2) {
          selectedPlayer = [card]; // Réinitialisation pour recommencer avec la dernière carte
          document.querySelectorAll('#player-cards .card').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
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

  // Cas de Split
  if (c1 === c2) {
    // Si le joueur a deux As et que le croupier a aussi un As, on recommande de tirer
    if (c1 === 'A' && dealerCard !== 'A') {
      adviceDiv.textContent = '🔵 Diviser (Split)';
      return;
    } else if (c1 === 'A' || getValue(c1) === 8) {
      adviceDiv.textContent = '🔵 Diviser (Split)';
      return;
    } else if (getValue(c1) === 10) {
      adviceDiv.textContent = '🟡 Rester (Stand)';
      return;
    }
  }

  // Main douce (avec un As)
  const hasAce = c1 === 'A' || c2 === 'A';
  const total = getValue(c1) + getValue(c2);
  const dealerValue = getValue(dealerCard);

  if (hasAce && total <= 21) {
    if (total <= 17) {
      adviceDiv.textContent = '🟢 Tirer (Hit)';
    } else if (total === 18) {
      adviceDiv.textContent = dealerValue >= 9 ? '🟢 Tirer (Hit)' : '🟡 Rester (Stand)';
    } else {
      adviceDiv.textContent = '🟡 Rester (Stand)';
    }
    return;
  }

  // Main dure
  if (total <= 8) {
    adviceDiv.textContent = '🟢 Tirer (Hit)';
  } else if (total === 9) {
    adviceDiv.textContent = dealerValue >= 3 && dealerValue <= 6 ? '🔴 Doubler (Double)' : '🟢 Tirer (Hit)';
  } else if (total === 10) {
    adviceDiv.textContent = dealerValue <= 9 ? '🔴 Doubler (Double)' : '🟢 Tirer (Hit)';
  } else if (total === 11) {
    adviceDiv.textContent = '🔴 Doubler (Double)';
  } else if (total === 12) {
    adviceDiv.textContent = dealerValue >= 4 && dealerValue <= 6 ? '🟡 Rester (Stand)' : '🟢 Tirer (Hit)';
  } else if (total >= 13 && total <= 16) {
    adviceDiv.textContent = dealerValue <= 6 ? '🟡 Rester (Stand)' : '🟢 Tirer (Hit)';
  } else {
    adviceDiv.textContent = '🟡 Rester (Stand)';
  }
}

createCardButtons('player-cards', true);
createCardButtons('dealer-cards', false);
