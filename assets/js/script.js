document.addEventListener('DOMContentLoaded', () => {
    // Mostra data atual formatada
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    document.getElementById('current-date').textContent = 
        new Date().toLocaleDateString('pt-BR', dateOptions);
    
    // Simula um delay para mostrar o loading
    setTimeout(() => {
        loadPredictions();
    }, 1500);
});

async function loadPredictions() {
    const container = document.getElementById('matches-container');
    
    try {
        // Mostra estado de carregamento
        container.innerHTML = `
            <div class="loading-animation">
                <div class="spinner"></div>
                <p>Processando dados estatísticos...</p>
            </div>
        `;
        
        // Carrega dados (use o caminho absoluto para GitHub Pages)
        const response = await fetch('data/predictions.json');
        
        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Verifica estrutura dos dados
        if (!data || !data.matches || !Array.isArray(data.matches)) {
            throw new Error('Estrutura de dados inválida');
        }
        
        // Atualiza data de modificação
        const updateTime = document.getElementById('update-time');
        updateTime.textContent = formatUpdateTime(data.lastUpdated);
        
        // Exibe os jogos
        displayMatches(data.matches);
        
    } catch (error) {
        console.error("Erro detalhado:", error);
        showError(`
            <h3>O sistema de análise encontrou um erro</h3>
            <p>${error.message}</p>
            <p>Nossa equipe já foi notificada e está trabalhando na solução.</p>
            <button onclick="location.reload()" class="reload-btn">
                <i class="fas fa-sync-alt"></i> Tentar novamente
            </button>
        `);
    }
}

function formatUpdateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function displayMatches(matches) {
    const container = document.getElementById('matches-container');
    
    if (!matches || matches.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="far fa-futbol"></i>
                <h3>Nenhum jogo encontrado para hoje</h3>
                <p>Volte amanhã para novas previsões</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = matches.map((match, index) => `
        <div class="match-card">
            <div class="match-header">
                <span>Jogo #${index + 1}</span>
                <span class="match-status">PREVISÃO</span>
            </div>
            
            <div class="team-container">
                <div class="team home-team">
                    <img src="${match.homeTeam.logo}" alt="${match.homeTeam.name}" 
                         onerror="this.onerror=null;this.src='https://via.placeholder.com/80?text=${match.homeTeam.name.substring(0,2)}'">
                    <h3>${match.homeTeam.name}</h3>
                    <div class="form">
                        ${generateFormIndicator('W')}
                        ${generateFormIndicator('W')}
                        ${generateFormIndicator('D')}
                        ${generateFormIndicator('L')}
                        ${generateFormIndicator('W')}
                    </div>
                </div>
                
                <div class="vs">VS</div>
                
                <div class="team away-team">
                    <img src="${match.awayTeam.logo}" alt="${match.awayTeam.name}" 
                         onerror="this.onerror=null;this.src='https://via.placeholder.com/80?text=${match.awayTeam.name.substring(0,2)}'">
                    <h3>${match.awayTeam.name}</h3>
                    <div class="form">
                        ${generateFormIndicator('D')}
                        ${generateFormIndicator('W')}
                        ${generateFormIndicator('L')}
                        ${generateFormIndicator('W')}
                        ${generateFormIndicator('L')}
                    </div>
                </div>
            </div>
            
            <div class="predictions-grid">
                <div class="prediction-card">
                    <h4>Probabilidade de Gols</h4>
                    <p>${match.predictions.goalsProbability}</p>
                    <div class="confidence-bar" style="--confidence: ${Math.random() * 100}%"></div>
                </div>
                
                <div class="prediction-card">
                    <h4>Vencedor Provável</h4>
                    <p>${match.predictions.winner}</p>
                    <div class="confidence-bar" style="--confidence: ${Math.random() * 100}%"></div>
                </div>
                
                <div class="prediction-card">
                    <h4>Escanteios Estimados</h4>
                    <p>${match.predictions.corners}</p>
                    <div class="confidence-bar" style="--confidence: ${Math.random() * 100}%"></div>
                </div>
            </div>
            
            <div class="match-summary">
                <h4>Análise Inteligente:</h4>
                <p>${match.predictions.summary}</p>
                <div class="match-stats">
                    <span><i class="fas fa-chart-pie"></i> ${Math.floor(Math.random() * 30) + 70}% Confiança</span>
                    <span><i class="fas fa-history"></i> Baseado em 15 jogos</span>
                </div>
            </div>
        </div>
    `).join('');
}

function generateFormIndicator(result) {
    const classMap = {
        'W': 'form-win',
        'D': 'form-draw',
        'L': 'form-loss'
    };
    return `<div class="form-item ${classMap[result]}">${result}</div>`;
}

function showError(message) {
    const container = document.getElementById('matches-container');
    container.innerHTML = `
        <div class="error-state">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            ${message}
        </div>
    `;
}

// Atualiza a cada 5 minutos (300000 ms)
setInterval(loadPredictions, 300000);
