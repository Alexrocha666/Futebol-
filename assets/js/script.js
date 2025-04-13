document.addEventListener('DOMContentLoaded', function() {
    // Mostra a data atual
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR', options);
    
    // Carrega os dados das previsões
    fetch('../data/predictions.json')
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar dados');
            return response.json();
        })
        .then(data => {
            console.log('Dados carregados:', data);
            document.getElementById('last-update').textContent = new Date(data.lastUpdated).toLocaleString('pt-BR');
            displayMatches(data.matches);
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('matches-container').innerHTML = `
                <div class="error">
                    Erro ao carregar previsões: ${error.message}
                </div>
            `;
        });
});

function displayMatches(matches) {
    const container = document.getElementById('matches-container');
    
    if (!matches || matches.length === 0) {
        container.innerHTML = '<div class="no-matches">Nenhum jogo encontrado para hoje.</div>';
        return;
    }
    
    container.innerHTML = matches.map(match => `
        <div class="match-card">
            <div class="teams">
                <div class="team home-team">
                    <img src="${match.homeTeam.logo}" alt="${match.homeTeam.name}">
                    <span>${match.homeTeam.name}</span>
                </div>
                <div class="vs">VS</div>
                <div class="team away-team">
                    <img src="${match.awayTeam.logo}" alt="${match.awayTeam.name}">
                    <span>${match.awayTeam.name}</span>
                </div>
            </div>
            <div class="match-info">
                <div class="prediction-item">
                    <h3>Probabilidade de Gols</h3>
                    <div class="prediction-value">${match.predictions.goalsProbability}</div>
                </div>
                <div class="prediction-item">
                    <h3>Provável Vencedor</h3>
                    <div class="prediction-value">${match.predictions.winner}</div>
                </div>
                <div class="prediction-item">
                    <h3>Escanteios Estimados</h3>
                    <div class="prediction-value">${match.predictions.corners}</div>
                </div>
            </div>
            <div class="summary">
                <p>${match.predictions.summary}</p>
            </div>
        </div>
    `).join('');
}
