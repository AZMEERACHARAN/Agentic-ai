/**
 * Ecosphere Frontend — Mock Economic Intelligence Data
 *
 * Prototype dataset for frontend-only demonstration.
 * All data in this file is clearly marked as prototype/mock data.
 */

export interface MockCountryData {
  country: {
    name: string;
    iso2: string;
    iso3: string;
    region: string;
    capital: string;
    currency: string;
  };

  verification: {
    source: string;
    year: number;
    isMock: boolean;
  };

  investmentSignal: {
    score: number;
    label: string;
  };

  economicUpdate: {
    title: string;
    summary: string;
  };

  metrics: {
    population: {
      value: number;
      displayValue: string;
      unit: string;
    };

    gdp: {
      value: number;
      displayValue: string;
      unit: string;
    };

    gdpPerCapita: {
      value: number;
      displayValue: string;
      unit: string;
    };

    gdpGrowth: {
      value: number;
      displayValue: string;
      unit: string;
    };

    inflation: {
      value: number;
      displayValue: string;
      unit: string;
    };

    unemployment: {
      value: number;
      displayValue: string;
      unit: string;
    };

    lifeExpectancy: {
      value: number;
      displayValue: string;
      unit: string;
    };
  };

  riskScore: {
    score: number;
    label: string;
    description: string;
  };

  innovationIndex: {
    score: number;
    description: string;
  };

  whoShouldCare: Array<{
    category: string;
    icon: string;
    headline: string;
    description: string;
  }>;

  investmentIntelligence: Array<{
    status: "positive" | "negative" | "neutral";
    title: string;
    value: string;
    description: string;
  }>;
}

