document.addEventListener('DOMContentLoaded', () => {
    // Mostra data atual
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR', dateOptions);
    
    // Carrega dados
    loadPredictions();
});

async function loadPredictions() {
    const container = document.getElementById('matches-container');
    
    try {
        // IMPORTANTE: Use este caminho para GitHub Pages
        const response = await fetch('Futebol-/data/predictions.json');
        
        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        // Atualiza data de modificação
        document.getElementById('update-time').textContent = 
            new Date(data.lastUpdated).toLocaleString('pt-BR');
        
        // Exibe os jogos
        displayMatches(data.matches);
        
    } catch (error) {
