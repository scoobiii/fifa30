import { PolicyIndicator, Ministry, SimulationScenario } from "./types";

export const INITIAL_INDICATORS: PolicyIndicator[] = [
  {
    id: "economy",
    name: "Crescimento Econômico Sustentável",
    weight: 20,
    score: 61,
    trend: "up",
    description: "Crescimento de longo prazo pautado em investimento, segurança jurídica e aumento de produtividade real, medido pela taxa anualizada e produtividade do trabalho.",
    metricName: "PIB per capita (PPP)",
    metricCurrent: "US$ 9.500",
    metricTarget: "US$ 130.000"
  },
  {
    id: "education",
    name: "Educação Básica e Técnica",
    weight: 15,
    score: 72,
    trend: "up",
    description: "Alfabetização na idade certa, melhoria no ranking do PISA, avanço do ensino técnico integrado e aplicação pedagógica de novas ferramentas de IA.",
    metricName: "Média Geral PISA",
    metricCurrent: "415",
    metricTarget: "520"
  },
  {
    id: "health",
    name: "Saúde Integrada",
    weight: 10,
    score: 68,
    trend: "stable",
    description: "Métricas de expectativa de vida ao nascer, redução da mortalidade infantil, cobertura vacinal completa e diminuição nos tempos de fila de atendimento complexo.",
    metricName: "Expectativa de Vida",
    metricCurrent: "76.2 anos",
    metricTarget: "83.5 anos"
  },
  {
    id: "security",
    name: "Segurança Pública",
    weight: 10,
    score: 41,
    trend: "down",
    description: "Redução drástica da taxa de crimes violentos intencionais, asfixia financeira do crime organizado e eficiência preventiva com base em análise preditiva.",
    metricName: "Homicídios / 100k hab",
    metricCurrent: "19.8",
    metricTarget: "4.5"
  },
  {
    id: "infrastructure",
    name: "Infraestrutura e Energia",
    weight: 10,
    score: 55,
    trend: "up",
    description: "Eficiência logística multimodal e ampliação massiva da capacidade elétrica nacional para impulsionar o desenvolvimento industrial em alta escala.",
    metricName: "Consumo de Energia per Capita",
    metricCurrent: "2.300 kWh",
    metricTarget: "20.000 kWh"
  },
  {
    id: "technology",
    name: "Ciência, Tecnologia e Inovação",
    weight: 10,
    score: 49,
    trend: "up",
    description: "Investimento em P&D, fomento a ecossistemas de startups, registro de patentes de alto valor tecnológico, design de semicondutores e computação quântica.",
    metricName: "Investimento P&D / PIB",
    metricCurrent: "1.2%",
    metricTarget: "3.5%"
  },
  {
    id: "state_efficiency",
    name: "Eficiência do Estado",
    weight: 7,
    score: 52,
    trend: "stable",
    description: "Digitalização de 100% dos serviços públicos, simplificação de abertura de empresas, avaliação meritocrática de desempenho público e combate à burocracia.",
    metricName: "Índice de Burocracia",
    metricCurrent: "64/100",
    metricTarget: "15/100"
  },
  {
    id: "fiscal",
    name: "Responsabilidade Fiscal",
    weight: 5,
    score: 65,
    trend: "down",
    description: "Controle firme da relação Dívida Pública/PIB, cumprimento do orçamento público estrutural sem artifícios de contabilidade criativa e solvência de longo prazo.",
    metricName: "Dívida Bruta / PIB",
    metricCurrent: "78.5%",
    metricTarget: "50.0%"
  },
  {
    id: "monetary",
    name: "Política Monetária e SELIC",
    weight: 6,
    score: 64,
    trend: "up",
    description: "Alinhamento de expectativas inflacionárias de longo prazo e redução estrutural do custo do capital por meio de uma taxa SELIC estável em um dígito.",
    metricName: "Taxa Básica SELIC",
    metricCurrent: "10.50%",
    metricTarget: "1 dígito (<9%)"
  },
  {
    id: "environment",
    name: "Meio Ambiente e Transição Verde",
    weight: 4,
    score: 70,
    trend: "up",
    description: "Descarbonização estrutural do PIB, metas de reflorestamento ativo, controle rígido do desmatamento ilegal e crescimento sustentado de energias renováveis.",
    metricName: "Emissões CO2 / US$ PIB",
    metricCurrent: "0.22 kg",
    metricTarget: "0.05 kg"
  },
  {
    id: "foreign_trade",
    name: "Relações Internacionais e Comércio",
    weight: 3,
    score: 58,
    trend: "stable",
    description: "Ampliação de acordos bilaterais de livre comércio, inserção ativa em cadeias globais de valor tecnológico e exportação de bens com alto valor agregado.",
    metricName: "Tarifa Média de Importação",
    metricCurrent: "11.5%",
    metricTarget: "4.0%"
  }
];

