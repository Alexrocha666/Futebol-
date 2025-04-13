import pandas as pd
import os

# Simulação de scraping real - depois substituir por scraping dos sites reais
def simular_ultimos_jogos(time):
    import random
    resultados = []
    for _ in range(15):
        gols_feitos = random.randint(0, 4)
        gols_sofridos = random.randint(0, 4)
        escanteios = random.randint(2, 10)
        vitoria = gols_feitos > gols_sofridos
        resultados.append({
            "gols_feitos": gols_feitos,
            "gols_sofridos": gols_sofridos,
            "escanteios": escanteios,
            "vitoria": vitoria
        })
    return resultados

def analisar_time(jogos):
    total = len(jogos)
    gols_marcados = sum(j["gols_feitos"] for j in jogos) / total
    gols_sofridos = sum(j["gols_sofridos"] for j in jogos) / total
    escanteios = sum(j["escanteios"] for j in jogos) / total
    vitorias = sum(1 for j in jogos if j["vitoria"]) / total
    return {
        "media_gols": round(gols_marcados, 2),
        "media_sofridos": round(gols_sofridos, 2),
        "media_escanteios": round(escanteios, 2),
        "vitorias_pct": round(vitorias * 100, 1)
    }

def gerar_resumo(timeA, timeB, statsA, statsB):
    vencedor = timeA if statsA["vitorias_pct"] > statsB["vitorias_pct"] else timeB if statsB["vitorias_pct"] > statsA["vitorias_pct"] else "Empate"
    tendencia_gols = "Alta" if (statsA["media_gols"] + statsB["media_gols"]) / 2 > 2.5 else "Média" if (statsA["media_gols"] + statsB["media_gols"]) / 2 > 1.5 else "Baixa"
    tendencia_escanteios = "Alta" if (statsA["media_escanteios"] + statsB["media_escanteios"]) / 2 > 9 else "Média" if (statsA["media_escanteios"] + statsB["media_escanteios"]) / 2 > 6 else "Baixa"
    
    resumo = (
        f"{timeA} tem média de {statsA['media_gols']} gols por jogo e venceu {statsA['vitorias_pct']}% dos últimos 15 jogos. "
        f"{timeB} tem média de {statsB['media_gols']} gols e venceu {statsB['vitorias_pct']}%. "
        f"A tendência é de {tendencia_gols} quantidade de gols e {tendencia_escanteios} escanteios. "
        f"Provável vencedor: {vencedor}."
    )
    
    return {
        "time_casa": timeA,
        "time_fora": timeB,
        "gols": tendencia_gols,
        "escanteios": tendencia_escanteios,
        "vencedor": vencedor,
        "resumo": resumo
    }

def gerar_analises():
    df = pd.read_csv("data/partidas.csv")
    resultados = []
    for _, row in df.iterrows():
        casa = row["casa"]
        fora = row["fora"]
        jogos_casa = simular_ultimos_jogos(casa)
        jogos_fora = simular_ultimos_jogos(fora)
        stats_casa = analisar_time(jogos_casa)
        stats_fora = analisar_time(jogos_fora)
        analise = gerar_resumo(casa, fora, stats_casa, stats_fora)
        resultados.append(analise)

    os.makedirs("data", exist_ok=True)
    pd.DataFrame(resultados).to_csv("data/analises.csv", index=False)
    print("Análises salvas em data/analises.csv")

if __name__ == "__main__":
    gerar_analises()