export const mockCountryData: Record<string, MockCountryData> = {
  IND: {
    country: {
      name: "India",
      iso2: "IN",
      iso3: "IND",
      region: "South Asia",
      capital: "New Delhi",
      currency: "INR",
    },
    verification: {
      source: "Prototype Economic Dataset",
      year: 2025,
      isMock: true,
    },
    investmentSignal: {
      score: 33,
      label: "Moderate Risk",
    },
    economicUpdate: {
      title: "ECONOMIC UPDATE: INDIA",
      summary:
        "India's economy continues to show strong expansion, supported by domestic demand, investment and a growing consumer market. GDP growth remains strong while inflation stays within a manageable range. Large population scale and rising income levels continue to shape India's long-term economic trajectory.",
    },
    metrics: {
      population: {
        value: 1464000000,
        displayValue: "1,464M",
        unit: "people",
      },
      gdp: {
        value: 3.96,
        displayValue: "$3.96T",
        unit: "USD",
      },
      gdpPerCapita: {
        value: 2702,
        displayValue: "$2,702",
        unit: "USD",
      },
      gdpGrowth: {
        value: 7.6,
        displayValue: "7.6%",
        unit: "%",
      },
      inflation: {
        value: 2.4,
        displayValue: "2.4%",
        unit: "%",
      },
      unemployment: {
        value: 4.2,
        displayValue: "4.2%",
        unit: "%",
      },
      lifeExpectancy: {
        value: 72.2,
        displayValue: "72.2 yrs",
        unit: "years",
      },
    },
    riskScore: {
      score: 33,
      label: "Moderate Risk",
      description:
        "Composite prototype indicator based on growth, inflation and labour-market conditions.",
    },
    innovationIndex: {
      score: 58,
      description:
        "Prototype composite indicator based on income level, economic scale and development indicators.",
    },
    whoShouldCare: [
      {
        category: "Institutional Investors",
        icon: "🏛️",
        headline: "Growth story, manage risk",
        description:
          "Large economic scale and strong growth create opportunities while macroeconomic risk should be monitored.",
      },
      {
        category: "Exporters & Trade Desks",
        icon: "🚢",
        headline: "Rising demand, expanding market",
        description:
          "Large population and economic expansion can support demand for consumer goods, technology and capital equipment.",
      },
      {
        category: "Founders & Startups",
        icon: "🚀",
        headline: "Large market, early innings",
        description:
          "Rapidly expanding digital adoption and a large consumer base create opportunities across technology and services.",
      },
      {
        category: "Consultants & Advisors",
        icon: "📊",
        headline: "High advisory demand",
        description:
          "Structural economic change creates demand for strategy, policy, technology and digital transformation services.",
      },
      {
        category: "Supply Chain Operators",
        icon: "🔗",
        headline: "Stable sourcing environment",
        description:
          "Growing domestic demand and industrial expansion create opportunities for diversified supply-chain operations.",
      },
    ],
    investmentIntelligence: [
      {
        status: "positive",
        title: "Strong GDP Growth",
        value: "+7.6%",
        description: "Above-average economic expansion",
      },
      {
        status: "positive",
        title: "Controlled Inflation",
        value: "2.4%",
        description: "Within a manageable range",
      },
      {
        status: "positive",
        title: "Strong Labour Market",
        value: "4.2% unemployment",
        description: "Labour-market conditions remain relatively supportive",
      },
      {
        status: "negative",
        title: "Lower Income Economy",
        value: "$2,702 GDP per capita",
        description: "Large market but relatively lower income per person",
      },
    ],
  },

  USA: {
    country: {
      name: "United States",
      iso2: "US",
      iso3: "USA",
      region: "North America",
      capital: "Washington, D.C.",
      currency: "USD",
    },
    verification: {
      source: "Prototype Economic Dataset",
      year: 2025,
      isMock: true,
    },
    investmentSignal: {
      score: 18,
      label: "Low Risk",
    },
    economicUpdate: {
      title: "ECONOMIC UPDATE: UNITED STATES",
      summary:
        "The United States remains one of the world's largest economies, supported by strong consumer demand, deep capital markets and high productivity. Technological innovation and capital depth continue to drive resilient long-term output despite shifting interest rate cycles.",
    },
    metrics: {
      population: {
        value: 336000000,
        displayValue: "336M",
        unit: "people",
      },
      gdp: {
        value: 28.78,
        displayValue: "$28.78T",
        unit: "USD",
      },
      gdpPerCapita: {
        value: 85650,
        displayValue: "$85,650",
        unit: "USD",
      },
      gdpGrowth: {
        value: 2.8,
        displayValue: "2.8%",
        unit: "%",
      },
      inflation: {
        value: 2.6,
        displayValue: "2.6%",
        unit: "%",
      },
      unemployment: {
        value: 4.1,
        displayValue: "4.1%",
        unit: "%",
      },
      lifeExpectancy: {
        value: 77.5,
        displayValue: "77.5 yrs",
        unit: "years",
      },
    },
    riskScore: {
      score: 18,
      label: "Low Risk",
      description:
        "High institutional stability, deep liquid debt markets and reserve currency dominance minimize sovereign credit risk.",
    },
    innovationIndex: {
      score: 94,
      description:
        "Global leader in software, artificial intelligence, venture funding, and advanced manufacturing ecosystems.",
    },
    whoShouldCare: [
      {
        category: "Institutional Investors",
        icon: "🏛️",
        headline: "Deep capital markets, defensive yield",
        description:
          "Unrivaled asset liquidity and high corporate earnings resilience across cycles.",
      },
      {
        category: "Exporters & Trade Desks",
        icon: "🚢",
        headline: "High-value consumption hub",
        description:
          "World's largest consumer market for premium industrial and technology imports.",
      },
      {
        category: "Founders & Startups",
        icon: "🚀",
        headline: "Premier venture capital hub",
        description:
          "Extensive early and late-stage capital availability with mature public exit pathways.",
      },
      {
        category: "Consultants & Advisors",
        icon: "📊",
        headline: "Enterprise AI & digital transformation",
        description:
          "Massive enterprise modernization spend across financial services and healthcare.",
      },
      {
        category: "Supply Chain Operators",
        icon: "🔗",
        headline: "Reshoring & domestic logistics expansion",
        description:
          "Accelerated federal incentives supporting semiconductor and cleantech manufacturing corridors.",
      },
    ],
    investmentIntelligence: [
      {
        status: "positive",
        title: "High Wealth per Capita",
        value: "$85,650 GDP per capita",
        description: "Exceptional purchasing power and domestic consumption capacity",
      },
      {
        status: "positive",
        title: "Leading Innovation Hub",
        value: "94/100 index",
        description: "Unparalleled tech ecosystem and research commercialization",
      },
      {
        status: "neutral",
        title: "Moderate Inflation Path",
        value: "2.6% CPI",
        description: "Approaching target central bank trajectory",
      },
      {
        status: "negative",
        title: "Elevated Sovereign Debt",
        value: ">120% of GDP",
        description: "Structural fiscal deficit requires continuous debt financing monitoring",
      },
    ],
  },

  CHN: {
    country: {
      name: "China",
      iso2: "CN",
      iso3: "CHN",
      region: "East Asia",
      capital: "Beijing",
      currency: "CNY",
    },
    verification: {
      source: "Prototype Economic Dataset",
      year: 2025,
      isMock: true,
    },
    investmentSignal: {
      score: 42,
      label: "Moderate Risk",
    },
    economicUpdate: {
      title: "ECONOMIC UPDATE: CHINA",
      summary:
        "China remains a major global manufacturing and trading economy, with growth increasingly shaped by domestic demand, technology and industrial investment. Industrial upgrading in cleantech and electric mobility provides momentum alongside property sector adjustments.",
    },
    metrics: {
      population: {
        value: 1409000000,
        displayValue: "1,409M",
        unit: "people",
      },
      gdp: {
        value: 18.53,
        displayValue: "$18.53T",
        unit: "USD",
      },
      gdpPerCapita: {
        value: 13150,
        displayValue: "$13,150",
        unit: "USD",
      },
      gdpGrowth: {
        value: 4.8,
        displayValue: "4.8%",
        unit: "%",
      },
      inflation: {
        value: 0.8,
        displayValue: "0.8%",
        unit: "%",
      },
      unemployment: {
        value: 5.1,
        displayValue: "5.1%",
        unit: "%",
      },
      lifeExpectancy: {
        value: 78.6,
        displayValue: "78.6 yrs",
        unit: "years",
      },
    },
    riskScore: {
      score: 42,
      label: "Moderate Risk",
      description:
        "Structural adjustments in real estate and local government debt balance against sovereign balance sheet strengths.",
    },
    innovationIndex: {
      score: 82,
      description:
        "World-scale deployment in renewable energy, batteries, high-speed rail, and advanced industrial automation.",
    },
    whoShouldCare: [
      {
        category: "Institutional Investors",
        icon: "🏛️",
        headline: "Scale advantages, sector rotation",
        description:
          "Targeted opportunities in green energy, automation, and advanced manufacturing value chains.",
      },
      {
        category: "Exporters & Trade Desks",
        icon: "🚢",
        headline: "Intermediate goods & commodities demand",
        description:
          "Immense demand for raw materials, industrial machinery, and agricultural commodities.",
      },
      {
        category: "Founders & Startups",
        icon: "🚀",
        headline: "High-speed supply chain iteration",
        description:
          "Rapid prototyping and rapid hardware production at global scale.",
      },
      {
        category: "Consultants & Advisors",
        icon: "📊",
        headline: "Industrial modernization and compliance",
        description:
          "Advisory demand for cross-border compliance, ESG standards, and tech transition.",
      },
      {
        category: "Supply Chain Operators",
        icon: "🔗",
        headline: "Comprehensive manufacturing infrastructure",
        description:
          "Dense supplier clusters with world-class port and logistics network integration.",
      },
    ],
    investmentIntelligence: [
      {
        status: "positive",
        title: "Clean Energy Dominance",
        value: ">50% global EV share",
        description: "Massive scale in battery, solar, and electric mobility manufacturing",
      },
      {
        status: "positive",
        title: "Low Price Pressures",
        value: "0.8% inflation",
        description: "Subdued consumer inflation leaves ample monetary policy leeway",
      },
      {
        status: "neutral",
        title: "GDP Growth Pace",
        value: "+4.8%",
        description: "Solid trajectory within state target ranges",
      },
      {
        status: "negative",
        title: "Demographic Transition",
        value: "Working-age contraction",
        description: "Long-term workforce shrinkage necessitates accelerated automation",
      },
    ],
  },

  DEU: {
    country: {
      name: "Germany",
      iso2: "DE",
      iso3: "DEU",
      region: "Europe",
      capital: "Berlin",
      currency: "EUR",
    },
    verification: {
      source: "Prototype Economic Dataset",
      year: 2025,
      isMock: true,
    },
    investmentSignal: {
      score: 24,
      label: "Low Risk",
    },
    economicUpdate: {
      title: "ECONOMIC UPDATE: GERMANY",
      summary:
        "Germany remains a major European industrial economy, with manufacturing and exports playing a central role. Energy transition investments, skilled technical labor and deep engineering networks support industrial transformation amid slower cyclical growth.",
    },
    metrics: {
      population: {
        value: 84400000,
        displayValue: "84.4M",
        unit: "people",
      },
      gdp: {
        value: 4.59,
        displayValue: "$4.59T",
        unit: "USD",
      },
      gdpPerCapita: {
        value: 54380,
        displayValue: "$54,380",
        unit: "USD",
      },
      gdpGrowth: {
        value: 0.9,
        displayValue: "0.9%",
        unit: "%",
      },
      inflation: {
        value: 2.2,
        displayValue: "2.2%",
        unit: "%",
      },
      unemployment: {
        value: 3.4,
        displayValue: "3.4%",
        unit: "%",
      },
      lifeExpectancy: {
        value: 81.2,
        displayValue: "81.2 yrs",
        unit: "years",
      },
    },
    riskScore: {
      score: 24,
      label: "Low Risk",
      description:
        "AAA sovereign credit rating and strong institutional stability offset sluggish near-term output growth.",
    },
    innovationIndex: {
      score: 87,
      description:
        "Benchmark precision engineering, automotive R&D, chemical patents, and industrial digitalization.",
    },
    whoShouldCare: [
      {
        category: "Institutional Investors",
        icon: "🏛️",
        headline: "Safe haven assets, industrial transformation",
        description:
          "Benchmark European sovereign debt security and green transition bonds.",
      },
      {
        category: "Exporters & Trade Desks",
        icon: "🚢",
        headline: "Specialized machinery & components",
        description:
          "Strong reciprocal trade across precision engineering and chemical intermediates.",
      },
      {
        category: "Founders & Startups",
        icon: "🚀",
        headline: "DeepTech and B2B SaaS hub",
        description:
          "High corporate customer willingness to pay for industrial software and sustainability tech.",
      },
      {
        category: "Consultants & Advisors",
        icon: "📊",
        headline: "Decarbonization & energy transformation",
        description:
          "Heavy manufacturing undergoing nationwide transition toward green hydrogen and renewables.",
      },
      {
        category: "Supply Chain Operators",
        icon: "🔗",
        headline: "Central European multimodal hub",
        description:
          "Dense rail, inland waterway, and Rhine corridor industrial supply integrations.",
      },
    ],
    investmentIntelligence: [
      {
        status: "positive",
        title: "Very Low Unemployment",
        value: "3.4% rate",
        description: "Extremely tight skilled technical and vocational labor market",
      },
      {
        status: "positive",
        title: "High Engineering Depth",
        value: "87/100 innovation",
        description: "Global standard in high-end machinery and specialized tools",
      },
      {
        status: "neutral",
        title: "Normalized Inflation",
        value: "2.2% CPI",
        description: "Energy cost spikes have stabilized back toward ECB target",
      },
      {
        status: "negative",
        title: "Subdued GDP Growth",
        value: "+0.9%",
        description: "Structural energy price adjustments constrain heavy manufacturing margin",
      },
    ],
  },

  JPN: {
    country: {
      name: "Japan",
      iso2: "JP",
      iso3: "JPN",
      region: "East Asia",
      capital: "Tokyo",
      currency: "JPY",
    },
    verification: {
      source: "Prototype Economic Dataset",
      year: 2025,
      isMock: true,
    },
    investmentSignal: {
      score: 22,
      label: "Low Risk",
    },
    economicUpdate: {
      title: "ECONOMIC UPDATE: JAPAN",
      summary:
        "Japan combines advanced industrial capacity with a highly developed service economy, while demographic trends remain an important structural consideration. Steady wage increases, corporate governance reforms and semiconductor investments are fostering renewed market dynamism.",
    },
    metrics: {
      population: {
        value: 123800000,
        displayValue: "123.8M",
        unit: "people",
      },
      gdp: {
        value: 4.21,
        displayValue: "$4.21T",
        unit: "USD",
      },
      gdpPerCapita: {
        value: 34050,
        displayValue: "$34,050",
        unit: "USD",
      },
      gdpGrowth: {
        value: 1.2,
        displayValue: "1.2%",
        unit: "%",
      },
      inflation: {
        value: 2.5,
        displayValue: "2.5%",
        unit: "%",
      },
      unemployment: {
        value: 2.5,
        displayValue: "2.5%",
        unit: "%",
      },
      lifeExpectancy: {
        value: 84.8,
        displayValue: "84.8 yrs",
        unit: "years",
      },
    },
    riskScore: {
      score: 22,
      label: "Low Risk",
      description:
        "Domestic debt ownership, huge net international investment position, and political consistency preserve sovereign stability.",
    },
    innovationIndex: {
      score: 89,
      description:
        "Frontier leadership in robotics, material sciences, optics, and semiconductor equipment.",
    },
    whoShouldCare: [
      {
        category: "Institutional Investors",
        icon: "🏛️",
        headline: "Corporate governance overhaul",
        description:
          "Tokyo Stock Exchange reforms boosting share buybacks, dividends and return on equity.",
      },
      {
        category: "Exporters & Trade Desks",
        icon: "🚢",
        headline: "High-technology component trade",
        description:
          "Critical supplier of specialized chemical wafers, industrial robots, and automotive parts.",
      },
      {
        category: "Founders & Startups",
        icon: "🚀",
        headline: "Silver economy & automation niche",
        description:
          "Pioneering market for healthcare robotics, eldercare tech, and workplace labor-saving solutions.",
      },
      {
        category: "Consultants & Advisors",
        icon: "📊",
        headline: "Digitalization & M&A advisory",
        description:
          "Widespread legacy enterprise IT migrations and cross-border overseas acquisitions.",
      },
      {
        category: "Supply Chain Operators",
        icon: "🔗",
        headline: "Ultra-high reliability logistics",
        description:
          "Global gold standard in just-in-time manufacturing reliability and cold-chain logistics.",
      },
    ],
    investmentIntelligence: [
      {
        status: "positive",
        title: "Full Employment",
        value: "2.5% unemployment",
        description: "Exceptional employment security across all age demographics",
      },
      {
        status: "positive",
        title: "World Highest Longevity",
        value: "84.8 yrs life exp.",
        description: "Superior public healthcare outcomes and high societal living standards",
      },
      {
        status: "positive",
        title: "Healthy Reflation",
        value: "2.5% inflation",
        description: "Sustainable exit from multidecade deflationary stagnation",
      },
      {
        status: "negative",
        title: "Ageing Demographics",
        value: "Median age 49.5",
        description: "Long-term domestic market volume contraction requires global export reliance",
      },
    ],
  },

  GBR: {
    country: {
      name: "United Kingdom",
      iso2: "GB",
      iso3: "GBR",
      region: "Europe",
      capital: "London",
      currency: "GBP",
    },
    verification: {
      source: "Prototype Economic Dataset",
      year: 2025,
      isMock: true,
    },
    investmentSignal: {
      score: 28,
      label: "Low-Moderate Risk",
    },
    economicUpdate: {
      title: "ECONOMIC UPDATE: UNITED KINGDOM",
      summary:
        "The United Kingdom's economy is anchored by a globally dominant financial services sector, advanced professional services, and aerospace engineering. Real wage growth and stabilizing inflation are supporting domestic consumption recovery.",
    },
    metrics: {
      population: {
        value: 68300000,
        displayValue: "68.3M",
        unit: "people",
      },
      gdp: {
        value: 3.68,
        displayValue: "$3.68T",
        unit: "USD",
      },
      gdpPerCapita: {
        value: 53880,
        displayValue: "$53,880",
        unit: "USD",
      },
      gdpGrowth: {
        value: 1.4,
        displayValue: "1.4%",
        unit: "%",
      },
      inflation: {
        value: 2.3,
        displayValue: "2.3%",
        unit: "%",
      },
      unemployment: {
        value: 4.3,
        displayValue: "4.3%",
        unit: "%",
      },
      lifeExpectancy: {
        value: 81.6,
        displayValue: "81.6 yrs",
        unit: "years",
      },
    },
    riskScore: {
      score: 28,
      label: "Low-Moderate Risk",
      description:
        "Strong legal institutions and financial liquidity balanced against post-trade friction adjustments and public debt.",
    },
    innovationIndex: {
      score: 88,
      description:
        "Global leadership in FinTech, artificial intelligence research, life sciences, and creative industries.",
    },
    whoShouldCare: [
      {
        category: "Institutional Investors",
        icon: "🏛️",
        headline: "City of London financial depth",
        description:
          "Global capital clearing powerhouse with premier private equity and green bond structuring venues.",
      },
      {
        category: "Exporters & Trade Desks",
        icon: "🚢",
        headline: "Services-led trading relationships",
        description:
          "High international demand for UK financial, legal, architectural, and educational exports.",
      },
      {
        category: "Founders & Startups",
        icon: "🚀",
        headline: "Europe's leading venture hub",
        description:
          "Generates more unicorn startups than any other European nation, backed by Oxford/Cambridge clusters.",
      },
      {
        category: "Consultants & Advisors",
        icon: "📊",
        headline: "Global regulatory & ESG strategy",
        description:
          "World-class management and legal consulting practices advising worldwide multinational clients.",
      },
      {
        category: "Supply Chain Operators",
        icon: "🔗",
        headline: "Port modernisation & logistics hubs",
        description:
          "Major expansion of East Coast and Thames estuary logistics developments.",
      },
    ],
    investmentIntelligence: [
      {
        status: "positive",
        title: "Financial Centre Dominance",
        value: "Top 2 global rank",
        description: "Concentration of international banking, insurance, and asset management",
      },
      {
        status: "positive",
        title: "Inflation Calibrated",
        value: "2.3% CPI",
        description: "Back near official Bank of England 2.0% medium-term target",
      },
      {
        status: "neutral",
        title: "Growth Trajectory",
        value: "+1.4% GDP",
        description: "Moderate recovery pace supported by real wage expansion",
      },
      {
        status: "negative",
        title: "Fiscal Pressure",
        value: "~100% debt/GDP",
        description: "Constrained government headroom for discretionary infrastructure expenditure",
      },
    ],
  },

  FRA: {
    country: {
      name: "France",
      iso2: "FR",
      iso3: "FRA",
      region: "Europe",
      capital: "Paris",
      currency: "EUR",
    },
    verification: {
      source: "Prototype Economic Dataset",
      year: 2025,
      isMock: true,
    },
    investmentSignal: {
      score: 30,
      label: "Moderate Risk",
    },
    economicUpdate: {
      title: "ECONOMIC UPDATE: FRANCE",
      summary:
        "France benefits from a diversified modern economy featuring aerospace, luxury goods, pharmaceuticals and agricultural leadership. The country's extensive low-carbon nuclear power grid provides domestic energy price stability amidst European transition.",
    },
    metrics: {
      population: {
        value: 68100000,
        displayValue: "68.1M",
        unit: "people",
      },
      gdp: {
        value: 3.18,
        displayValue: "$3.18T",
        unit: "USD",
      },
      gdpPerCapita: {
        value: 46700,
        displayValue: "$46,700",
        unit: "USD",
      },
      gdpGrowth: {
        value: 1.1,
        displayValue: "1.1%",
        unit: "%",
      },
      inflation: {
        value: 2.1,
        displayValue: "2.1%",
        unit: "%",
      },
      unemployment: {
        value: 7.4,
        displayValue: "7.4%",
        unit: "%",
      },
      lifeExpectancy: {
        value: 82.5,
        displayValue: "82.5 yrs",
        unit: "years",
      },
    },
    riskScore: {
      score: 30,
      label: "Moderate Risk",
      description:
        "Solid European core sovereign standing tempered by public fiscal deficits and labor reform friction.",
    },
    innovationIndex: {
      score: 83,
      description:
        "Global leaders in aerospace (Airbus), luxury brand management, nuclear fission, and AI foundation research.",
    },
    whoShouldCare: [
      {
        category: "Institutional Investors",
        icon: "🏛️",
        headline: "High sovereign asset liquidity",
        description:
          "Benchmark Eurozone government bonds with deep institutional secondary market trading volume.",
      },
      {
        category: "Exporters & Trade Desks",
        icon: "🚢",
        headline: "Luxury & agri-food powerhouse",
        description:
          "Unmatched brand equity in wine, cosmetics, luxury fashion and civil aviation systems.",
      },
      {
        category: "Founders & Startups",
        icon: "🚀",
        headline: "La French Tech momentum",
        description:
          "Strong government tax incentives (CIR) supporting AI startups and quantum computing.",
      },
      {
        category: "Consultants & Advisors",
        icon: "📊",
        headline: "Industrial reindustrialization programs",
        description:
          "France 2030 state investment program allocating €54 billion to future technologies.",
      },
      {
        category: "Supply Chain Operators",
        icon: "🔗",
        headline: "Clean energy industrial zones",
        description:
          "Nuclear baseload electricity provides European industrial sites with low carbon-border tax liability.",
      },
    ],
    investmentIntelligence: [
      {
        status: "positive",
        title: "Clean Nuclear Power",
        value: "~70% nuclear share",
        description: "Lowest carbon intensity electricity grid among major European economies",
      },
      {
        status: "positive",
        title: "Global Luxury Moat",
        value: "LVMH / Hermès / Kering",
        description: "Pricing power and high profit margins resilient across global downturns",
      },
      {
        status: "neutral",
        title: "Inflation Contained",
        value: "2.1% CPI",
        description: "Energy shield and stabilized food prices lower consumer basket volatility",
      },
      {
        status: "negative",
        title: "Structural Unemployment",
        value: "7.4% rate",
        description: "Elevated youth unemployment and higher payroll social contribution burdens",
      },
    ],
  },

  BRA: {
    country: {
      name: "Brazil",
      iso2: "BR",
      iso3: "BRA",
      region: "Latin America",
      capital: "Brasília",
      currency: "BRL",
    },
    verification: {
      source: "Prototype Economic Dataset",
      year: 2025,
      isMock: true,
    },
    investmentSignal: {
      score: 48,
      label: "Moderate Risk",
    },
    economicUpdate: {
      title: "ECONOMIC UPDATE: BRAZIL",
      summary:
        "Brazil is Latin America's largest economy, driven by world-leading agribusiness, deep offshore petroleum production and a vast domestic consumer base. Strong agricultural trade surpluses and active monetary oversight provide resilience.",
    },
    metrics: {
      population: {
        value: 216000000,
        displayValue: "216M",
        unit: "people",
      },
      gdp: {
        value: 2.27,
        displayValue: "$2.27T",
        unit: "USD",
      },
      gdpPerCapita: {
        value: 10510,
        displayValue: "$10,510",
        unit: "USD",
      },
      gdpGrowth: {
        value: 2.9,
        displayValue: "2.9%",
        unit: "%",
      },
      inflation: {
        value: 4.1,
        displayValue: "4.1%",
        unit: "%",
      },
      unemployment: {
        value: 6.8,
        displayValue: "6.8%",
        unit: "%",
      },
      lifeExpectancy: {
        value: 76.1,
        displayValue: "76.1 yrs",
        unit: "years",
      },
    },
    riskScore: {
      score: 48,
      label: "Moderate Risk",
      description:
        "High foreign exchange reserves and agricultural surplus counterbalance fiscal spending pressures.",
    },
    innovationIndex: {
      score: 52,
      description:
        "Pioneering digital payments (Pix network), biofuels tech, and advanced agricultural genomics.",
    },
    whoShouldCare: [
      {
        category: "Institutional Investors",
        icon: "🏛️",
        headline: "Attractive real interest rate yields",
        description:
          "High real domestic bond yields (Selic rate) attract global emerging market fixed income flows.",
      },
      {
        category: "Exporters & Trade Desks",
        icon: "🚢",
        headline: "Agricultural & energy export engine",
        description:
          "World's top exporter of soybeans, sugar, coffee, poultry, and expanding crude oil supplier.",
      },
      {
        category: "Founders & Startups",
        icon: "🚀",
        headline: "FinTech & AgriTech adoption",
        description:
          "Pix instant payment system processed over 40 billion transactions, sparking immense fintech scaling.",
      },
      {
        category: "Consultants & Advisors",
        icon: "📊",
        headline: "Tax reform & infrastructure concessions",
        description:
          "Historic indirect tax simplification (VAT) creating massive corporate restructuring work.",
      },
      {
        category: "Supply Chain Operators",
        icon: "🔗",
        headline: "Santos port & railway corridors",
        description:
          "Large concession pipeline upgrading railway logistics from central farm belt to coast.",
      },
    ],
    investmentIntelligence: [
      {
        status: "positive",
        title: "Agribusiness Trade Boom",
        value: ">$100B surplus",
        description: "Vital supplier to global food security across Asia and the Middle East",
      },
      {
        status: "positive",
        title: "Declining Unemployment",
        value: "6.8% rate",
        description: "Lowest national unemployment level in over a decade",
      },
      {
        status: "neutral",
        title: "GDP Expansion",
        value: "+2.9%",
        description: "Outperforming broader South American regional growth projections",
      },
      {
        status: "negative",
        title: "Higher Inflation Trend",
        value: "4.1% CPI",
        description: "Fiscal concerns keep benchmark central bank interest rates elevated",
      },
    ],
  },

  SGP: {
    country: {
      name: "Singapore",
      iso2: "SG",
      iso3: "SGP",
      region: "Southeast Asia",
      capital: "Singapore",
      currency: "SGD",
    },
    verification: {
      source: "Prototype Economic Dataset",
      year: 2025,
      isMock: true,
    },
    investmentSignal: {
      score: 12,
      label: "Very Low Risk",
    },
    economicUpdate: {
      title: "ECONOMIC UPDATE: SINGAPORE",
      summary:
        "Singapore serves as Asia's premier financial and trade gateway, characterized by free-market efficiency, low corruption, strategic port infrastructure and high digital innovation. Strong wealth management inflows reinforce sovereign reserves.",
    },
    metrics: {
      population: {
        value: 5900000,
        displayValue: "5.9M",
        unit: "people",
      },
      gdp: {
        value: 0.53,
        displayValue: "$530B",
        unit: "USD",
      },
      gdpPerCapita: {
        value: 89800,
        displayValue: "$89,800",
        unit: "USD",
      },
      gdpGrowth: {
        value: 3.2,
        displayValue: "3.2%",
        unit: "%",
      },
      inflation: {
        value: 2.1,
        displayValue: "2.1%",
        unit: "%",
      },
      unemployment: {
        value: 1.9,
        displayValue: "1.9%",
        unit: "%",
      },
      lifeExpectancy: {
        value: 84.1,
        displayValue: "84.1 yrs",
        unit: "years",
      },
    },
    riskScore: {
      score: 12,
      label: "Very Low Risk",
      description:
        "Triple-A sovereign credit profile, massive foreign reserves (GIC/Temasek), and zero external net sovereign debt.",
    },
    innovationIndex: {
      score: 92,
      description:
        "Benchmark smart city integration, biometric border clearance, biotech research, and digital banking frameworks.",
    },
    whoShouldCare: [
      {
        category: "Institutional Investors",
        icon: "🏛️",
        headline: "Asia wealth management capital",
        description:
          "Favored jurisdiction for multinational family offices, sovereign funds, and venture funds.",
      },
      {
        category: "Exporters & Trade Desks",
        icon: "🚢",
        headline: "World's busiest transshipment hub",
        description:
          "Crucial maritime choke point connecting Indian Ocean and Pacific trade lines with 39M+ TEU capacity.",
      },
      {
        category: "Founders & Startups",
        icon: "🚀",
        headline: "Regional headquarters domicile",
        description:
          "Clear regulatory sandbox, zero capital gains tax, and high IP protection standards.",
      },
      {
        category: "Consultants & Advisors",
        icon: "📊",
        headline: "Cross-border ASEAN strategy",
        description:
          "Serving as the springboard for expansion into Indonesia, Vietnam, and broader Southeast Asia.",
      },
      {
        category: "Supply Chain Operators",
        icon: "🔗",
        headline: "Next-gen Tuas Mega Port",
        description:
          "Fully automated logistics terminals handling ultra-large container vessels with automated guided vehicles.",
      },
    ],
    investmentIntelligence: [
      {
        status: "positive",
        title: "World Top GDP per Capita",
        value: "$89,800 per person",
        description: "One of the highest national income levels globally with strong purchasing capacity",
      },
      {
        status: "positive",
        title: "Virtually Zero Unemployment",
        value: "1.9% rate",
        description: "Full domestic employment with steady high-skilled foreign talent inflow",
      },
      {
        status: "positive",
        title: "Pristine Sovereign Credit",
        value: "AAA rating",
        description: "Unmatched fiscal prudence backed by sovereign wealth assets",
      },
      {
        status: "neutral",
        title: "Global Trade Sensitivity",
        value: "Trade/GDP >300%",
        description: "High exposure to global trade volume swings requires open sea-lane stability",
      },
    ],
  },

  ARE: {
    country: {
      name: "United Arab Emirates",
      iso2: "AE",
      iso3: "ARE",
      region: "Middle East",
      capital: "Abu Dhabi",
      currency: "AED",
    },
    verification: {
      source: "Prototype Economic Dataset",
      year: 2025,
      isMock: true,
    },
    investmentSignal: {
      score: 16,
      label: "Low Risk",
    },
    economicUpdate: {
      title: "ECONOMIC UPDATE: UNITED ARAB EMIRATES",
      summary:
        "The United Arab Emirates is rapidly executing its post-oil economic transformation, expanding trade logistics, international tourism, artificial intelligence and clean energy. Strategic capital allocation from sovereign funds is fueling foreign investment inflows.",
    },
    metrics: {
      population: {
        value: 10400000,
        displayValue: "10.4M",
        unit: "people",
      },
      gdp: {
        value: 0.54,
        displayValue: "$540B",
        unit: "USD",
      },
      gdpPerCapita: {
        value: 51920,
        displayValue: "$51,920",
        unit: "USD",
      },
      gdpGrowth: {
        value: 4.1,
        displayValue: "4.1%",
        unit: "%",
      },
      inflation: {
        value: 2.0,
        displayValue: "2.0%",
        unit: "%",
      },
      unemployment: {
        value: 2.7,
        displayValue: "2.7%",
        unit: "%",
      },
      lifeExpectancy: {
        value: 79.4,
        displayValue: "79.4 yrs",
        unit: "years",
      },
    },
    riskScore: {
      score: 16,
      label: "Low Risk",
      description:
        "Vast sovereign asset cushions (ADIA, Mubadala), stable currency peg to the USD, and high business confidence.",
    },
    innovationIndex: {
      score: 84,
      description:
        "State-backed AI research (Falcon LLM), autonomous transport testing, and high digital government efficiency.",
    },
    whoShouldCare: [
      {
        category: "Institutional Investors",
        icon: "🏛️",
        headline: "Global capital crossroad",
        description:
          "ADGM and DIFC financial free zones hosting major hedge funds, private equity, and wealth managers.",
      },
      {
        category: "Exporters & Trade Desks",
        icon: "🚢",
        headline: "Re-export gateway to Middle East & Africa",
        description:
          "Jebel Ali Port connects 180+ shipping routes, serving as re-export hub for 2+ billion people.",
      },
      {
        category: "Founders & Startups",
        icon: "🚀",
        headline: "Golden Visa & zero income tax",
        description:
          "Generous 10-year residency pathways and attractive tax frameworks for tech entrepreneurs.",
      },
      {
        category: "Consultants & Advisors",
        icon: "📊",
        headline: "Mega-project implementation",
        description:
          "Massive advisory work across green hydrogen, smart city expansions, and corporate structuring.",
      },
      {
        category: "Supply Chain Operators",
        icon: "🔗",
        headline: "Air & sea multimodal dominance",
        description:
          "Integration of Emirates SkyCargo, Etihad, and DP World creates rapid sea-to-air transshipment speed.",
      },
    ],
    investmentIntelligence: [
      {
        status: "positive",
        title: "Non-Oil Growth Momentum",
        value: "+6.0% non-oil GDP",
        description: "Successful revenue diversification across trade, tourism, and real estate",
      },
      {
        status: "positive",
        title: "High FDI Attraction",
        value: "$30B+ inflows",
        description: "Ranked among top global destinations for greenfield foreign direct investment",
      },
      {
        status: "positive",
        title: "Subdued Inflation",
        value: "2.0% CPI",
        description: "Controlled consumer price pressures through strategic subsidies and open supply",
      },
      {
        status: "neutral",
        title: "Hydrocarbon Dependency",
        value: "Oil quota linked",
        description: "State revenues still partially correlated with OPEC+ petroleum production targets",
      },
    ],
  },
};

/**
 * Access helper for mock country data.
 * Returns MockCountryData if available, or null for unsupported countries.
 */
export function getMockCountryData(iso3: string): MockCountryData | null {
  if (!iso3) return null;
  return mockCountryData[iso3.trim().toUpperCase()] ?? null;
}
