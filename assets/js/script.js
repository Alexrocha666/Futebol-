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
    
    // Simula um breve loading
    setTimeout(loadPredictions, 1200);
});

async function loadPredictions() {
    const container = document.getElementById('matches-container');
    
    try {
        // Caminho absoluto para GitHub Pages
        const response = await fetch('/Futebol-/data/predictions.json');
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Atualiza data de modificação
        document.getElementById('update-time').textContent = 
            new Date(data.lastUpdated).toLocaleString('pt-BR');
        
        displayMatches(data.matches);
        
    } catch (error) {
        console.error("Erro detalhado:", error);
        showError(`
            <div class="error-message">
                <div class="error-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h3>Erro na Análise</h3>
                <p>${error.message}</p>
                <button class="retry-btn" onclick="location.reload()">
                    <i class="fas fa-sync-alt"></i> Tentar Novamente
                </button>
            </div>
        `);
    }
}

function displayMatches(matches) {
    const container = document.getElementById('matches-container');
    
    if (!matches || matches.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="far fa-futbol"></i>
                <h3>Nenhum Jogo Hoje</h3>
                <p>Volte amanhã para novas previsões</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = matches.map(match => `
        <div class="match-card">
            <div class="match-header">
                <h3>${match.homeTeam.name} vs ${match.awayTeam.name}</h3>
            </div>
            
            <div class="match-body">
                <div class="prediction-grid">
                    <div class="prediction">
                        <h4><i class="fas fa-futbol"></i> Probabilidade de Gols</h4>
                        <p>${match.predictions.goalsProbability}</p>
                    </div>
                    <div class="prediction">
                        <h4><i class="fas fa-trophy"></i> Vencedor Provável</h4>
                        <p>${match.predictions.winner}</p>
                    </div>
                    <div class="prediction">
                        <h4><i class="fas fa-flag"></i> Escanteios Estimados</h4>
                        <p>${match.predictions.corners}</p>
                    </div>
                </div>
                
                <div class="summary">
                    <h4><i class="fas fa-chart-line"></i> Análise Detalhada:</h4>
                    <p>${match.predictions.summary}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function showError(message) {
    const container = document.getElementById('matches-container');
    container.innerHTML = message;
}
