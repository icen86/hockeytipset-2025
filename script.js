document.addEventListener('DOMContentLoaded', function () {
  fetch('season_structure.json')
    .then(response => response.json())
    .then(data => populateGames(data))
    .catch(() => alert("Failed to load season structure."));

  document.getElementById('randomizeButton').addEventListener('click', randomizeResults);
  document.getElementById('submitButton').addEventListener('click', submitForm);
});

function populateGames(data) {
  const container = document.getElementById('games');
  container.innerHTML = '';

  data.gameList.forEach((game, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <fieldset>
        <legend>Game ${game.GameId}</legend>
        <div class="mb-2">
          Home Team: <input type="text" class="form-control" name="homeTeam${index}" required>
        </div>
        <div class="mb-2">
          Away Team: <input type="text" class="form-control" name="awayTeam${index}" required>
        </div>
        <div class="mb-2">
          Home Goals: <input type="number" class="form-control" name="homeGoals${index}" min="0" required>
        </div>
        <div class="mb-2">
          Away Goals: <input type="number" class="form-control" name="awayGoals${index}" min="0" required>
        </div>
        <input type="hidden" name="gameId${index}" value="${game.GameId}">
      </fieldset>
    `;
    container.appendChild(div);
  });
}

function randomizeResults() {
  const inputs = document.querySelectorAll('input[type=number]');
  for (let i = 0; i < inputs.length; i += 2) {
    let homeGoals, awayGoals;
    do {
      homeGoals = Math.floor(Math.random() * 7);
      awayGoals = Math.floor(Math.random() * 7);
    } while (homeGoals === awayGoals);

    inputs[i].value = homeGoals;
    inputs[i + 1].value = awayGoals;
  }
}

function submitForm(event) {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  if (!name) return alert('Please enter your name.');

  const gameList = [];
  const totalGames = document.querySelectorAll('fieldset').length;

  for (let i = 0; i < totalGames; i++) {
    const homeTeam = document.querySelector(`[name=homeTeam${i}]`).value;
    const awayTeam = document.querySelector(`[name=awayTeam${i}]`).value;
    const homeGoals = parseInt(document.querySelector(`[name=homeGoals${i}]`).value);
    const awayGoals = parseInt(document.querySelector(`[name=awayGoals${i}]`).value);
    const gameId = parseInt(document.querySelector(`[name=gameId${i}]`).value);

    if (homeGoals === awayGoals) return alert(`Game ${gameId} cannot be a tie.`);

    gameList.push({
      HomeTeam: homeTeam,
      AwayTeam: awayTeam,
      HomeGoals: homeGoals,
      AwayGoals: awayGoals,
      GameId: gameId,
      Date: date
    });
  }

  const result = {
    Name: name,
    GameList: gameList
  };

  const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${name}_hockeytipset.json`;
  a.click();
}
