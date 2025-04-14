import requests
from bs4 import BeautifulSoup
import pandas as pd
import json
from datetime import datetime
import os

# Lista de fontes para scraping (exemplos)
SOURCES = {
    'sofascore': 'https://www.sofascore.com/',
    'flashscore': 'https://www.flashscore.com/',
    'soccerstats': 'https://www.soccerstats.com/'
}

def safe_scrape(url):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return BeautifulSoup(response.text, 'html.parser')
    except Exception as e:
        print(f"Erro ao acessar {url}: {str(e)}")
        return None

def extract_match_data(soup, source):
    # Implemente a extração específica para cada site
    if 'sofascore' in source:
        # Exemplo genérico - precisa ser adaptado
        return {
            'teams': ['Time A', 'Time B'],
            'stats': {
                'avg_goals': 2.5,
                'corners': 8.2,
                'home_win_rate': 0.65
            }
        }
    # Adicione outros sites...

def scrape_all_sources():
    all_data = []
    
    for name, url in SOURCES.items():
        print(f"Coletando dados de {name}...")
        soup = safe_scrape(url)
        if soup:
            data = extract_match_data(soup, url)
            if data:
                data['source'] = name
                all_data.append(data)
    
    return all_data

def save_data(data):
    os.makedirs('data', exist_ok=True)
    with open('data/scraped_data.json', 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    print("Iniciando coleta de dados...")
    match_data = scrape_all_sources()
    save_data(match_data)
    print("Coleta concluída!")
