import json
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from datetime import datetime

class MatchPredictor:
    def __init__(self):
        # Modelo de Machine Learning
        self.model = RandomForestClassifier(n_estimators=100)
        
    def load_data(self):
        with open('data/scraped_data.json') as f:
            return json.load(f)
    
    def preprocess_data(self, raw_data):
        # Transforma dados brutos em features para o modelo
        processed = []
        for match in raw_data:
            processed.append([
                match['stats']['avg_goals'],
                match['stats']['corners'],
                match['stats']['home_win_rate']
            ])
        return np.array(processed)
    
    def train_model(self, X, y):
        self.model.fit(X, y)
    
    def predict_match(self, match_stats):
        # Prever probabilidades
        proba = self.model.predict_proba([match_stats])[0]
        return {
            'home_win': proba[0],
            'draw': proba[1],
            'away_win': proba[2]
        }
    
    def estimate_goals(self, stats):
        # Média ponderada de gols
        return round(stats['avg_goals'] * 1.2, 1)
    
    def estimate_corners(self, stats):
        # Média de escanteios
        return f"{int(stats['corners'])}-{int(stats['corners'] + 2)}"

def main():
    print("Iniciando análise...")
    
    # 1. Carrega dados coletados
    predictor = MatchPredictor()
    raw_data = predictor.load_data()
    
    # 2. Pré-processamento (simulado - em produção use dados históricos)
    X = predictor.preprocess_data(raw_data)
    y = np.random.choice([0, 1, 2], size=len(X))  # Simula dados de treino
    
    # 3. Treina modelo
    predictor.train_model(X, y)
    
    # 4. Gera previsões (exemplo com último jogo coletado)
    last_match = raw_data[-1]
    prediction = {
        'teams': last_match['teams'],
        'predictions': {
            'winner': predictor.predict_match(last_match['stats']),
            'goals': predictor.estimate_goals(last_match['stats']),
            'corners': predictor.estimate_corners(last_match['stats'])
        },
        'analysis': "Baseado em múltiplas fontes com análise preditiva",
        'lastUpdated': datetime.now().isoformat()
    }
    
    # 5. Salva previsões
    with open('data/predictions.json', 'w') as f:
        json.dump({'matches': [prediction]}, f, indent=2)
    
    print("Análise concluída!")

if __name__ == "__main__":
    main()
