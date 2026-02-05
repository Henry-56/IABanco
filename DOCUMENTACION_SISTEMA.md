# CrediAI Pro - Sistema Híbrido de Evaluación de Riesgo Crediticio

## 📋 Descripción General

CrediAI Pro es un sistema avanzado de evaluación de riesgo crediticio que combina dos metodologías complementarias:

1. **Inteligencia Artificial (IA)** - Motor RAG (Retrieval-Augmented Generation) con Google Gemini
2. **Método Tradicional** - Sistema de Scorecard configurable con bandas de tasas

El sistema permite a los analistas comparar ambos métodos, tomar decisiones informadas y mantener un registro completo de auditoría.

---

## 🎯 Funcionalidades Principales

### 1. Evaluación Dual (IA + Tradicional)

Cada solicitud de crédito es evaluada simultáneamente por ambos métodos:

#### **Método IA (RAG)**
- Carga base de conocimiento desde Excel con historial de clientes
- Genera embeddings usando Gemini text-embedding-004
- Busca casos similares usando similitud coseno
- Genera decisión contextualizada con explicación detallada
- Proporciona score estimado, tasa y factores clave

#### **Método Tradicional (Scorecard)**
- Sistema de puntuación ponderada basado en 5 factores:
  - Edad (peso configurable, por defecto 15%)
  - Ingresos mensuales (por defecto 25%)
  - Ratio deuda/ingreso (por defecto 20%)
  - Historial crediticio (por defecto 25%)
  - Empleo estable (por defecto 15%)
- Bandas de tasas según score total
- Cálculo automático de cuota mensual
- Decisión basada en umbral configurable (por defecto 60 puntos)

### 2. Comparativa Automática

El sistema genera automáticamente una comparativa entre ambos métodos mostrando:

- **Diferencia de Riesgo**: Comparación de scores (0-100)
- **Diferencia de Tasa**: Diferencia porcentual en tasas asignadas
- **Diferencia de Tiempo**: Comparación de tiempos de evaluación (ms)
- **Concordancia**: Indica si ambos métodos llegaron a la misma decisión
- **Visualizaciones**:
  - Gráfica de barras comparativa (scores y tasas)
  - Gráfica radar de factores (método tradicional)
  - Tabla detallada de puntuaciones por factor

### 3. Decisión Final del Analista

Panel interactivo donde el analista puede:

- **Aceptar IA**: Usar la decisión del motor RAG
- **Mantener Tradicional**: Usar la decisión del scorecard
- **Ajustar Manualmente**: Crear condiciones personalizadas con:
  - Monto ajustado
  - Plazo ajustado
  - Tasa ajustada
  - Condiciones especiales (garantías, etc.)

Cada decisión requiere:
- Selección de decisión final (Aprobado/Rechazado)
- Justificación obligatoria (mínimo 20 caracteres)
- Registro automático en auditoría

### 4. Panel de Configuración

Sistema configurable para el método tradicional:

#### **Pesos de Factores**
- Ajuste individual de cada factor
- Validación automática (deben sumar 100%)
- Interfaz intuitiva con inputs numéricos

#### **Umbral de Aprobación**
- Score mínimo para aprobar (0-100)
- Ajustable según políticas de la institución

#### **Bandas de Tasas**
- 6 bandas predefinidas (AAA a B)
- Edición de:
  - Score mínimo y máximo
  - Tasa de interés asignada
  - Nombre de clasificación

#### **Funciones**
- Guardar configuración
- Restaurar valores por defecto
- Validación en tiempo real

### 5. Sistema de Auditoría y Trazabilidad

Registro completo de todas las evaluaciones:

#### **Datos Registrados por Evaluación**
- ID único de transacción
- Fecha y hora (timestamp ISO + local)
- Usuario/analista responsable
- Datos completos del cliente
- Resultados de ambas evaluaciones (IA y Tradicional)
- Comparativa calculada
- Decisión final del analista
- Estado (pendiente/aprobado/rechazado)
- Justificación del analista
- Ajustes realizados (si aplica)

