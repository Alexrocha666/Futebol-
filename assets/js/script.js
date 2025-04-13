document.addEventListener('DOMContentLoaded', () => {
    // Formata data atual
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
        // Caminho absoluto para GitHub Pages
        const response = await fetch('/Futebol-/data/predictions.json');
        
        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        // Valida dados
        if (!data || !data.matches || !Array.isArray(data.matches)) {
            throw new Error('Dados inválidos no arquivo JSON');
        }
        
        // Atualiza horário
        document.getElementById('update-time').textContent = 
            new Date(data.lastUpdated).toLocaleString('pt-BR');
        
        // Exibe jogos
        displayMatches(data.matches);
        
    } catch (error) {
        console.error("Erro detalhado:", error);
        showError(`
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Sistema temporariamente indisponível</h3>
            <p>${error.message}</p>
            <button onclick="window.location.reload()" class="retry-btn">
                <i class="fas fa-sync-alt"></i> Tentar novamente
            </button>
        `);
    }
}

function displayMatches(matches) {
    const container = document.getElementById('matches-container');
    
    if (!matches || matches.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="far fa-futbol"></i>
                <h3>Nenhum jogo hoje</h3>
                <p>Volte amanhã para novas previsões</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = matches.map(match => `
        <div class="match-card">
            <div class="team-container">
                <div class="team">
                    <img src="assets/images/${match.homeTeam.name.toLowerCase()}.png" 
                         alt="${match.homeTeam.name}"
                         onerror="this.onerror=null;this.src='https://via.placeholder.com/80?text=${match.homeTeam.name.substring(0,2)}'">
                    <h3>${match.homeTeam.name}</h3>
                </div>
                
                <div class="vs">VS</div>
                
                <div class="team">
                    <img src="assets/images/${match.awayTeam.name.toLowerCase()}.png" 
                         alt="${match.awayTeam.name}"
                         onerror="this.onerror=null;this.src='https://via.placeholder.com/80?text=${match.awayTeam.name.substring(0,2)}'">
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
        <div class="error-state">
            ${message}
        </div>
    `;
}
