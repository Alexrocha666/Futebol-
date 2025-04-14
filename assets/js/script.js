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
    
    // Simula carregamento
    setTimeout(loadPredictions, 1500);
});

async function loadPredictions() {
    const container = document.getElementById('matches-container');
    
    try {
        const response = await fetch('data/predictions.json');
        const data = await response.json();
        
        document.getElementById('update-time').textContent = 
            new Date(data.lastUpdated).toLocaleString('pt-BR');
        
        container.innerHTML = data.matches.map(match => `
            <div class="match-card">
                <div class="match-header" style="background: linear-gradient(to right, var(--primary), var(--secondary))">
                    <h3>${match.homeTeam.name} vs ${match.awayTeam.name}</h3>
                </div>
                
                <div class="match-body">
                    <div class="prediction-grid">
                        <div class="prediction">
                            <h4><i class="fas fa-futbol"></i> Prob. Gols</h4>
                            <p>${match.predictions.goalsProbability}</p>
                        </div>
                        <div class="prediction">
                            <h4><i class="fas fa-trophy"></i> Vencedor</h4>
                            <p>${match.predictions.winner}</p>
                        </div>
                        <div class="prediction">
                            <h4><i class="fas fa-flag"></i> Escanteios</h4>
                            <p>${match.predictions.corners}</p>
                        </div>
                    </div>
                    
                    <div class="summary">
                        <p>${match.predictions.summary}</p>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erro ao carregar previsões</h3>
                <p>${error.message}</p>
                <button onclick="location.reload()">
                    <i class="fas fa-sync-alt"></i> Tentar novamente
                </button>
            </div>
        `;
    }
}