export const INITIAL_MINISTRIES: Ministry[] = [
  {
    id: "fazenda",
    name: "Ministério da Fazenda",
    ministerName: "Planejamento Macroeconômico",
    icon: "TrendingUp",
    description: "Responsável pela política fiscal sólida, reformas tributárias estruturantes e atração de investimento estrangeiro de longo prazo.",
    goals: [
      "Alcançar crescimento real do PIB de 4.5% ao ano por duas décadas de forma estável.",
      "Manter a dívida pública sob controle rigoroso, reduzindo-a para abaixo de 50% do PIB.",
      "Promover segurança jurídica e ambiente de negócios desburocratizado para investidores globais."
    ],
    kpis: [
      { name: "PIB per capita (PPP)", current: "US$ 9.500", target: "US$ 130.000", progress: 8 },
      { name: "Relação Dívida/PIB", current: "78.5%", target: "50.0%", progress: 62 },
      { name: "Crescimento Médio Anual", current: "1.8%", target: "5.0%", progress: 36 }
    ]
  },
  {
    id: "banco_central",
    name: "Banco Central do Brasil",
    ministerName: "Autoridade Monetária Independente",
    icon: "Landmark",
    description: "Assegurar a estabilidade do poder de compra da moeda e um sistema financeiro sólido e eficiente, com juros estruturais competitivos de um dígito.",
    goals: [
      "Ancorar firmemente as expectativas de inflação no centro da meta estipulada pelo CMN.",
      "Alcançar e consolidar uma taxa de juros básica SELIC sustentável de um dígito (< 9.00% a.a.).",
      "Reduzir o spread bancário e modernizar o ecossistema de pagamentos (Pix e Drex) para baratear o crédito."
    ],
    kpis: [
      { name: "Taxa SELIC Nominal", current: "10.50%", target: "Sub-9.00% (1 dígito)", progress: 78 },
      { name: "Desvio da Meta de Inflação", current: "+1.1%", target: "0.0%", progress: 85 },
      { name: "Spread Bancário Médio", current: "28.4%", target: "12.0%", progress: 38 }
    ]
  },
  {
    id: "educacao",
    name: "Ministério da Educação",
    ministerName: "Formação de Capital Humano",
    icon: "GraduationCap",
    description: "Foco integral no aumento da produtividade do trabalho através da educação básica de excelência, do ensino técnico e da fluência tecnológica.",
    goals: [
      "Alfabetização completa de todas as crianças até os 7 anos.",
      "Levar o país ao Top 20 no teste do PISA em leitura, ciência e matemática.",
      "Implementar ferramentas de Inteligência Artificial personalizadas em todas as escolas públicas."
    ],
    kpis: [
      { name: "PISA Geral (Média)", current: "415", target: "520", progress: 45 },
      { name: "Taxa de Escolaridade Média", current: "9.8 anos", target: "14.5 anos", progress: 67 },
      { name: "Ensino Técnico Concluído", current: "11%", target: "50%", progress: 22 }
    ]
  },
  {
    id: "saude",
    name: "Ministério da Saúde",
    ministerName: "Bem-estar e Longevidade Ativa",
    icon: "HeartPulse",
    description: "Foco na prevenção de patologias, redução de óbitos prematuros e eliminação da ineficiência administrativa na atenção básica.",
    goals: [
      "Elevar a expectativa de vida média ativa para além dos 80 anos.",
      "Zerar o gargalo de exames de média e alta complexidade usando prontuário único digital.",
      "Garantir cobertura vacinal de 98% para o calendário infantil básico."
    ],
    kpis: [
      { name: "Expectativa de Vida", current: "76.2 anos", target: "83.5 anos", progress: 64 },
      { name: "Mortalidade Infantil ( /1k)", current: "11.2", target: "3.1", progress: 42 },
      { name: "Tempo Médio Exames Especialistas", current: "120 dias", target: "14 dias", progress: 12 }
    ]
  },
  {
    id: "infraestrutura",
    name: "Ministério da Infraestrutura",
    ministerName: "Eixo de Competitividade e Matriz Energética",
    icon: "Zap",
    description: "Modernização logística multimodal e planejamento para triplicação da capacidade energética do país, impulsionando a produtividade per capita.",
    goals: [
      "Triplicar a geração limpa de energia para garantir o consumo per capita industrial de 20.000 kWh.",
      "Garantir 100% de cobertura de água tratada e tratamento de esgoto doméstico.",
      "Duplicar a malha ferroviária federal para transporte logístico otimizado de exportações."
    ],
    kpis: [
      { name: "Energia per Capita", current: "2.300 kWh", target: "20.000 kWh", progress: 11 },
      { name: "Saneamento Universal", current: "55.8%", target: "100.0%", progress: 55 },
      { name: "Custo Logístico (% PIB)", current: "12.8%", target: "7.0%", progress: 41 }
    ]
  },
  {
    id: "tecnologia",
    name: "Min. da Ciência e Tecnologia",
    ministerName: "Fronteira Tecnológica",
    icon: "Cpu",
    description: "Fomentar a transformação produtiva através da pesquisa e inovação aplicada a setores de alto valor agregado como IA e semicondutores.",
    goals: [
      "Multiplicar por três o investimento público e privado em inovação.",
      "Consolidar um polo nacional de fabricação de semicondutores e encapsulamento óptico.",
      "Criar leis e infraestrutura propícias para supercomputação nacional e patentes científicas."
    ],
    kpis: [
      { name: "Patentes Registradas (Anuais)", current: "240", target: "3.500", progress: 7 },
      { name: "Startups Unicórnios Ativos", current: "12", target: "150", progress: 8 },
      { name: "Investimento P&D (% PIB)", current: "1.2%", target: "3.5%", progress: 34 }
    ]
  },
  {
    id: "justica",
    name: "Ministério da Justiça",
    ministerName: "Garantia de Direitos e Ordem",
    icon: "ShieldAlert",
    description: "Garantir a integridade física do cidadão e a previsibilidade do ordenamento jurídico, asfixiando financeiramente as organizações criminosas.",
    goals: [
      "Reduzir homicídios ao patamar de países desenvolvidos (menos de 5 por 100 mil habitantes).",
      "Digitalizar e simplificar processos judiciais para reduzir em 60% o tempo de julgamento de contratos comerciais.",
      "Impedir lavagem de capitais do narcotráfico usando rastreamento financeiro algorítmico."
    ],
    kpis: [
      { name: "Homicídios por 100k hab", current: "19.8", target: "4.5", progress: 30 },
      { name: "Eficiência de Execuções de Contratos", current: "920 dias", target: "240 dias", progress: 18 },
      { name: "Índice de Segurança Percebida", current: "31/100", target: "85/100", progress: 28 }
    ]
  }
];

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: "status_quo",
    name: "Cenário Status Quo (Inércia)",
    description: "Mantém os investimentos e reformas na trajetória histórica de baixa produtividade e corporativismo estatal. Juros e inflação elevados com escassa oferta energética.",
    growthRate: 1.8,
    indicators: {
      economy: 61,
      education: 72,
      health: 68,
      security: 41,
      infrastructure: 45,
      technology: 49,
      state_efficiency: 52,
      fiscal: 65,
      monetary: 64,
      environment: 70,
      foreign_trade: 58
    },
    pib2045: "US$ 13.300"
  },
  {
    id: "choque_gestao",
    name: "Cenário Choque de Gestão (Reformista)",
    description: "Foco extremo na eficiência do Estado, atração de investimento privado, privatizações, abertura comercial e responsabilidade fiscal e monetária rígidas, derrubando a SELIC de forma consistente.",
    growthRate: 4.2,
    indicators: {
      economy: 82,
      education: 80,
      health: 75,
      security: 65,
      infrastructure: 85,
      technology: 65,
      state_efficiency: 88,
      fiscal: 90,
      monetary: 92,
      environment: 60,
      foreign_trade: 85
    },
    pib2045: "US$ 23.400"
  },
  {
    id: "fronteira_ia",
    name: "Cenário Fronteira Tecnológica & IA",
    description: "Transformação da educação e da economia nacional com foco em inovação aberta, inteligência artificial integrada, semicondutores e automação industrial sustentada por robusta oferta energética de 20k kWh.",
    growthRate: 6.8,
    indicators: {
      economy: 90,
      education: 95,
      health: 85,
      security: 70,
      infrastructure: 92,
      technology: 98,
      state_efficiency: 85,
      fiscal: 70,
      monetary: 80,
      environment: 80,
      foreign_trade: 75
    },
    pib2045: "US$ 38.600"
  },
  {
    id: "pacto_sustentavel",
    name: "Cenário Descarbonização e Economia Verde",
    description: "Indução de crescimento voltada para o mercado de crédito de carbono, atração de fundos verdes internacionais e transição integral para energia limpa e barata.",
    growthRate: 3.5,
    indicators: {
      economy: 70,
      education: 75,
      health: 82,
      security: 55,
      infrastructure: 78,
      technology: 75,
      state_efficiency: 68,
      fiscal: 75,
      monetary: 75,
      environment: 98,
      foreign_trade: 80
    },
    pib2045: "US$ 20.100"
  }
];

