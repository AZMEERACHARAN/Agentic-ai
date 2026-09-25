/**
 * Deterministic helper functions to generate Investment Research Reports from prototype mock data.
 * Pure frontend implementation — no external APIs or LLMs used.
 */

import type { MockCountryData } from "@/data/mockCountryData";

export interface TradeAnalysisData {
  narrative: string;
  exports: string;
  imports: string;
  tradeBalance: string;
  topPartner: string;
}

export interface OpportunityItem {
  id: number;
  title: string;
  description: string;
}

export interface KeySectorItem {
  name: string;
  status: "positive" | "neutral" | "negative";
  description: string;
}

export interface MarketOutlookData {
  badge: "POSITIVE GROWTH ENVIRONMENT" | "BALANCED OUTLOOK" | "CAUTIOUS OUTLOOK";
  narrative: string;
}

/**
 * 8. EXECUTIVE SUMMARY
 */
export function generateExecutiveSummary(countryData: MockCountryData): string {
  const { name } = countryData.country;
  const { gdp, gdpGrowth, inflation, gdpPerCapita } = countryData.metrics;

  if (countryData.country.iso3 === "IND") {
    return "India maintains a large and rapidly expanding economy, supported by strong domestic demand, investment and a growing consumer market. GDP growth of 7.6% and manageable inflation of 2.4% highlight the current macroeconomic environment, while GDP per capita of $2,702 reflects significant long-term development potential.";
  }

  const expansionWord =
    gdpGrowth.value >= 4.0
      ? "rapidly expanding"
      : gdpGrowth.value >= 2.0
      ? "resilient and expanding"
      : "mature and stable";

  const incomeBracket =
    gdpPerCapita.value >= 45000
      ? "an advanced high-income economy with high consumer purchasing power"
      : gdpPerCapita.value >= 15000
      ? "a solid upper-middle income economic foundation"
      : "substantial long-term development potential and expanding consumption";

  return `${name} maintains a ${expansionWord} economy with an overall scale of ${gdp.displayValue}, supported by domestic institutional strength, industrial specialization, and cross-border commercial ties. Real GDP expansion of ${gdpGrowth.displayValue} alongside inflation at ${inflation.displayValue} defines the current operating environment, while GDP per capita of ${gdpPerCapita.displayValue} reflects ${incomeBracket}.`;
}

/**
 * 9. ECONOMIC STRENGTHS
 */
