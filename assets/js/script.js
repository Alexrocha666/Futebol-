document.addEventListener('DOMContentLoaded', () => {
    // Formata data atual
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR', options);
    
    loadPredictions();
});

async function loadPredictions() {
    const container = document.getElementById('matches-container');
    
    try {
        // 1. Tenta carregar dados do JSON
        const response = await fetch('data/predictions.json');
        
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        
        const data = await response.json();
        
        // 2. Valida dados
        if (!data?.matches?.length) throw new Error('Nenhum jogo encontrado');
        
        // 3. Atualiza UI
        document.getElementById('update-time').textContent = 
            new Date(data.lastUpdated).toLocaleString('pt-BR');
        
        displayMatches(data.matches);
        
    } catch (error) {
        console.error("Erro:", error);
        showError(`
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erro na análise</h3>
                <p>${error.message}</p>
                <button onclick="location.reload()">Recarregar</button>
            </div>
        `);
    }
}

function displayMatches(matches) {
    const container = document.getElementById('matches-container');
    
    container.innerHTML = matches.map(match => `
        <div class="match-card">
            <div class="teams">
                <div class="team">
                    <img src="assets/images/${match.homeTeam.name.toLowerCase()}.png" 
                         alt="${match.homeTeam.name}"
                         onerror="this.src='https://via.placeholder.com/80?text=${match.homeTeam.name.substring(0,2)}'">
                    <h3>${match.homeTeam.name}</h3>
                </div>
                
                <div class="vs">VS</div>
                
                <div class="team">
                    <img src="assets/images/${match.awayTeam.name.toLowerCase()}.png" 
                         alt="${match.awayTeam.name}"
                         onerror="this.src='https://via.placeholder.com/80?text=${match.awayTeam.name.substring(0,2)}'">
                    <h3>${match.awayTeam.name}</h3>
                </div>
            </div>
            
            <div class="predictions">
                <div class="prediction">
                    <h4>Prob. Gols</h4>
                    <p>${match.predictions.goalsProbability}</p>
                </div>
                <div class="prediction">
                    <h4>Vencedor</h4>
                    <p>${match.predictions.winner}</p>
                </div>
                <div class="prediction">
                    <h4>Escanteios</h4>
                    <p>${match.predictions.corners}</p>
                </div>
            </div>
            
            <div class="summary">
                <p>${match.predictions.summary}</p>
            </div>
        </div>
    `).join('');
}

function showError(message) {
    const container = document.getElementById('matches-container');
    container.innerHTML = message;
}