export const INITIAL_CANDIDATES = [
  { 
    id: "1", 
    name: "Lula", 
    party: "PT", 
    share: 41, 
    color: "rgba(239, 68, 68, 0.85)",
    governmentPlan: "Desenvolvimento inclusivo pautado na distribuição de renda via transferências sociais amplas, fortalecimento de bancos públicos para indução de investimentos, reindustrialização nacional verde orientada pelo Estado, parcerias comerciais internacionais multilaterais e concessões com foco socioambiental.",
    swot: {
      strengths: [
        "Forte apelo popular orgânico e grande capilaridade em classes vulneráveis.",
        "Facilidade na negociação de acordos e tratados multilaterais internacionais.",
        "Foco consolidado em políticas diretas de segurança alimentar e inclusão social."
      ],
      weaknesses: [
        "Ausência de detalhamento técnico de âncoras fiscais rígidas de longo prazo.",
        "Aumento da despesa corrente obrigatória que pressiona o equilíbrio do orçamento.",
        "Risco de ineficiência e excessivo intervencionismo estatal em setores produtivos."
      ],
      opportunities: [
        "Captação massiva de investimentos de fundos verdes mundiais para a Amazônia.",
        "Posicionamento do país como ator chave na transição ecológica e segurança climática."
      ],
      threats: [
        "Aceleração da inflação e aumento dos juros se o desequilíbrio fiscal persistir.",
        "Afastamento e desconfiança de capital privado industrial avesso a intervenções."
      ]
    },
    score: 2,
    whatIsMissing: "Para atingir a nota máxima (3/3), o plano necessita detalhar com clareza matemática as fontes de custeio estrutural para o equilíbrio da dívida pública (Meta Dívida/PIB de 50%), além de estabelecer metas explícitas de aumento real de produtividade por meio do PISA e incentivo direto a semicondutores e IA."
  },
  { 
    id: "2", 
    name: "Flávio Bolsonaro", 
    party: "PL", 
    share: 31, 
    color: "rgba(59, 130, 246, 0.85)",
    governmentPlan: "Programa de livre mercado com foco em desregulamentação, simplificação tributária, privatizações amplas de estatais e concessões de infraestrutura ao setor privado. Na segurança, foca em combate ostensivo severo e inteligência policial para asfixia de facções, associando-se ao agronegócio de ponta.",
    swot: {
      strengths: [
        "Sólida identificação e apoio irrestrito do próspero agronegócio de exportação.",
        "Pauta pragmática de redução de impostos corporativos e corte de burocracias.",
        "Discurso firme focado na segurança pública e proteção à propriedade privada."
      ],
      weaknesses: [
        "Falta de foco estruturado na transição ecológica profunda e economia verde.",
        "Pouco destaque para melhorias reais na qualidade do ensino público básico (PISA).",
        "Potencial tensão geopolítica em organismos globais que pode prejudicar exportações."
      ],
      opportunities: [
        "Aceleração rápida do desenvolvimento logístico via atração de capital privado.",
        "Modernização trabalhista e empresarial gerando dinamismo e novos empregos."
      ],
      threats: [
        "Perda de acesso ao mercado de capitais sustentáveis de menor custo (Green Bonds).",
        "Instabilidade na articulação com o Congresso Nacional devido à polarização severa."
      ]
    },
    score: 2,
    whatIsMissing: "Para atingir 3/3, precisa integrar metas ambiciosas para triplicação da capacidade limpa nacional de eletricidade (visando o consumo per capita de 20.000 kWh) e formular políticas públicas pedagógicas robustas voltadas às competências técnicas e alfabetização científica nacional."
  },
  { 
    id: "3", 
    name: "Ronaldo Caiado", 
    party: "PSD", 
    share: 3, 
    color: "rgba(16, 185, 129, 0.85)",
    governmentPlan: "Modelo centrado no binômio de Tolerância Zero ao crime e segurança jurídica total ao investidor. Propõe a nacionalização de políticas bem-sucedidas de controle territorial rígido, fomento contínuo ao complexo agroindustrial e parcerias ativas com governos estaduais.",
    swot: {
      strengths: [
        "Altíssima aprovação na área de segurança pública e ordem interna de seu reduto.",
        "Forte interlocução e respeito junto a lideranças industriais e agroprodutores.",
        "Estilo político maduro focado em entregas administrativas perceptíveis."
      ],
      weaknesses: [
        "Propostas de cunho extremamente focado em segurança, com menos destaque no digital.",
        "Imagem e capilaridade ainda em processo de nacionalização e fixação urbana."
      ],
      opportunities: [
        "Canalizar eleitores conservadores e liberais insatisfeitos com a polarização tradicional.",
        "Atuar como polo agregador de reformas federativas com devolução de tributos."
      ],
      threats: [
        "Esmagamento eleitoral pela força bipartidária dos dois principais candidatos.",
        "Dificuldade de adesão em grandes centros metropolitanos do Sudeste."
      ]
    },
    score: 2,
    whatIsMissing: "Falta detalhar um plano integrado de incentivo à ciência de fronteira, capacitação profissional para a economia da IA e metas monetárias coordenadas com o Banco Central para a queda sustentada do custo do dinheiro."
  },
  { 
    id: "4", 
    name: "Renan Santos", 
    party: "Missão", 
    share: 3, 
    color: "rgba(139, 92, 246, 0.85)",
    governmentPlan: "Foco integral em reforma geracional e combate à ineficiência burocrática por meio de tecnologia. Propõe digitalização completa e algorítmica do Estado, meritocracia rigorosa no funcionalismo e investimento na formação técnica massiva direcionada para as indústrias do futuro.",
    swot: {
      strengths: [
        "Proposta inovadora e foco explícito nas tecnologias de inteligência artificial.",
        "Grande apelo à renovação de quadros políticos e debate baseado em evidências.",
        "Estratégia avançada de comunicação com públicos jovens e conectados."
      ],
      weaknesses: [
        "Legenda recente de baixa inserção em bases parlamentares consolidadas.",
        "Falta de equipe com experiência comprovada na máquina pública executiva federal.",
        "Dificuldade de adesão entre eleitores de baixa renda sem acesso estável à internet."
      ],
      opportunities: [
        "Tornar-se o partido referência em economia criativa e do conhecimento no Brasil.",
        "Liderar a pauta de atração de capital de risco internacional para startups inovadoras."
      ],
      threats: [
        "Surgimento de barreiras eleitorais partidárias que asfixiem o partido nas urnas.",
        "Dificuldade crônica de governabilidade em um parlamento dominado pelo fisiologismo."
      ]
    },
    score: 1,
    whatIsMissing: "Para atingir 3/3, o plano precisa descer aos detalhes da macroeconomia pesada, estruturar a matriz de solvência da previdência e dívida pública, e propor soluções concretas de energia em grande escala para alimentar a futura indústria tecnológica sugerida."
  },
  { 
    id: "5", 
    name: "Romeu Zema", 
    party: "Novo", 
    share: 2, 
    color: "rgba(245, 158, 11, 0.85)",
    governmentPlan: "Austeridade fiscal incondicional, corte profundo em privilégios estatais, parcerias público-privadas em todos os níveis, desestatização de serviços públicos e modernização jurídica para atração agressiva de capital de risco para infraestrutura nacional de alto impacto.",
    swot: {
      strengths: [
        "Histórico de excelência comprovada na atração bilionária de investimentos privados.",
        "Saneamento fiscal severo de contas públicas herdadas em calamidade financeira.",
        "Coerência irretocável na defesa da livre concorrência e segurança jurídica empresarial."
      ],
      weaknesses: [
        "Pragmatismo que pode sofrer resistências severas na negociação política tradicional.",
        "Dificuldade de expressar propostas sociais complexas de forma emocional às massas."
      ],
      opportunities: [
        "Consolidação como o maior nome nacional da direita liberal reformista qualificada.",
        "Indução de uma reforma administrativa severa no Congresso a partir do exemplo prático."
      ],
      threats: [
        "Judicialização e paralisação legislativa causada pelo corporativismo público ferido.",
        "Potenciais tensões sociais diante de transições austeras sem redes de apoio ágeis."
      ]
    },
    score: 3,
    whatIsMissing: "Sendo o plano de maior rigor estatístico alinhado aos indicadores matemáticos de solvência fiscal, produtividade de mercado e metas de infraestrutura, o que falta para a perfeição absoluta e estabilidade de longo prazo é detalhar a amplitude da rede de proteção social (mortalidade infantil, saúde integrada) que impeça choques de transição excessivamente dolorosos para a população vulnerável."
  },
  { 
    id: "6", 
    name: "Aécio Neves", 
    party: "PSDB", 
    share: 2, 
    color: "rgba(14, 116, 144, 0.85)",
    governmentPlan: "Plataforma social-democrata clássica. Foco em estabilidade macroeconômica, reformas estruturais silenciosas via consenso no legislativo, expansão de redes sociais coordenadas com responsabilidade fiscal e incentivo à infraestrutura por modelos consolidados de concessões e PPPs.",
    swot: {
      strengths: [
        "Profundo conhecimento das engrenagens da política nacional e trânsito em Brasília.",
        "Forte capacidade de coordenação com quadros técnicos qualificados e moderados."
      ],
      weaknesses: [
        "Severo desgaste reputacional político histórico no imaginário popular brasileiro.",
        "Enfraquecimento da legenda tucana tradicional em relação à nova polarização radical."
      ],
      opportunities: [
        "Oferecer um refúgio político de conciliação para eleitores de centro moderado.",
        "Apoiar o destravamento de pautas prioritárias no parlamento através de sua bancada."
      ],
      threats: [
        "Desidratação eleitoral contínua até a perda completa de relevância nas urnas."
      ]
    },
    score: 2,
    whatIsMissing: "Para evoluir, necessita renovar radicalmente o discurso, agregando propostas modernas de inteligência artificial, semicondutores e metas objetivas de energia limpa (kWhe per capita)."
  },
  { 
    id: "7", 
    name: "Augusto Cury", 
    party: "Avante", 
    share: 2, 
    color: "rgba(217, 70, 239, 0.85)",
    governmentPlan: "Foco no desenvolvimento do potencial humano e saúde psicológica nacional. Propõe reformular a base nacional comum curricular das escolas para incluir competências socioemocionais preventivas e estruturar clínicas municipais integradas para combate à ansiedade e depressão pós-moderna.",
    swot: {
      strengths: [
        "Notoriedade indiscutível e alta aceitação pública transpartidária sobre saúde mental.",
        "Linguagem acolhedora, pacífica e distanciada do ódio polarizado."
      ],
      weaknesses: [
        "Falta total de formulação técnica e detalhada em política macroeconômica e cambial.",
        "Ausência de equipe e base técnica para gerir complexos ministérios produtivos."
      ],
      opportunities: [
        "Destacar a importância crônica da saúde mental nas escolas e no rendimento profissional do trabalhador."
      ],
      threats: [
        "Sendo um plano estritamente focado em um tema, deixaria o país vulnerável a crises de balanço de pagamentos ou colapso de infraestrutura."
      ]
    },
    score: 1,
    whatIsMissing: "Para atingir as notas superiores, precisa desenvolver integralmente todo o planejamento macroeconômico, as fontes tributárias estáveis de custeio, a governança do Banco Central e as metas logísticas energéticas nacionais."
  },
  { 
    id: "8", 
    name: "Samara Martins", 
    party: "UP", 
    share: 2, 
    color: "rgba(153, 27, 27, 0.85)",
    governmentPlan: "Foco na estatização completa de indústrias, bancos, planos de saúde e concessionárias sob controle democrático dos trabalhadores. Propõe auditoria de repúdio e calote da dívida pública, ampla reforma urbana de moradia e reforma agrária popular profunda sem indenizações a latifúndios.",
    swot: {
      strengths: [
        "Inabalável consistência com sua base de doutrina socialista clássica.",
        "Canalização direta de ressentimentos sociais reais e urgência de habitação periférica."
      ],
      weaknesses: [
        "Desconsideração completa de limites fiscais reais e da mecânica inflacionária.",
        "Total repúdio à atração de capital e fomento de mercado privado inovador."
      ],
      opportunities: [
        "Trazer visibilidade a problemas de extrema precariedade habitacional urbana."
      ],
      threats: [
        "Hiperinflação descontrolada, isolamento comercial geopolítico total e desabastecimento generalizado por quebra de incentivos produtivos."
      ]
    },
    score: 1,
    whatIsMissing: "Para ter viabilidade racional, o plano necessita aceitar os mecanismos científicos de finanças públicas, a necessidade de equilíbrio monetário estrutural e a importância do livre mercado como indutor principal do avanço produtivo."
  },
  { 
    id: "9", 
    name: "Cabo Daciolo", 
    party: "Mobiliza", 
    share: 1, 
    color: "rgba(30, 41, 59, 0.85)",
    governmentPlan: "Programa nacionalista de base religiosa. Propõe auditar de forma unilateral a dívida pública federal para destinar trilhões à construção de ferrovias nacionais de grande porte e investimento maciço na inteligência das Forças Armadas.",
    swot: {
      strengths: [
        "Carisma de massa ímpar, capaz de dialogar e encantar populações de menor escolaridade.",
        "Urgência em soluções de infraestrutura pesada (ferrovias) para o escoamento nacional."
      ],
      weaknesses: [
        "Propostas excessivamente simplistas fundadas em teorias místicas e sem rigor estatístico.",
        "Ausência de equipe ministerial técnica e institucional de sustentação econômica."
      ],
      opportunities: [
        "Ocupar e evidenciar o cansaço do eleitor de base com a inércia logística do país."
      ],
      threats: [
        "Default técnico da dívida gerando colapso bancário, corrida inflacionária e desvalorização da moeda."
      ]
    },
    score: 1,
    whatIsMissing: "Falta incorporar fundamentos científicos da economia, planejamento fiscal realista que impeça a insolvência e planos técnicos de atração de capital que não gerem desconfiança institucional grave."
  },
  { 
    id: "10", 
    name: "Joaquim Barbosa", 
    party: "DC", 
    share: 1, 
    color: "rgba(100, 116, 139, 0.85)",
    governmentPlan: "Defesa rígida do império da lei (Rule of Law). Propõe o uso intensivo de IA e cruzamento de dados para identificar fraudes fiscais e corrupção sistêmica, reforma ampla do sistema de justiça para garantir agilidade a disputas comerciais e segurança jurídica absoluta.",
    swot: {
      strengths: [
        "Histórico e renome inquestionáveis de combate à impunidade e corrupção no país.",
        "Defesa convicta de que o desenvolvimento se assenta sobre a estabilidade das instituições jurídica."
      ],
      weaknesses: [
        "Inexistência de propostas estruturadas para o setor energético e microeconômico produtivo.",
        "Pouca habilidade de agregação em composições de frentes partidárias amplas."
      ],
      opportunities: [
        "Atrair fundos de investimento institucionais de alta governança globais focados estritamente na lisura jurídica."
      ],
      threats: [
        "Paralisia de tomada de decisão executiva devido ao extremo foco na fiscalização e receio de desvios."
      ]
    },
    score: 2,
    whatIsMissing: "Para atingir 3/3, precisa complementar sua sólida visão institucional com planos quantificados para crescimento do PIB per capita, fomento à ciência e metas para a matriz elétrica nacional."
  },
  { 
    id: "11", 
    name: "Rui Costa Pimenta", 
    party: "PCO", 
    share: 1, 
    color: "rgba(185, 28, 28, 0.85)",
    governmentPlan: "Programa revolucionário e anticapitalista ortodoxo. Defende a dissolução completa das forças repressoras do Estado, armamento geral da população trabalhadora e estatização incondicional do comércio exterior e bancos sob monopólio estatal.",
    swot: {
      strengths: [
        "Perfeita coesão teórica com o marxismo tradicional do início do século XX."
      ],
      weaknesses: [
        "Incompatibilidade teórica e prática com o funcionamento moderno de cadeias de valor integradas.",
        "Desconsideração total pela liberdade de iniciativa, segurança de investimentos e metas de inovação real."
      ],
      opportunities: [
        "Atuar no debate público como termômetro de posições ideológicas intransigentes de protesto."
      ],
      threats: [
        "Completo colapso social, desindustrialização generalizada, desintegração econômica e fuga total do capital humano e financeiro nacional."
      ]
    },
    score: 1,
    whatIsMissing: "Falta de forma absoluta e integral a compreensão das conquistas de produtividade e bem-estar trazidas pelo livre mercado regulado, estabilidade cambial e investimento privado tecnológico."
  },
  { 
    id: "12", 
    name: "Outros / Brancos / Não Sabem", 
    party: "Nenhum", 
    share: 11, 
    color: "rgba(148, 163, 184, 0.5)",
    governmentPlan: "Consiste na fatia insatisfeita com o debate público vigente ou em dúvida. Demonstra cansaço de discursos vazios, polarização focada em insultos recíprocos e falta de detalhamento numérico e científico de metas de longo prazo.",
    swot: {
      strengths: [
        "Apresenta um alerta saudável ao ecossistema político sobre o cansaço do eleitor."
      ],
      weaknesses: [
        "Não contribui ativamente para a formulação direta de novas propostas de políticas públicas estruturadas."
      ],
      opportunities: [
        "Grande oportunidade para serem atraídos por propostas racionais baseadas em dados e métricas como o Framework deste portal."
      ],
      threats: [
        "Suscetibilidade a discursos populistas de última hora caso não haja esclarecimento educacional estatístico de qualidade."
      ]
    },
    score: 1,
    whatIsMissing: "O que falta a esses eleitores é conhecer este Framework de Decisão Racional, permitindo que passem a exigir metas científicas mensuráveis dos candidatos ao invés de torcidas dogmáticas e slogans!"
  }
];