export function generateEconomicStrengths(
  countryData: MockCountryData
): Array<{ title: string; description: string }> {
  const { iso3 } = countryData.country;
  const { gdpGrowth, population } = countryData.metrics;
  const { innovationIndex } = countryData;

  if (iso3 === "IND") {
    return [
      {
        title: "Strong GDP growth",
        description: `GDP growth of ${gdpGrowth.displayValue} indicates strong current expansion.`,
      },
      {
        title: "Large domestic market",
        description: `Population of ${population.displayValue} provides substantial consumer-market scale.`,
      },
      {
        title: "Growing innovation capacity",
        description: `Innovation index of ${innovationIndex.score}/100 indicates improving technology and knowledge capacity.`,
      },
      {
        title: "Expanding services economy",
        description:
          "Services and digital industries provide important structural growth opportunities.",
      },
    ];
  }

  if (iso3 === "USA") {
    return [
      {
        title: "World's Largest Capital Market",
        description: "Unmatched depth and liquidity across venture capital, private equity, and public equities.",
      },
      {
        title: "Global Tech & AI Leadership",
        description: `High innovation score of ${innovationIndex.score}/100 driven by elite research universities and tech conglomerates.`,
      },
      {
        title: "Resilient Consumer Demand",
        description: `High disposable income with GDP per capita of ${countryData.metrics.gdpPerCapita.displayValue} fueling sustained growth.`,
      },
      {
        title: "Energy Independence",
        description: "Leading producer of crude oil and natural gas providing structural supply resilience.",
      },
    ];
  }

  if (iso3 === "CHN") {
    return [
      {
        title: "Global Manufacturing Hub",
        description: "Unrivaled industrial scale with comprehensive supply-chain clusters across all tiers.",
      },
      {
        title: "Vast Consumer Base",
        description: `Domestic market of ${population.displayValue} driving middle-class consumption across electric vehicles, retail, and tech.`,
      },
      {
        title: "High Technological Self-Reliance",
        description: `Innovation index score of ${innovationIndex.score}/100 powered by state-backed R&D in semiconductors, green energy, and 5G.`,
      },
      {
        title: "Infrastructure Superiority",
        description: "World-class high-speed rail, ultra-high voltage grids, and automated deep-water container ports.",
      },
    ];
  }

  if (iso3 === "DEU") {
    return [
      {
        title: "Premier Engineering & Capital Goods",
        description: "Global standard in precision machinery, automotive engineering, and industrial robotics.",
      },
      {
        title: "Mittelstand Ecosystem",
        description: "Uniquely resilient network of highly specialized, export-oriented mid-sized global market leaders.",
      },
      {
        title: "European Financial Anchor",
        description: "Strong fiscal discipline, robust sovereign credit profile, and central European logistics hub.",
      },
      {
        title: "Advanced Workforce Capabilities",
        description: "Vocational dual-education system producing world-renowned technical craftsmanship.",
      },
    ];
  }

  if (iso3 === "JPN") {
    return [
      {
        title: "Advanced Automation & Robotics",
        description: "Global pioneer in industrial precision, factory robotics, and high-efficiency material science.",
      },
      {
        title: "Immense Net Foreign Assets",
        description: "Consistently one of the world's largest net creditor nations with vast overseas investment earnings.",
      },
      {
        title: "Demographic Stability & High Life Expectancy",
        description: `World-leading life expectancy of ${countryData.metrics.lifeExpectancy.displayValue} with high institutional stability.`,
      },
      {
        title: "Top-Tier Innovation Infrastructure",
        description: `R&D intensity delivering ${innovationIndex.score}/100 innovation index across semiconductors, batteries, and automotive tech.`,
      },
    ];
  }

  // Fallback for other supported countries
  return [
    {
      title: "Strong Macroeconomic Fundamentals",
      description: `Real GDP expansion of ${gdpGrowth.displayValue} alongside disciplined monetary conditions.`,
    },
    {
      title: "Strategic Regional Integration",
      description: `Serves as a pivotal economic corridor within ${countryData.country.region}.`,
    },
    {
      title: "Substantial Knowledge & Innovation Scale",
      description: `Innovation index of ${innovationIndex.score}/100 supports sustainable industrial transformation.`,
    },
    {
      title: "Supportive Institutional Environment",
      description: "Sound regulatory protections and established investor security framework.",
    },
  ];
}

/**
 * 10. ECONOMIC RISKS
 */
export function generateEconomicRisks(
  countryData: MockCountryData
): Array<{ title: string; description: string }> {
  const { iso3 } = countryData.country;

  if (iso3 === "IND") {
    return [
      {
        title: "Global monetary conditions",
        description: "Changes in global interest rates can affect financing conditions.",
      },
      {
        title: "Currency and commodity volatility",
        description: "External price movements can influence trade and corporate earnings.",
      },
      {
        title: "Geopolitical and supply-chain risks",
        description: "Global trade realignment can affect external-sector conditions.",
      },
    ];
  }

  if (iso3 === "USA") {
    return [
      {
        title: "Elevated Sovereign Debt Levels",
        description: "Federal debt-to-GDP requires persistent monitoring alongside interest service costs.",
      },
      {
        title: "Monetary Policy Transmission Lag",
        description: "Persistent core services inflation could delay interest rate normalization.",
      },
      {
        title: "Geopolitical Friction & Tariffs",
        description: "Shifting global trade policies and tariff realignments can pressure import supply costs.",
      },
    ];
  }

  if (iso3 === "CHN") {
    return [
      {
        title: "Real Estate Sector Readjustment",
        description: "Protracted balance sheet restructuring among property developers affects local fiscal revenues.",
      },
      {
        title: "Demographic Transition",
        description: "Aging population dynamics gradually impacting long-term labor supply and dependency ratios.",
      },
      {
        title: "Tech Export Controls",
        description: "Western export restrictions on semiconductor lithography and specialized computing equipment.",
      },
    ];
  }

  if (iso3 === "DEU") {
    return [
      {
        title: "Industrial Energy Transition Costs",
        description: "Shifting away from legacy energy sources creates transitory input cost differentials.",
      },
      {
        title: "Sluggish Global Manufacturing Cycle",
        description: "High export exposure leaves performance dependent on cyclical external equipment demand.",
      },
      {
        title: "Bureaucratic & Regulatory Friction",
        description: "Complex permitting processes can moderate green transition infrastructure velocity.",
      },
    ];
  }

  // Fallback for other countries
  return [
    {
      title: "Global Monetary & FX Conditions",
      description: "Fluctuations in key reserve currencies impact external capital flows and borrowing costs.",
    },
    {
      title: "Commodity Price Shocks",
      description: "Volatility in international energy and raw material markets influences headline price indexes.",
    },
    {
      title: "Cross-Border Trade Protectionism",
      description: "Regional regulatory divergence and nontariff barriers present operational headwinds.",
    },
  ];
}

