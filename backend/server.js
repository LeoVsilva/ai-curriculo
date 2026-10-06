require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();

const PORT = 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(cors());
app.use(express.json());

console.log(
  'API key carregada:',
  process.env.GEMINI_API_KEY ? 'SIM' : 'NÃO'
);

/**
 * Schema da resposta que esperamos receber da IA.
 */
const responseSchema = {
  type: 'object',

  properties: {
    sobreMim: {
      type: 'string',
    },

    experiencias: {
      type: 'array',

      items: {
        type: 'object',

        properties: {
          cargo: {
            type: 'string',
          },

          empresa: {
            type: 'string',
          },

          inicioMes: {
            type: 'string',
          },

          inicioAno: {
            type: 'string',
          },

          fimMes: {
            type: 'string',
          },

          fimAno: {
            type: 'string',
          },

          atual: {
            type: 'boolean',
          },

          descricao: {
            type: 'string',
          },
        },

        required: [
          'cargo',
          'empresa',
          'inicioMes',
          'inicioAno',
          'fimMes',
          'fimAno',
          'atual',
          'descricao',
        ],
      },
    },

    habilidadesSugeridas: {
  type: 'array',
  items: { type: 'string' },
},

ferramentasSugeridas: {
  type: 'array',
  items: { type: 'string' },
},

palavrasChave: {
      type: 'array',

      items: {
        type: 'string',
      },
    },
  },

  required: [
  'sobreMim',
  'experiencias',
  'habilidadesSugeridas',
  'ferramentasSugeridas',
  'palavrasChave',
],
};

/**
 * Função responsável por chamar o Gemini.
 *
 * Se o modelo estiver temporariamente indisponível
 * (erro 503), fazemos até 3 tentativas automáticas.
 */
async function gerarRespostaGemini(prompt) {
  const maxTentativas = 3;

  for (
    let tentativa = 1;
    tentativa <= maxTentativas;
    tentativa++
  ) {
    try {
      console.log(
        `\nChamando Gemini... tentativa ${tentativa}/${maxTentativas}`
      );

      const response =
        await ai.models.generateContent({
          model: 'gemini-3.5-flash',

          contents: prompt,

          config: {
            responseMimeType: 'application/json',
            responseSchema,
          },
        });

      console.log('Gemini respondeu com sucesso.');

      return response;

    } catch (error) {
      const status =
        error?.status ||
        error?.error?.code;

      console.error(
        `Tentativa ${tentativa}/${maxTentativas} falhou.`
      );

      console.error(
        'Status:',
        status
      );

      console.error(
        'Mensagem:',
        error?.message
      );

      /**
       * Se não for erro 503, não adianta
       * continuar tentando.
       */
      if (
        status !== 503 ||
        tentativa === maxTentativas
      ) {
        throw error;
      }

      /**
       * Espera antes da próxima tentativa.
       *
       * Tentativa 1 → 2 segundos
       * Tentativa 2 → 4 segundos
       */
      const tempoEspera =
        tentativa * 2000;

      console.log(
        `Aguardando ${tempoEspera / 1000} segundos antes de tentar novamente...`
      );

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            tempoEspera
          )
      );
    }
  }
}

/**
 * Endpoint para análise e melhoria de currículo.
 */
