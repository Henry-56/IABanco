import pandas as pd
import numpy as np

# Semilla para reproducibilidad
np.random.seed(42)

# Cantidad de datos simulados
n_samples = 50

# Generación de datos
data = {
    'Edad': np.random.randint(18, 70, n_samples),
    'Ingresos Mensuales': np.random.randint(1500, 15000, n_samples),
    'Deuda Total': np.random.randint(0, 50000, n_samples),
    'Historial Crediticio': np.random.choice(['Bueno', 'Regular', 'Malo'], n_samples, p=[0.5, 0.3, 0.2]),
    'Empleo Estable': np.random.choice(['Sí', 'No'], n_samples, p=[0.7, 0.3]),
    'Monto Solicitado': np.random.randint(1000, 50000, n_samples)
}

df = pd.DataFrame(data)

# Lógica simple para determinar estado "Aprobado" o "Rechazado" para entrenar el contexto
# (Solo para tener una base coherente, aunque la IA luego decidirá)
def determinar_estado(row):
    score = 0
    if row['Historial Crediticio'] == 'Bueno': score += 2
    elif row['Historial Crediticio'] == 'Regular': score += 1
    
    if row['Empleo Estable'] == 'Sí': score += 2
    
    ratio_deuda = row['Deuda Total'] / (row['Ingresos Mensuales'] * 12 + 1)
    if ratio_deuda < 0.3: score += 1
    elif ratio_deuda > 0.6: score -= 1
    
    if score >= 3:
        return 'Aprobado'
    else:
        return 'Rechazado'

df['Estado'] = df.apply(determinar_estado, axis=1)
df['Comentarios'] = df.apply(lambda row: f"Cliente con {row['Edad']} años e ingresos de {row['Ingresos Mensuales']}. Historial {row['Historial Crediticio']}.", axis=1)

# Guardar a Excel
output_path = 'backend/clients_history.xlsx'
df.to_excel(output_path, index=False)

print(f"Archivo generado en {output_path}")