/**
 * 11. TRADE ANALYSIS
 */
export function generateTradeAnalysis(countryData: MockCountryData): TradeAnalysisData {
  const { iso3, name } = countryData.country;

  const tradeDatabase: Record<string, TradeAnalysisData> = {
    IND: {
      narrative:
        "India's external sector reflects its position as a major global trading economy, with services, manufactured goods, energy imports and diversified trade partnerships shaping its external position.",
      exports: "$437B",
      imports: "$677B",
      tradeBalance: "-$240B",
      topPartner: "United States",
    },
    USA: {
      narrative:
        "The United States is the world's preeminent consumer import market and second-largest exporter, driven by capital goods, aerospace, energy, and digital services.",
      exports: "$3.05T",
      imports: "$3.83T",
      tradeBalance: "-$780B",
      topPartner: "Canada & Mexico",
    },
    CHN: {
      narrative:
        "China operates as the world's primary merchandise trading nation, posting dominant trade surpluses anchored in electronics, solar cells, machinery, and electric vehicles.",
      exports: "$3.38T",
      imports: "$2.56T",
      tradeBalance: "+$820B",
      topPartner: "ASEAN & European Union",
    },
    DEU: {
      narrative:
        "Germany's external trade is heavily export-oriented, characterized by high-complexity capital equipment, chemicals, medical technology, and premium motor vehicles.",
      exports: "$1.68T",
      imports: "$1.46T",
      tradeBalance: "+$220B",
      topPartner: "United States & France",
    },
    JPN: {
      narrative:
        "Japan's trade dynamics feature significant manufactured exports balanced against structural net dependencies on imported hydrocarbons, food, and industrial ores.",
      exports: "$717B",
      imports: "$786B",
      tradeBalance: "-$69B",
      topPartner: "China & United States",
    },
    GBR: {
      narrative:
        "The UK operates as a specialized services export powerhouse, generating substantial net surpluses in financial, legal, and educational services against merchandise deficits.",
      exports: "$1.02T",
      imports: "$1.08T",
      tradeBalance: "-$60B",
      topPartner: "United States & Germany",
    },
    FRA: {
      narrative:
        "France's trade balances aerospace, luxury goods, pharmaceuticals, and agricultural exports against broad energy imports and electronic consumption.",
      exports: "$648B",
      imports: "$731B",
      tradeBalance: "-$83B",
      topPartner: "Germany & Italy",
    },
    BRA: {
      narrative:
        "Brazil is an agricultural and resource trade superpower, yielding major trade surpluses through exports of soybeans, iron ore, crude petroleum, and proteins.",
      exports: "$339B",
      imports: "$241B",
      tradeBalance: "+$98B",
      topPartner: "China & United States",
    },
    SGP: {
      narrative:
        "Singapore is an ultra-open global entrepôt and transshipment hub, with total gross merchandise trade exceeding three times its domestic GDP.",
      exports: "$476B",
      imports: "$423B",
      tradeBalance: "+$53B",
      topPartner: "China & Malaysia",
    },
    ARE: {
      narrative:
        "The UAE commands a strategic position as the primary re-export and logistics gateway between Asia, Europe, and Africa, accelerating non-oil commerce.",
      exports: "$488B",
      imports: "$390B",
      tradeBalance: "+$98B",
      topPartner: "India & China",
    },
  };

  return (
    tradeDatabase[iso3] ?? {
      narrative: `${name}'s external sector integrates steadily into regional value chains, with diversified export offerings and managed import reliance across key categories.`,
      exports: "$120B",
      imports: "$110B",
      tradeBalance: "+$10B",
      topPartner: "Regional Commercial Partners",
    }
  );
}

/**
 * 12. TOP OPPORTUNITIES
 */
