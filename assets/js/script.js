function displayMatches(matches) {
    const container = document.getElementById('matches-container');
    
    container.innerHTML = matches.map(match => `
        <div class="match-card">
            <div class="match-header">
                <h3>${match.homeTeam.name} × ${match.awayTeam.name}</h3>
            </div>
            
            <div class="teams-container">
                <div class="team">
                    <img src="assets/images/times/${match.homeTeam.logo}" 
                         alt="${match.homeTeam.name}"
                         onerror="this.src='https://via.placeholder.com/100?text=${match.homeTeam.name.substring(0,2)}'">
                    <h4>${match.homeTeam.name}</h4>
                </div>
                
                <div class="vs">VS</div>
                
                <div class="team">
                    <img src="assets/images/times/${match.awayTeam.logo}" 
                         alt="${match.awayTeam.name}"
                         onerror="this.src='https://via.placeholder.com/100?text=${match.awayTeam.name.substring(0,2)}'">
                    <h4>${match.awayTeam.name}</h4>
                </div>
            </div>
            
            <div class="predictions-grid">
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
    `).join('');
}
