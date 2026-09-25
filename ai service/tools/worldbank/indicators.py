"""
Ecosphere AI Service — World Bank Indicator Configuration

Centralized registry of all World Bank indicator codes used by the Economic Data Agent.
All indicator codes must be changed here only — never scattered in agent/tool code.
"""

from typing import Final

# ──────────────────────────────────────────────────────────────────────────────
# Indicator Keys — canonical names used internally throughout the system
# ──────────────────────────────────────────────────────────────────────────────

INDICATOR_GDP = "gdp"
INDICATOR_GDP_GROWTH = "gdp_growth"
INDICATOR_GDP_PER_CAPITA = "gdp_per_capita"
INDICATOR_INFLATION = "inflation"
INDICATOR_UNEMPLOYMENT = "unemployment"
INDICATOR_POPULATION = "population"
INDICATOR_FDI = "fdi"

# ──────────────────────────────────────────────────────────────────────────────
# World Bank Indicator Codes
# Source: https://data.worldbank.org/indicator
# ──────────────────────────────────────────────────────────────────────────────

WORLD_BANK_CODES: Final[dict[str, str]] = {
    INDICATOR_GDP: "NY.GDP.MKTP.CD",           # GDP (current US$)
    INDICATOR_GDP_GROWTH: "NY.GDP.MKTP.KD.ZG", # GDP growth (annual %)
    INDICATOR_GDP_PER_CAPITA: "NY.GDP.PCAP.CD", # GDP per capita (current US$)
    INDICATOR_INFLATION: "FP.CPI.TOTL.ZG",      # Inflation, consumer prices (annual %)
    INDICATOR_UNEMPLOYMENT: "SL.UEM.TOTL.ZS",   # Unemployment, total (% of total labor force)
    INDICATOR_POPULATION: "SP.POP.TOTL",         # Population, total
    INDICATOR_FDI: "BX.KLT.DINV.CD.WD",         # Foreign direct investment, net inflows (BoP, current US$)
}

# ──────────────────────────────────────────────────────────────────────────────
# Human-readable metadata for each indicator
# ──────────────────────────────────────────────────────────────────────────────

INDICATOR_METADATA: Final[dict[str, dict[str, str]]] = {
    INDICATOR_GDP: {
        "label": "GDP",
        "unit": "current US$",
        "description": "Gross Domestic Product at current market prices",
    },
    INDICATOR_GDP_GROWTH: {
        "label": "GDP Growth",
        "unit": "% annual",
        "description": "Annual GDP growth rate",
    },
    INDICATOR_GDP_PER_CAPITA: {
        "label": "GDP per Capita",
        "unit": "current US$",
        "description": "GDP divided by midyear population",
    },
    INDICATOR_INFLATION: {
        "label": "Inflation",
        "unit": "% annual",
        "description": "Consumer price inflation (annual %)",
    },
    INDICATOR_UNEMPLOYMENT: {
        "label": "Unemployment",
        "unit": "%",
        "description": "Unemployment as % of total labor force (ILO modeled)",
    },
    INDICATOR_POPULATION: {
        "label": "Population",
        "unit": "persons",
        "description": "Total midyear population",
    },
    INDICATOR_FDI: {
        "label": "FDI Net Inflows",
        "unit": "current US$",
        "description": "Foreign direct investment net inflows (Balance of Payments)",
    },
}

# All indicator keys in order
ALL_INDICATORS: Final[list[str]] = list(WORLD_BANK_CODES.keys())
