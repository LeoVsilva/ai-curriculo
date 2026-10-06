import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

export type Experiencia = {
  cargo: string;
  empresa: string;
  inicioMes: string;
  inicioAno: string;
  fimMes: string;
  fimAno: string;
  atual: boolean;
  descricao: string;
};

export type NivelEscolaridade =
  | 'Ensino Fundamental Incompleto'
  | 'Ensino Fundamental Completo'
  | 'Ensino Médio Incompleto'
  | 'Ensino Médio Completo'
  | 'Ensino Superior Incompleto'
  | 'Ensino Superior Completo'
  | 'Pós-graduação'
  | 'Mestrado'
  | 'Doutorado';

export type Formacao = {
  nivel: NivelEscolaridade;
  curso: string;
  instituicao: string;
  inicioMes: string;
  inicioAno: string;
  fimMes: string;
  fimAno: string;
  atual: boolean;
};

export type Modelo =
  | 'classico'
  | 'moderno'
  | 'minimalista'
  | null;

export type CorCurriculo =
  | '#1565C0'
  | '#2E7D32'
  | '#6A1B9A'
  | '#C62828'
  | '#EF6C00'
  | '#212121';

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

type CurriculoContextData = {
  nome: string;
  email: string;
  telefone: string;

  primeiroEmprego: boolean | null;
  experiencias: Experiencia[];

  formacoes: Formacao[];

  sobreMim: string;
  cursos: string[];
  ferramentas: string[];

  modeloSelecionado: Modelo;

  corCurriculo: CorCurriculo;

  resultadoIA: ResultadoCurriculoIA | null;

  setDadosPessoais: (dados: {
    nome: string;
    email: string;
    telefone: string;
  }) => void;

  setPrimeiroEmprego: (
    primeiroEmprego: boolean
  ) => void;

  setExperiencias: (
    experiencias: Experiencia[]
  ) => void;

  setFormacoes: (
    formacoes: Formacao[]
  ) => void;

  setSobreMim: (
    sobreMim: string
  ) => void;

  setCursos: (
    cursos: string[]
  ) => void;

  setFerramentas: (
    ferramentas: string[]
  ) => void;

  setModeloSelecionado: (
    modelo: Modelo
  ) => void;

  setCorCurriculo: (
    cor: CorCurriculo
  ) => void;

  setResultadoIA: (
    resultado: ResultadoCurriculoIA | null
  ) => void;

  limparCurriculo: () => void;
};

const CurriculoContext =
  createContext<CurriculoContextData | undefined>(
    undefined
  );

export function CurriculoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const [primeiroEmprego, setPrimeiroEmprego] =
    useState<boolean | null>(null);

  const [experiencias, setExperiencias] =
    useState<Experiencia[]>([]);

  const [formacoes, setFormacoes] =
    useState<Formacao[]>([]);

  const [sobreMim, setSobreMim] =
    useState('');

  const [cursos, setCursos] =
    useState<string[]>([]);

  const [ferramentas, setFerramentas] =
    useState<string[]>([]);

  const [modeloSelecionado, setModeloSelecionado] =
    useState<Modelo>(null);

  const [corCurriculo, setCorCurriculo] =
    useState<CorCurriculo>('#1565C0');

  const [resultadoIA, setResultadoIA] =
    useState<ResultadoCurriculoIA | null>(null);

  function setDadosPessoais(dados: {
    nome: string;
    email: string;
    telefone: string;
  }) {
    setNome(dados.nome);
    setEmail(dados.email);
    setTelefone(dados.telefone);
  }

  function limparCurriculo() {
    setNome('');
    setEmail('');
    setTelefone('');

    setPrimeiroEmprego(null);

    setExperiencias([]);

    setFormacoes([]);

    setSobreMim('');

    setCursos([]);

    setFerramentas([]);

    setModeloSelecionado(null);

    setCorCurriculo('#1565C0');

    setResultadoIA(null);
  }

  return (
    <CurriculoContext.Provider
      value={{
        nome,
        email,
        telefone,

        primeiroEmprego,
        experiencias,

        formacoes,

        sobreMim,
        cursos,
        ferramentas,

        modeloSelecionado,

        corCurriculo,

        resultadoIA,

        setDadosPessoais,
        setPrimeiroEmprego,
        setExperiencias,
        setFormacoes,
        setSobreMim,
        setCursos,
        setFerramentas,
        setModeloSelecionado,
        setCorCurriculo,
        setResultadoIA,

        limparCurriculo,
      }}
    >
      {children}
    </CurriculoContext.Provider>
  );
}

export function useCurriculo() {
  const context = useContext(CurriculoContext);

  if (!context) {
    throw new Error(
      'useCurriculo deve ser usado dentro de CurriculoProvider'
    );
  }

  return context;
}