#### **Almacenamiento**
- LocalStorage del navegador
- Persistencia entre sesiones
- Función de limpieza de logs antiguos (>90 días)

#### **Filtros Disponibles**
- Por estado (pendiente/aprobado/rechazado)
- Por método final (IA/tradicional/ajustado)
- Por rango de fechas
- Combinaciones múltiples

### 6. Reportes PRE-POST Exportables

Sistema de exportación de datos para análisis:

#### **Exportación CSV (Auditoría Completa)**
Columnas incluidas:
- Identificación (ID, Fecha, Usuario)
- Datos del cliente (edad, ingresos, deuda, historial, empleo, monto, plazo)
- Resultados IA (decisión, score, tasa)
- Resultados Tradicional (decisión, score, tasa)
- Comparativa (diferencias de riesgo y tasa)
- Decisión final (método, decisión, justificación, estado)
- Métricas de rendimiento (tiempos de evaluación)

#### **Exportación JSON (Estadísticas)**
Incluye:
- Total de evaluaciones
- Cantidades por estado (aprobados, rechazados, pendientes)
- Tasa de aprobación general
- Concordancia IA-Tradicional (%)
- Decisiones por método (IA, Tradicional, Ajustado)
- Tiempos promedio de evaluación

#### **Estadísticas en Panel**
Dashboard visual con:
- Tarjetas de métricas clave
- Gráficos de distribución
- Indicadores de rendimiento
- Comparación de métodos

### 7. Explicabilidad Mejorada

Ambos métodos proporcionan explicaciones detalladas:

#### **IA (RAG)**
- Explicación narrativa del análisis
- Lista de factores clave considerados
- Contexto de casos similares encontrados
- Score estimado con justificación
- Recomendaciones específicas

#### **Tradicional**
- Puntuación detallada por cada factor
- Contribución de cada factor al score total
- Clasificación de riesgo asignada
- Áreas de mejora identificadas
- Advertencias sobre ratios altos

#### **Tabla de Factores Detallados**
Para el método tradicional, muestra:
- Valor ingresado del cliente
- Puntuación obtenida (0-100)
- Peso del factor (%)
- Contribución al score total

---

## 🏗️ Arquitectura del Sistema

### Componentes Frontend

```
frontend/src/
├── components/
│   ├── ClienteForm.jsx           # Formulario de captura de datos
│   ├── RiskCharts.jsx             # Gráficos de casos similares
│   ├── ComparativaMetodos.jsx     # Comparativa IA vs Tradicional
│   ├── DecisionAnalista.jsx       # Panel de decisión final
│   ├── ConfigPanel.jsx            # Configuración scorecard
│   └── AuditPanel.jsx             # Auditoría y reportes
├── utils/
│   ├── ragEngine.js               # Motor IA (RAG con Gemini)
│   ├── traditionalEngine.js       # Motor Scorecard
│   └── auditSystem.js             # Sistema de auditoría
├── App.jsx                        # Componente principal
└── index.css                      # Estilos globales
```

### Flujo de Datos

```
1. Usuario ingresa datos del cliente
   ↓
2. Sistema ejecuta evaluaciones en paralelo
   ├─→ IA: Busca similares → Genera decisión
   └─→ Tradicional: Calcula score → Asigna banda
   ↓
3. Genera comparativa automática
   ↓
4. Registra en auditoría (estado: pendiente)
   ↓
5. Analista revisa y toma decisión
   ↓
6. Sistema actualiza registro con decisión final
   ↓
7. Datos disponibles para reportes
```

---

## 🚀 Cómo Usar el Sistema

### Configuración Inicial

1. **Ingresar API Key de Gemini**
   - Obtener clave en: https://makersuite.google.com/app/apikey
   - Pegar en el campo "API Key"
   - Click en "Activar"

2. **Cargar Base de Conocimiento**
   - Preparar archivo Excel (.xlsx) con columnas:
     - Edad
     - Ingresos Mensuales
     - Deuda Total
     - Historial Crediticio (Bueno/Regular/Malo)
     - Empleo Estable (Sí/No)
     - Monto Solicitado
     - Plazo (meses)
     - Resultado (Aprobado/Rechazado)
   - Click en "Elegir archivo"
   - Esperar indexación (genera embeddings)

