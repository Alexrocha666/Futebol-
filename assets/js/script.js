document.addEventListener('DOMContentLoaded', () => {
    // Mostra data atual
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    document.getElementById('current-date').textContent = 
        new Date().toLocaleDateString('pt-BR', dateOptions);
    
    // Carrega dados
    loadPredictions();
});

async function loadPredictions() {
    const container = document.getElementById('matches-container');
    
    try {
        // Caminho corrigido para GitHub Pages
        const response = await fetch('data/predictions.json');
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar: Status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verifica se há dados válidos
        if (!data || !data.matches) {
            throw new Error('Dados inválidos no arquivo JSON');
        }
        
        // Atualiza data de modificação
        document.getElementById('update-time').textContent = 
            new Date(data.lastUpdated).toLocaleString('pt-BR');
        
        // Exibe os jogos
        displayMatches(data.matches);
        
    } catch (error) {
        console.error("Erro detalhado:", error);
        showError(`Erro ao carregar dados: ${error.message}`);
    }
}

function displayMatches(matches) {
    const container = document.getElementById('matches-container');
    
    if (!matches || matches.length === 0) {
        container.innerHTML = '<div class="empty-message">Nenhum jogo programado para hoje</div>';
        return;
    }
    
    container.innerHTML = matches.map(match => `
        <div class="match-card">
            <div class="team-container">
                <div class="team">
                    <img src="${match.homeTeam.logo}" alt="${match.homeTeam.name}" 
                         onerror="this.onerror=null;this.src='https://via.placeholder.com/60?text=${match.homeTeam.name.substring(0,2)}'">
                    <h3>${match.homeTeam.name}</h3>
                </div>
                <div class="vs">VS</div>
                <div class="team">
                    <img src="${match.awayTeam.logo}" alt="${match.awayTeam.name}" 
                         onerror="this.onerror=null;this.src='https://via.placeholder.com/60?text=${match.awayTeam.name.substring(0,2)}'">
                    <h3>${match.awayTeam.name}</h3>
                </div>
            </div>
            
            <div class="predictions-grid">
                <div class="prediction-card">
                    <h4>Prob. Gols</h4>
                    <p>${match.predictions.goalsProbability}</p>
                </div>
                <div class="prediction-card">
                    <h4>Vencedor</h4>
                    <p>${match.predictions.winner}</p>
                </div>
                <div class="prediction-card">
                    <h4>Escanteios</h4>
                    <p>${match.predictions.corners}</p>
                </div>
            </div>
            
            <div class="match-summary">
                <p>${match.predictions.summary}</p>
            </div>
        </div>
    `).join('');
}

function showError(message) {
    const container = document.getElementById('matches-container');
    container.innerHTML = `
        <div class="error-message">
            <p>⚠️ Ocorreu um erro</p>
            <p>${message}</p>
            <p>Por favor, tente recarregar a página ou volte mais tarde.</p>
        </div>
    `;
}
