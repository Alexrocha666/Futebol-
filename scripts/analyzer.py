# (...código anterior...)

def main():
    print("Iniciando análise...")
    predictor = MatchPredictor()
    raw_data = predictor.load_data()
    
    # Simulação - gerando previsões para 5 jogos
    matches = []
    for i in range(min(5, len(raw_data)):  # Mostra até 5 jogos
        match_data = raw_data[i]
        stats = match_data['stats']
        
        # Gera previsões variadas para demonstração
        matches.append({
            'homeTeam': {
                'name': match_data['teams'][0],
                'logo': f"{match_data['teams'][0].lower().replace(' ', '')}.png"
            },
            'awayTeam': {
                'name': match_data['teams'][1],
                'logo': f"{match_data['teams'][1].lower().replace(' ', '')}.png"
            },
            'predictions': {
                'goalsProbability': f"{stats['avg_goals']:.1f} gols ({(stats['avg_goals']/3.5)*100:.0f}%)",
                'winner': f"{match_data['teams'][0]} ({stats['home_win_rate']*100:.0f}%)",
                'corners': f"{int(stats['corners'])}-{int(stats['corners'] + 2)}",
                'summary': generate_analysis(stats)
            }
        })

    # Salva com data atual
    with open('data/predictions.json', 'w') as f:
        json.dump({
            'lastUpdated': datetime.now().isoformat(),
            'matches': matches
        }, f, indent=2)

def generate_analysis(stats):
    analysis = []
    if stats['home_win_rate'] > 0.7:
        analysis.append("O time da casa tem desempenho excelente")
    elif stats['home_win_rate'] < 0.3:
        analysis.append("O visitante vem melhor")
    
    if stats['avg_goals'] > 2.5:
        analysis.append("Expectativa de jogo movimentado")
    else:
        analysis.append("Possível jogo truncado")
    
    return " ".join(analysis) + f" (baseado em {stats['sources']} fontes)"