export function generateOpportunities(countryData: MockCountryData): OpportunityItem[] {
  const { iso3 } = countryData.country;

  if (iso3 === "IND") {
    return [
      {
        id: 1,
        title: "IT Services & SaaS",
        description:
          "Strong digital adoption and economic expansion create opportunities in high-value technology and knowledge-intensive services.",
      },
      {
        id: 2,
        title: "Pharmaceuticals & Healthcare",
        description:
          "Large population scale and growing healthcare demand create opportunities across pharmaceuticals, medical technology and healthcare services.",
      },
      {
        id: 3,
        title: "Infrastructure & Construction",
        description:
          "Urbanization, industrial investment and infrastructure development create opportunities across construction and related industries.",
      },
    ];
  }

  if (iso3 === "USA") {
    return [
      {
        id: 1,
        title: "Artificial Intelligence & Semiconductors",
        description:
          "Unprecedented enterprise demand for LLM deployment, frontier data-center infrastructure, and specialized accelerator chips.",
      },
      {
        id: 2,
        title: "Clean Energy & Grid Modernization",
        description:
          "Massive federal incentives supporting utility-scale solar, advanced nuclear, battery storage, and carbon-capture projects.",
      },
      {
        id: 3,
        title: "Biotechnology & Precision Medicine",
        description:
          "Cutting-edge genomics, cell therapy breakthroughs, and deep venture investment driving life-science commercialization.",
      },
    ];
  }

  if (iso3 === "CHN") {
    return [
      {
        id: 1,
        title: "Electric Vehicles & Clean Mobility",
        description:
          "Dominant worldwide market share in battery chemistry, high-speed rail, and intelligent electric connected vehicles.",
      },
      {
        id: 2,
        title: "Advanced Industrial Automation",
        description:
          "Accelerating adoption of humanoid factory robotics, automated optical inspection, and digital supply-chain optimization.",
      },
      {
        id: 3,
        title: "Green Hydrogen & Energy Storage",
        description:
          "Immense state capital deployment toward utility-scale electrolyzers, solar silicon refining, and energy transition assets.",
      },
    ];
  }

  if (iso3 === "DEU") {
    return [
      {
        id: 1,
        title: "Automotive Software & E-Mobility",
        description:
          "Structural conversion of traditional automotive giants toward next-generation battery architectures and autonomous driving systems.",
      },
      {
        id: 2,
        title: "Green Hydrogen & Industrial Decarbonization",
        description:
          "Leading global equipment exports for industrial heat replacement, chemical recycling, and clean synthetic fuels.",
      },
      {
        id: 3,
        title: "Smart Factory Automation (Industry 4.0)",
        description:
          "High enterprise willingness to integrate AI predictive maintenance, IoT sensors, and high-efficiency tooling.",
      },
    ];
  }

  // Fallback for other countries
  return [
    {
      id: 1,
      title: "Digital Infrastructure & Cloud Services",
      description:
        "Rapid enterprise transition toward digital communications, cloud architecture, and fintech platforms.",
    },
    {
      id: 2,
      title: "Renewable Energy Development",
      description:
        "Favorable regulatory support for solar photovoltaic, wind power, and modern distributed grid storage.",
    },
    {
      id: 3,
      title: "Modern Logistics & Warehousing",
      description:
        "Growing domestic e-commerce volume and cross-border trade stimulating demand for temperature-controlled logistics hubs.",
    },
  ];
}

/**
 * 13. KEY SECTORS
 */
