import requests
from bs4 import BeautifulSoup
import pandas as pd
import numpy as np
import json
from datetime import datetime
import os

def scrape_matches():
    # Esta é uma função de exemplo - você precisará adaptar para cada site específico
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    # Exemplo com FootyStats (precisa ser adaptado)
    url = "https://footystats.org/"
    
    try:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Aqui você precisará analisar o HTML do site para extrair os dados
        # Este é apenas um exemplo genérico
        
        matches = []
        
        # Simulando dados - na prática você extrairia isso do site
        today = datetime.now().strftime("%Y-%m-%d")
        matches.append({
            "homeTeam": {
                "name": "Flamengo",
                "logo": "https://media.api-sports.io/football/teams/598.png"
            },
            "awayTeam": {
                "name": "Palmeiras",
                "logo": "https://media.api-sports.io/football/teams/603.png"
            },
            "predictions": {
                "goalsProbability": "Alta (75%)",
                "winner": "Flamengo (60%)",
                "corners": "8-10",
                "summary": "O Flamengo vem de uma boa sequência de 4 vitórias nos últimos 5 jogos..."
            }
        })
        
        return {
            "lastUpdated": datetime.now().isoformat(),
            "matches": matches
        }
        
    except Exception as e:
        print(f"Error scraping data: {e}")
        return None

def analyze_last_matches(team_name, is_home):
    # Esta função seria usada para analisar os últimos 15 jogos de um time
    # Aqui você implementaria sua lógica de análise
    
    # Exemplo simplificado
    if team_name == "Flamengo":
        if is_home:
            return {"avg_goals": 2.1, "avg_corners": 5.8, "form": "WWWLW"}
        else:
            return {"avg_goals": 1.7, "avg_corners": 4.5, "form": "WWDLW"}
    elif team_name == "Palmeiras":
        if is_home:
            return {"avg_goals": 1.9, "avg_corners": 6.2, "form": "WLWWW"}
        else:
            return {"avg_goals": 1.3, "avg_corners": 4.8, "form": "LWLDW"}
    else:
        return {"avg_goals": 1.5, "avg_corners": 5.0, "form": "DDLLW"}

def generate_predictions(matches_data):
    # Esta função geraria as previsões baseadas nos dados coletados
    predictions = []
    
    for match in matches_data:
        home_team = match["homeTeam"]["name"]
        away_team = match["awayTeam"]["name"]
        
        home_stats = analyze_last_matches(home_team, True)
        away_stats = analyze_last_matches(away_team, False)
        
        # Lógica simplificada de previsão
        total_goals = (home_stats["avg_goals"] + away_stats["avg_goals"]) / 2
        if total_goals > 2.5:
            goals_prob = "Alta (75%)"
        elif total_goals > 1.5:
            goals_prob = "Média (55%)"
        else:
            goals_prob = "Baixa (35%)"
            
        # Simulando vencedor (na prática seria mais complexo)
        if home_stats["form"] > away_stats["form"]:
            winner = f"{home_team} (60%)"
        else:
            winner = f"{away_team} (60%)"
            
        # Escanteios
        corners = f"{int((home_stats['avg_corners'] + away_stats['avg_corners'])/2)}-{int((home_stats['avg_corners'] + away_stats['avg_corners'])/2 + 2)}"
        
        summary = f"O {home_team} vem de uma sequência de {home_stats['form']} nos últimos 5 jogos, enquanto o {away_team} teve {away_stats['form']}. O {home_team} tem média de {home_stats['avg_goals']} gols por jogo em casa, contra {away_stats['avg_goals']} do {away_team} fora."
        
        predictions.append({
            "homeTeam": match["homeTeam"],
            "awayTeam": match["awayTeam"],
            "predictions": {
                "goalsProbability": goals_prob,
                "winner": winner,
                "corners": corners,
                "summary": summary
            }
        })
    
    return predictions

def main():
    # Scrape dos jogos do dia
    matches_data = scrape_matches()
    
    if not matches_data:
        print("No matches data found")
        return
    
    # Gerar previsões
    predictions = generate_predictions(matches_data)
    
    # Criar o objeto final
    output = {
        "lastUpdated": datetime.now().isoformat(),
        "matches": predictions
    }
    
    # Salvar em JSON
    with open("data/predictions.json", "w") as f:
        json.dump(output, f, indent=2)
    
    print("Predictions updated successfully")

if __name__ == "__main__":
    main()