app.post(
  '/api/analisar-curriculo',
  async (req, res) => {
    try {
      const dados = req.body;

      console.log(
        '\n=============================='
      );

      console.log(
        'NOVO CURRÍCULO RECEBIDO'
      );

      console.log(
        '=============================='
      );

      console.log(
        JSON.stringify(
          dados,
          null,
          2
        )
      );

      const prompt = `
Você é um especialista em recrutamento,
seleção e otimização de currículos profissionais.

Sua função é melhorar o currículo do candidato
com base EXCLUSIVAMENTE nas informações fornecidas.

REGRAS:

- Não invente experiências profissionais.
- Não invente empresas.
- Não invente cargos.
- Não invente cursos ou certificações.
- Não invente ferramentas ou tecnologias específicas.
- Não invente resultados, números ou métricas.
- Preserve todas as informações verdadeiras fornecidas.

- Você PODE realizar inferências profissionais razoáveis
  a partir das atividades descritas pelo candidato.

- Uma inferência é válida quando representa uma competência
  normalmente associada às atividades informadas.

Exemplo:
Se o candidato informa que realizava atendimento ao cliente
e resolvia problemas, você pode sugerir competências como
"Atendimento ao Cliente", "Suporte ao Cliente" e
"Resolução de Problemas".

- Você NÃO pode transformar uma inferência em uma experiência
  específica que o candidato não informou.

Exemplo:
Se o candidato informa atendimento ao cliente, NÃO conclua
que ele utilizava Salesforce, Zendesk ou ServiceNow.

- Você pode sugerir habilidades, ferramentas e conhecimentos
  derivados das atividades, experiências, formação, cursos
  e ferramentas já informadas.

- Para ferramentas e conhecimentos, preserve primeiro aquilo
  que o candidato informou.

- Você pode melhorar a forma como uma ferramenta ou conhecimento
  é apresentado quando isso for apenas uma melhoria de escrita.

- NÃO invente ferramentas, softwares, linguagens, plataformas,
  frameworks ou tecnologias específicas.

- Se o candidato informou "Excel", você pode manter "Microsoft Excel"
  ou "Excel" conforme fizer sentido.

- Se o candidato informou uma atividade que demonstra uma competência,
  você pode sugerir a competência em "habilidadesSugeridas",
  mas não transforme automaticamente essa competência em uma
  ferramenta ou tecnologia.

- A lista "ferramentasSugeridas" deve representar ferramentas e
  conhecimentos que possuem evidência nas informações fornecidas.
  
- Diferencie competências inferidas de ferramentas,
  tecnologias, certificações e experiências específicas.

- Não atribua ao candidato conhecimentos específicos de uma
  ferramenta ou tecnologia sem evidência nas informações.

- Melhore a escrita para deixá-la profissional, clara,
  objetiva e adequada para processos seletivos.

- Utilize verbos de ação quando fizer sentido.

- Evite exageros e afirmações que não possam ser sustentadas.

- Escreva em português do Brasil.

DADOS DO CANDIDATO:

${JSON.stringify(
  dados,
  null,
  2
)}

RETORNE SOMENTE o JSON solicitado pelo schema.

Não adicione explicações fora do JSON.
`;

      /**
       * Chama o Gemini através da função
       * que possui retry automático.
       */
      const response =
        await gerarRespostaGemini(
          prompt
        );

      /**
       * Converte a resposta JSON do Gemini
       * para um objeto JavaScript.
       */
      const resultado =
        JSON.parse(
          response.text
        );

      console.log(
        '\n=============================='
      );

      console.log(
        'RESPOSTA DO GEMINI'
      );

      console.log(
        '=============================='
      );

      console.log(
        JSON.stringify(
          resultado,
          null,
          2
        )
      );

      /**
       * Envia o resultado para o aplicativo.
       */
      res.json(resultado);

    } catch (error) {
      console.error(
        '\n=============================='
      );

      console.error(
        'ERRO AO ANALISAR CURRÍCULO'
      );

      console.error(
        '=============================='
      );

      console.error(
        'Mensagem:',
        error?.message
      );

      console.error(
        'Nome:',
        error?.name
      );

      console.error(
        'Status:',
        error?.status
      );

      console.error(
        'Stack:',
        error?.stack
      );

      console.error(
        'Erro completo:',
        JSON.stringify(
          error,
          null,
          2
        )
      );

      res.status(500).json({
        erro:
          'Não foi possível analisar o currículo.',

        detalhe:
          error?.message ||
          'Erro desconhecido',
      });
    }
  }
);

/**
 * Rota simples para verificar
 * se o backend está funcionando.
 */
app.get('/', (req, res) => {
  res.json({
    status: 'online',

    mensagem:
      'Backend do AI Currículo funcionando.',
  });
});

/**
 * Inicialização do servidor.
 */
app.listen(PORT, () => {
  console.log(
    `\nBackend rodando em http://localhost:${PORT}`
  );
});