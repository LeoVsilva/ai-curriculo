import type {
  Experiencia,
  Formacao,
  Modelo,
} from '@/context/CurriculoContext';

export type DadosCurriculoIA = {
  nome: string;
  email: string;
  telefone: string;

  experiencias: Experiencia[];

  formacoes: Formacao[];

  sobreMim: string;

  cursos: string[];

  ferramentas: string[];

  modeloSelecionado: Modelo | null;
};

export type ResultadoCurriculoIA = {
  sobreMim: string;

  experiencias: Array<{
    cargo: string;
    empresa: string;
    inicioMes: string;
    inicioAno: string;
    fimMes: string;
    fimAno: string;
    atual: boolean;
    descricao: string;
  }>;

  habilidadesSugeridas: string[];

  ferramentasSugeridas: string[];
};

const API_URL = 'http://192.168.1.16:3000';

function prepararDadosParaIA(
  dados: DadosCurriculoIA
) {
  return {
    nome: dados.nome,

    email: dados.email,

    telefone: dados.telefone,

    experiencias: dados.experiencias,

    formacoes: dados.formacoes,

    sobreMim: dados.sobreMim,

    cursos: dados.cursos,

    ferramentas: dados.ferramentas,

    modeloSelecionado:
      dados.modeloSelecionado,
  };
}

export async function analisarCurriculoComIA(
  dados: DadosCurriculoIA
): Promise<ResultadoCurriculoIA> {
  const dadosPreparados =
    prepararDadosParaIA(dados);

  console.log(
    '\n=============================='
  );

  console.log(
    'ENVIANDO CURRÍCULO PARA A IA'
  );

  console.log(
    '=============================='
  );

  console.log(
    JSON.stringify(
      dadosPreparados,
      null,
      2
    )
  );

  try {
    const response = await fetch(
      `${API_URL}/api/analisar-curriculo`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify(
          dadosPreparados
        ),
      }
    );

    const resultado =
      await response.json();

    if (!response.ok) {
      throw new Error(
        resultado?.detalhe ||
          resultado?.erro ||
          'Erro ao analisar currículo.'
      );
    }

    console.log(
      '\n=============================='
    );

    console.log(
      'RESPOSTA RECEBIDA DA IA'
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

    return resultado;
  } catch (error) {
    console.error(
      '\n=============================='
    );

    console.error(
      'ERRO AO CONECTAR COM A IA'
    );

    console.error(
      '=============================='
    );

    console.error(error);

    throw error;
  }
}