3. **Configurar Scorecard (Opcional)**
   - Expandir "Configuración del Método Tradicional"
   - Ajustar pesos de factores
   - Modificar bandas de tasas según políticas
   - Guardar configuración

### Evaluación de un Cliente

1. **Completar Formulario**
   - Edad
   - Ingresos Mensuales (S/.)
   - Deuda Total (S/.)
   - Historial Crediticio (selector)
   - Empleo Estable (selector)
   - Monto Solicitado (S/.)
   - Plazo (meses)

2. **Ejecutar Evaluación**
   - Click en "Evaluar Riesgo"
   - El sistema procesa ambos métodos simultáneamente
   - Muestra resultados en ~3-5 segundos

3. **Revisar Resultados**
   - **Panel Izquierdo**: Evaluación IA
   - **Panel Derecho**: Evaluación Tradicional
   - **Comparativa**: Diferencias y concordancia
   - **Gráficos**: Visualizaciones de datos

4. **Tomar Decisión Final**
   - Revisar ambas evaluaciones
   - Seleccionar método preferido o ajustar
   - Ingresar justificación detallada
   - Guardar decisión

5. **Resultado**
   - Confirmación de registro
   - Evaluación guardada en auditoría
   - Lista para siguiente caso

### Consultar Auditoría

1. **Expandir Panel de Auditoría**
   - Click en "Auditoría y Reportes"

2. **Ver Estadísticas**
   - Total de evaluaciones
   - Tasa de aprobación
   - Concordancia entre métodos
   - Tiempos promedio

3. **Filtrar Registros**
   - Por estado
   - Por método utilizado
   - Por rango de fechas

4. **Exportar Datos**
   - **CSV**: Para análisis en Excel/Power BI
   - **JSON**: Para integración con otros sistemas

### Exportación de Reportes

#### Reporte CSV
```
ID, Fecha, Usuario, Cliente_Edad, Cliente_Ingresos, ...
LOG-xxx, 2025-01-15 10:30, Analista, 35, 4500, ...
```

#### Reporte Estadísticas
```json
{
  "total": 150,
  "aprobados": 95,
  "rechazados": 50,
  "pendientes": 5,
  "tasaAprobacion": "63.3",
  "concordanciaIATradicional": "78.5",
  "avgTiempoIA": "3245",
  "avgTiempoTradicional": "125"
}
```

---

## 📊 Métricas y KPIs

### Indicadores de Rendimiento

1. **Tasa de Aprobación**: % de solicitudes aprobadas
2. **Concordancia IA-Tradicional**: % de coincidencia entre métodos
3. **Tiempo Promedio de Evaluación**: Velocidad de procesamiento
4. **Método Preferido**: % de uso de cada método
5. **Tasa de Ajustes**: % de decisiones personalizadas

### Análisis PRE-POST

Comparar métricas antes y después de implementar el sistema:

**ANTES (Solo Tradicional)**
- Tiempo de evaluación manual
- Tasa de reprocesos
- Consistencia riesgo-tasa

**POST (IA + Tradicional)**
- Reducción de tiempo
- Mejora en consistencia
- Mayor explicabilidad
- Trazabilidad completa

---

## 🔧 Configuración Técnica

### Requisitos del Sistema

- Node.js 16+
- NPM o Yarn
- Navegador moderno (Chrome, Firefox, Edge)
- Conexión a internet (para API de Gemini)

### Variables de Entorno

Crear archivo `.env.local` en `/frontend`:

```env
VITE_GEMINI_API_KEY=tu_clave_aqui
```

### Instalación

```bash
cd frontend
npm install
npm run dev
```

### Build para Producción

```bash
npm run build
```

Archivos generados en `/dist`

---

## 🔒 Seguridad y Privacidad

### Datos Sensibles

- API Key almacenada solo en memoria del navegador
- Datos de clientes NO se envían a servidores externos
- Procesamiento 100% client-side
- Auditoría en LocalStorage (limpiable)

### Recomendaciones