export function generateKeySectors(countryData: MockCountryData): KeySectorItem[] {
  const { iso3 } = countryData.country;

  if (iso3 === "IND") {
    return [
      {
        name: "IT Services & SaaS",
        status: "positive",
        description:
          "Structural demand and digital adoption support continued sector development.",
      },
      {
        name: "Pharmaceuticals & Generics",
        status: "positive",
        description:
          "Healthcare demand and manufacturing capabilities create expansion opportunities.",
      },
      {
        name: "Infrastructure & Construction",
        status: "neutral",
        description:
          "Long-term demand remains strong while policy and external conditions should be monitored.",
      },
      {
        name: "Energy & Utilities",
        status: "neutral",
        description:
          "Clean energy investments accelerate while fossil fuel dependency remains an operational factor.",
      },
    ];
  }

  if (iso3 === "USA") {
    return [
      {
        name: "Enterprise Software & Cloud Platforms",
        status: "positive",
        description: "Exceptional cash generation and secular margin expansion from generative AI integration.",
      },
      {
        name: "Healthcare & Pharmaceuticals",
        status: "positive",
        description: "Consistent defensive growth supported by aging demographics and next-gen oncology therapies.",
      },
      {
        name: "Commercial Real Estate",
        status: "negative",
        description: "Urban office asset values face refinancing pressures in an extended interest rate climate.",
      },
      {
        name: "Renewable Energy Equipment",
        status: "neutral",
        description: "Subsidies propel pipeline expansion despite interconnect and permitting bottlenecks.",
      },
    ];
  }

  if (iso3 === "CHN") {
    return [
      {
        name: "New Energy Vehicles (NEVs)",
        status: "positive",
        description: "Global price competitiveness and deep supply-chain integration drive record exports.",
      },
      {
        name: "Consumer Electronics & Hardware",
        status: "positive",
        description: "Steady global demand recovery in personal computing and smart connected peripherals.",
      },
      {
        name: "Residential Real Estate",
        status: "negative",
        description: "Ongoing structural adjustment and private developer liquidity constraints dampen activity.",
      },
      {
        name: "Heavy Industrial Petrochemicals",
        status: "neutral",
        description: "Substantial domestic manufacturing volumes balance against periodic global margin softening.",
      },
    ];
  }

  // Fallback for other countries
  return [
    {
      name: "Financial Services & Banking",
      status: "positive",
      description: "Robust net interest margins and prudent regulatory capitalization standards.",
    },
    {
      name: "High-Value Technology & Digital Services",
      status: "positive",
      description: "Rapidly expanding tech adoption across public administration and enterprise commerce.",
    },
    {
      name: "Commercial Construction & Real Estate",
      status: "neutral",
      description: "Balanced absorption rates amidst cautious commercial financing parameters.",
    },
  ];
}

/**
 * 14. GROWTH OUTLOOK
 */
export function generateGrowthOutlook(countryData: MockCountryData): string {
  const { iso3, name } = countryData.country;

  if (iso3 === "IND") {
    return "India's near-term path depends on sustaining strong GDP momentum while maintaining manageable inflation. Continued domestic investment, consumer demand and export activity could support further expansion, while external shocks remain an important uncertainty.";
  }

  if (iso3 === "USA") {
    return "The United States is projected to maintain moderate expansion as private consumer spending stabilizes and corporate capital expenditures in AI infrastructure accelerate. Balancing monetary easing against persistent service price inflation will determine the macro velocity over the next 12 to 18 months.";
  }

  if (iso3 === "CHN") {
    return "China's economic path over the coming 12–18 months centers on sustaining advanced manufacturing exports while targeted fiscal interventions stabilize domestic consumer confidence and real estate liquidity. High-tech industrial upgrades will serve as the primary growth catalyst.";
  }

  if (iso3 === "DEU") {
    return "Germany's trajectory relies on the recovery of international manufacturing demand, stabilization of energy input costs, and business investment in clean industrial transformation. Gradual monetary easing in the Eurozone is expected to provide incremental domestic relief.";
  }

  return `${name}'s 12–18 month outlook reflects steady macroeconomic equilibrium, guided by managed inflation, selective public investment, and adaptive trade relationships across regional markets.`;
}

/**
 * 15. OVERALL RECOMMENDATION / MARKET OUTLOOK
 */
export function generateMarketOutlook(countryData: MockCountryData): MarketOutlookData {
  const { score } = countryData.investmentSignal;

  if (score <= 25) {
    return {
      badge: "POSITIVE GROWTH ENVIRONMENT",
      narrative:
        "The prototype indicators show strong economic growth, manageable inflation and a large domestic market. Investors should evaluate these signals alongside country-specific risks and their own investment objectives.",
    };
  }

  if (score <= 50) {
    return {
      badge: "BALANCED OUTLOOK",
      narrative:
        "The prototype indicators reflect a balanced macroeconomic environment with solid foundational strengths offset by observable structural or external risks. A disciplined, sector-selective strategy is indicated.",
    };
  }

  return {
    badge: "CAUTIOUS OUTLOOK",
    narrative:
      "Prototype indicators highlight macroeconomic headwinds or structural transition dynamics. Market participants are advised to monitor credit conditions, policy developments, and volatility closely.",
  };
}