1. No compartir API Keys
2. Rotar claves periódicamente
3. Limpiar logs antiguos regularmente
4. Exportar datos importantes antes de limpiar

---

## 📈 Casos de Uso

### 1. Analista de Crédito Individual

**Escenario**: Evaluar solicitud de préstamo personal
- Ingresa datos del cliente
- Revisa ambas evaluaciones
- Compara con casos similares históricos
- Toma decisión informada
- Registra justificación

**Beneficio**: Decisión más objetiva con respaldo de IA

### 2. Supervisor de Crédito

**Escenario**: Revisar calidad de decisiones del equipo
- Accede a auditoría
- Filtra por analista/fecha
- Revisa concordancia IA-Tradicional
- Exporta reportes para análisis

**Beneficio**: Visibilidad completa de operaciones

### 3. Gerencia de Riesgo

**Escenario**: Ajustar políticas crediticias
- Analiza estadísticas históricas
- Identifica patrones de aprobación/rechazo
- Ajusta scorecard (pesos, umbrales, tasas)
- Mide impacto de cambios

**Beneficio**: Toma de decisiones basada en datos

### 4. Auditoría Interna

**Escenario**: Verificar cumplimiento de políticas
- Exporta CSV completo
- Verifica justificaciones
- Valida que tasas correspondan a scores
- Identifica anomalías

**Beneficio**: Trazabilidad completa

---

## 🎨 Interfaz de Usuario

### Paleta de Colores

- **Azul (#007bff)**: IA / Acciones principales
- **Gris (#6c757d)**: Método Tradicional
- **Verde (#28a745)**: Aprobado / Éxito
- **Rojo (#dc3545)**: Rechazado / Error
- **Amarillo (#ffc107)**: Advertencias / Pendiente

### Componentes Visuales

1. **Cards**: Contenedores de información
2. **Tablas**: Listados de datos
3. **Gráficos**: Recharts (Barras, Radar)
4. **Formularios**: Inputs validados
5. **Botones**: Acciones con feedback visual

---

## 🧪 Validaciones del Sistema

### Datos de Cliente

- Edad: > 18 años
- Ingresos: > 0
- Monto solicitado: > 0
- Plazo: valores predefinidos

### Configuración Scorecard

- Pesos deben sumar 100%
- Bandas no pueden solaparse
- Tasas deben ser positivas

### Decisión Analista

- Justificación obligatoria (min 20 caracteres)
- Método debe estar seleccionado
- Decisión debe ser Aprobado o Rechazado

---

## 📞 Soporte y Mantenimiento

### Problemas Comunes

**Error: "API Key no configurada"**
- Solución: Ingresar clave válida de Gemini

**Error: "Sube un archivo Excel primero"**
- Solución: Cargar base de conocimiento antes de evaluar

**Build Warning: Chunk size**
- Explicación: Tamaño normal para app con múltiples dependencias
- Acción: Opcional optimizar con code-splitting

### Limpieza de Datos

```javascript
// En consola del navegador:
localStorage.clear() // Borra todos los logs
```

---

## 🔄 Actualizaciones Futuras (Roadmap)

### Próximas Funcionalidades

1. **Multi-usuario**
   - Login/autenticación
   - Roles (analista, supervisor, admin)

2. **Backend Persistente**
   - Base de datos SQL/NoSQL
   - API REST

3. **Modelos Adicionales**
   - Soporte para OpenAI GPT-4
   - Modelos locales (Ollama)

4. **Analytics Avanzado**
   - Dashboards interactivos
   - Machine Learning para predicción

5. **Integración Externa**
   - Bureaus de crédito
   - Core bancario

---

## 📄 Licencia

Este sistema fue desarrollado para evaluación de riesgo crediticio institucional.

---

## 👥 Créditos

**Desarrollado por**: FYGRAD
**Versión**: 2.0
**Fecha**: Febrero 2025

---

## 📚 Referencias

- [Google Gemini AI](https://ai.google.dev/)
- [React Documentation](https://react.dev/)
- [Recharts](https://recharts.org/)
- [Vite](https://vitejs.dev/)

---

**¡Sistema listo para producción!** 🚀
