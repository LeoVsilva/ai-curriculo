import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  useCurriculo,
} from '@/context/CurriculoContext';

import { analisarCurriculoComIA } from '@/services/aiCurriculo';

export default function RevisarScreen() {
  const {
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
    resultadoIA,
    setResultadoIA,
    setSobreMim,
  } = useCurriculo();

  const [analisandoIA, setAnalisandoIA] =
    useState(false);

  const [sobreMimIA, setSobreMimIA] =
    useState('');

  const [habilidadesEditadas, setHabilidadesEditadas] =
    useState<string[]>([]);

  const [ferramentasEditadas, setFerramentasEditadas] =
    useState<string[]>([]);

  const [novaHabilidade, setNovaHabilidade] =
    useState('');

  const [novaFerramenta, setNovaFerramenta] =
    useState('');

  /*
   * Quando o resultado da IA chegar,
   * carregamos as sugestões para os estados
   * editáveis da tela.
   */
  useEffect(() => {
    if (!resultadoIA) {
      return;
    }

    setSobreMimIA(resultadoIA.sobreMim);

    setHabilidadesEditadas(
      resultadoIA.habilidadesSugeridas
    );

    setFerramentasEditadas(
      resultadoIA.ferramentasSugeridas || ferramentas
    );
  }, [resultadoIA]);

  function voltar() {
    router.back();
  }

  function salvarAlteracoesIA() {
    if (resultadoIA) {
      setSobreMim(sobreMimIA);

      setResultadoIA({
        ...resultadoIA,
        sobreMim: sobreMimIA,
        habilidadesSugeridas:
          habilidadesEditadas,
        ferramentasSugeridas:
          ferramentasEditadas,
      });
    }
  }

  function continuar() {
    salvarAlteracoesIA();

    router.push('/modelo');
  }

  function editarDadosPessoais() {
    router.push('/criar-curriculo');
  }

  function editarExperiencia() {
    router.push('/experiencia');
  }

  function editarFormacao() {
    router.push('/formacao');
  }

  function editarSobre() {
    router.push('/habilidades');
  }

  function usarSugestaoIA() {
    if (!resultadoIA) {
      return;
    }

    setSobreMimIA(resultadoIA.sobreMim);
  }

  function removerHabilidade(
    habilidadeRemover: string
  ) {
    setHabilidadesEditadas(
      (habilidades) =>
        habilidades.filter(
          (habilidade) =>
            habilidade !== habilidadeRemover
        )
    );
  }

  function adicionarHabilidade() {
    const habilidade =
      novaHabilidade.trim();

    if (!habilidade) {
      return;
    }

    const jaExiste =
      habilidadesEditadas.some(
        (item) =>
          item.toLowerCase() ===
          habilidade.toLowerCase()
      );

    if (jaExiste) {
      Alert.alert(
        'Habilidade já adicionada',
        'Essa habilidade já está na lista.'
      );

      return;
    }

    setHabilidadesEditadas(
      (habilidades) => [
        ...habilidades,
        habilidade,
      ]
    );

    setNovaHabilidade('');
  }

  function removerFerramenta(
    ferramentaRemover: string
  ) {
    setFerramentasEditadas(
      (ferramentas) =>
        ferramentas.filter(
          (ferramenta) =>
            ferramenta !== ferramentaRemover
        )
    );
  }

  function adicionarFerramenta() {
    const ferramenta =
      novaFerramenta.trim();

    if (!ferramenta) {
      return;
    }

    const jaExiste =
      ferramentasEditadas.some(
        (item) =>
          item.toLowerCase() ===
          ferramenta.toLowerCase()
      );

    if (jaExiste) {
      Alert.alert(
        'Ferramenta já adicionada',
        'Essa ferramenta ou conhecimento já está na lista.'
      );

      return;
    }

    setFerramentasEditadas(
      (ferramentas) => [
        ...ferramentas,
        ferramenta,
      ]
    );

    setNovaFerramenta('');
  }

  async function melhorarComIA() {
    if (analisandoIA) {
      return;
    }

    try {
      setAnalisandoIA(true);

      const resultado =
        await analisarCurriculoComIA({
          nome,
          email,
          telefone,
          experiencias,
          formacoes,
          sobreMim,
          cursos,
          ferramentas,
          modeloSelecionado,
        });

      setResultadoIA(resultado);

      console.log(
        '\n=============================='
      );

      console.log(
        'RESULTADO RECEBIDO NO APLICATIVO'
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

      Alert.alert(
        '✨ Análise concluída',
        `A IA analisou seu currículo com sucesso.\n\n` +
          `Você pode revisar e editar as sugestões abaixo.`,
        [
          {
            text: 'OK',
          },
        ]
      );
    } catch (error) {
      console.error(
        'Erro ao analisar currículo:',
        error
      );

      Alert.alert(
        'Não foi possível analisar',
        error instanceof Error
          ? error.message
          : 'Ocorreu um erro ao conectar com a IA.'
      );
    } finally {
      setAnalisandoIA(false);
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.etapa}>
            ETAPA 5 DE 6
          </Text>

          <Text style={styles.titulo}>
            Revise suas informações
          </Text>

          <Text style={styles.subtitulo}>
            Confira tudo antes de escolher o modelo
            do seu currículo.
          </Text>

          {/* DADOS PESSOAIS */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitulo}>
                Dados pessoais
              </Text>

              <Pressable
                onPress={editarDadosPessoais}
              >
                <Text style={styles.editar}>
                  Editar
                </Text>
              </Pressable>
            </View>

            <InfoRow
              label="Nome"
              value={
                nome || 'Não informado'
              }
            />

            <InfoRow
              label="E-mail"
              value={
                email || 'Não informado'
              }
            />

            <InfoRow
              label="Telefone"
              value={
                telefone || 'Não informado'
              }
            />
          </View>

          {/* EXPERIÊNCIA */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitulo}>
                Experiência profissional
              </Text>

              <Pressable
                onPress={editarExperiencia}
              >
                <Text style={styles.editar}>
                  Editar
                </Text>
              </Pressable>
            </View>

            {primeiroEmprego === true ? (
              <Text style={styles.texto}>
                Primeiro emprego.
              </Text>
            ) : experiencias.length === 0 ? (
              <Text style={styles.texto}>
                Nenhuma experiência informada.
              </Text>
            ) : (
              experiencias.map(
                (
                  experiencia,
                  index
                ) => (
                  <View
                    key={`${experiencia.empresa}-${index}`}
                    style={
                      index > 0
                        ? styles.itemSeparado
                        : undefined
                    }
                  >
                    <Text
                      style={styles.itemTitulo}
                    >
                      {experiencia.cargo}
                    </Text>

                    <Text
                      style={styles.itemTexto}
                    >
                      {experiencia.empresa}
                    </Text>

                    <Text
                      style={styles.itemTexto}
                    >
                      {experiencia.inicioMes}/
                      {experiencia.inicioAno}
                      {' - '}
                      {experiencia.atual
                        ? 'Atual'
                        : `${experiencia.fimMes}/${experiencia.fimAno}`}
                    </Text>

                    {experiencia.descricao ? (
                      <Text
                        style={styles.descricao}
                      >
                        {experiencia.descricao}
                      </Text>
                    ) : null}
                  </View>
                )
              )
            )}
          </View>

          {/* FORMAÇÃO */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitulo}>
                Formação acadêmica
              </Text>

              <Pressable
                onPress={editarFormacao}
              >
                <Text style={styles.editar}>
                  Editar
                </Text>
              </Pressable>
            </View>

            {formacoes.length === 0 ? (
              <Text style={styles.texto}>
                Nenhuma formação informada.
              </Text>
            ) : (
              formacoes.map(
                (
                  formacao,
                  index
                ) => (
                  <View
                    key={`${formacao.instituicao}-${index}`}
                    style={
                      index > 0
                        ? styles.itemSeparado
                        : undefined
                    }
                  >
                    <Text
                      style={styles.itemTitulo}
                    >
                      {formacao.nivel}
                    </Text>

                    {formacao.curso ? (
                      <Text
                        style={styles.itemTexto}
                      >
                        {formacao.curso}
                      </Text>
                    ) : null}

                    <Text
                      style={styles.itemTexto}
                    >
                      {formacao.instituicao}
                    </Text>

                    <Text
                      style={styles.itemTexto}
                    >
                      {formacao.inicioMes}/
                      {formacao.inicioAno}
                      {' - '}
                      {formacao.atual
                        ? 'Atual'
                        : `${formacao.fimMes}/${formacao.fimAno}`}
                    </Text>
                  </View>
                )
              )
            )}
          </View>

          {/* SOBRE VOCÊ */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitulo}>
                Sobre você
              </Text>

              <Pressable
                onPress={editarSobre}
              >
                <Text style={styles.editar}>
                  Editar
                </Text>
              </Pressable>
            </View>

            <Text style={styles.subsecao}>
              Descrição
            </Text>

            <Text style={styles.texto}>
              {sobreMim ||
                'Nenhuma descrição informada.'}
            </Text>

            <Text style={styles.subsecao}>
              Cursos e certificações
            </Text>

            {cursos.length === 0 ? (
              <Text style={styles.texto}>
                Nenhum curso informado.
              </Text>
            ) : (
              cursos.map(
                (
                  curso,
                  index
                ) => (
                  <Text
                    key={`${curso}-${index}`}
                    style={styles.lista}
                  >
                    • {curso}
                  </Text>
                )
              )
            )}

            <Text style={styles.subsecao}>
              Ferramentas e conhecimentos
            </Text>

            {ferramentas.length === 0 ? (
              <Text style={styles.texto}>
                Nenhuma ferramenta informada.
              </Text>
            ) : (
              ferramentas.map(
                (
                  ferramenta,
                  index
                ) => (
                  <Text
                    key={`${ferramenta}-${index}`}
                    style={styles.lista}
                  >
                    • {ferramenta}
                  </Text>
                )
              )
            )}
          </View>

          {/* IA */}
          <View style={styles.iaCard}>
            <Text style={styles.iaTitulo}>
              ✨ Melhore seu currículo com IA
            </Text>

            <Text style={styles.iaTexto}>
              Nossa IA pode melhorar a descrição
              das suas experiências, seu resumo
              profissional e sugerir habilidades,
              ferramentas e conhecimentos com base
              nas informações fornecidas.
            </Text>

            <Pressable
              onPress={melhorarComIA}
              disabled={analisandoIA}
              style={[
                styles.botaoIA,
                analisandoIA &&
                  styles.botaoIADesabilitado,
              ]}
            >
              {analisandoIA ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />

                  <Text
                    style={styles.textoBotaoIA}
                  >
                    Analisando currículo...
                  </Text>
                </>
              ) : (
                <Text
                  style={styles.textoBotaoIA}
                >
                  ✨ Melhorar com IA
                </Text>
              )}
            </Pressable>
          </View>

          {/* RESULTADO DA IA */}
          {resultadoIA && (
            <View style={styles.resultadoIACard}>
              <Text style={styles.resultadoIATitulo}>
                ✨ Resultado da análise
              </Text>

              <Text style={styles.resultadoIASubtitulo}>
                A IA preparou algumas sugestões para
                melhorar seu currículo. Revise e edite
                o conteúdo antes de continuar.
              </Text>

              {/* SOBRE VOCÊ DA IA */}
              <View style={styles.secaoHeader}>
                <Text style={styles.resultadoSecaoTitulo}>
                  Sobre você
                </Text>

                <Pressable
                  onPress={usarSugestaoIA}
                >
                  <Text style={styles.usarSugestao}>
                    Usar sugestão
                  </Text>
                </Pressable>
              </View>

              <TextInput
                value={sobreMimIA}
                onChangeText={setSobreMimIA}
                multiline
                textAlignVertical="top"
                placeholder="Escreva seu resumo profissional..."
                placeholderTextColor="#999999"
                style={styles.inputIA}
              />

              <Text style={styles.dica}>
                Você pode editar livremente o texto
                sugerido pela IA.
              </Text>

              {/* HABILIDADES */}
              <Text style={styles.resultadoSecaoTitulo}>
                Habilidades sugeridas
              </Text>

              {habilidadesEditadas.length === 0 ? (
                <Text style={styles.texto}>
                  Nenhuma habilidade adicionada.
                </Text>
              ) : (
                habilidadesEditadas.map(
                  (
                    habilidade,
                    index
                  ) => (
                    <View
                      key={`${habilidade}-${index}`}
                      style={styles.habilidadeItem}
                    >
                      <Text
                        style={styles.habilidadeTexto}
                      >
                        {habilidade}
                      </Text>

                      <Pressable
                        onPress={() =>
                          removerHabilidade(
                            habilidade
                          )
                        }
                        style={styles.botaoRemover}
                      >
                        <Text
                          style={styles.textoRemover}
                        >
                          ×
                        </Text>
                      </Pressable>
                    </View>
                  )
                )
              )}

              <View style={styles.adicionarContainer}>
                <TextInput
                  value={novaHabilidade}
                  onChangeText={setNovaHabilidade}
                  placeholder="Adicionar habilidade"
                  placeholderTextColor="#999999"
                  style={styles.inputAdicionar}
                  onSubmitEditing={
                    adicionarHabilidade
                  }
                  returnKeyType="done"
                />

                <Pressable
                  onPress={adicionarHabilidade}
                  style={styles.botaoAdicionar}
                >
                  <Text
                    style={styles.textoBotaoAdicionar}
                  >
                    +
                  </Text>
                </Pressable>
              </View>

              {/* FERRAMENTAS E CONHECIMENTOS */}
              <Text style={styles.resultadoSecaoTitulo}>
                Ferramentas e conhecimentos sugeridos
              </Text>

              <Text style={styles.dica}>
                A IA mantém ferramentas informadas por você
                e pode melhorar a forma como elas são apresentadas.
              </Text>

              {ferramentasEditadas.length === 0 ? (
                <Text style={styles.texto}>
                  Nenhuma ferramenta ou conhecimento adicionado.
                </Text>
              ) : (
                ferramentasEditadas.map(
                  (
                    ferramenta,
                    index
                  ) => (
                    <View
                      key={`${ferramenta}-${index}`}
                      style={styles.habilidadeItem}
                    >
                      <Text
                        style={styles.habilidadeTexto}
                      >
                        {ferramenta}
                      </Text>

                      <Pressable
                        onPress={() =>
                          removerFerramenta(
                            ferramenta
                          )
                        }
                        style={styles.botaoRemover}
                      >
                        <Text
                          style={styles.textoRemover}
                        >
                          ×
                        </Text>
                      </Pressable>
                    </View>
                  )
                )
              )}

              <View style={styles.adicionarContainer}>
                <TextInput
                  value={novaFerramenta}
                  onChangeText={setNovaFerramenta}
                  placeholder="Adicionar ferramenta ou conhecimento"
                  placeholderTextColor="#999999"
                  style={styles.inputAdicionar}
                  onSubmitEditing={
                    adicionarFerramenta
                  }
                  returnKeyType="done"
                />

                <Pressable
                  onPress={adicionarFerramenta}
                  style={styles.botaoAdicionar}
                >
                  <Text
                    style={styles.textoBotaoAdicionar}
                  >
                    +
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={voltar}
            style={styles.botaoVoltar}
          >
            <Text style={styles.textoVoltar}>
              Voltar
            </Text>
          </Pressable>

          <Pressable
            onPress={continuar}
            style={styles.botaoContinuar}
          >
            <Text style={styles.textoContinuar}>
              Escolher modelo
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  safeArea: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 180,
  },

  etapa: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: 10,
  },

  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#000000',
  },

  subtitulo: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    color: '#555555',
    marginBottom: 24,
  },

  card: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  cardTitulo: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },

  editar: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1565C0',
  },

  infoRow: {
    marginBottom: 12,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777777',
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 15,
    color: '#222222',
  },

  texto: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444444',
  },

  itemTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },

  itemTexto: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555555',
  },

  descricao: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: '#444444',
  },

  itemSeparado: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 14,
    marginTop: 14,
  },

  subsecao: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222222',
    marginTop: 14,
    marginBottom: 6,
  },

  lista: {
    fontSize: 15,
    lineHeight: 23,
    color: '#444444',
  },

  iaCard: {
    borderWidth: 1,
    borderColor: '#1565C0',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    backgroundColor: '#F5F9FF',
  },

  iaTitulo: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1565C0',
    marginBottom: 8,
  },

  iaTexto: {
    fontSize: 14,
    lineHeight: 21,
    color: '#444444',
    marginBottom: 16,
  },

  botaoIA: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: '#1565C0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
  },

  botaoIADesabilitado: {
    opacity: 0.7,
  },

  textoBotaoIA: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  resultadoIACard: {
    borderWidth: 1,
    borderColor: '#1565C0',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },

  resultadoIATitulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1565C0',
    marginBottom: 8,
  },

  resultadoIASubtitulo: {
    fontSize: 14,
    lineHeight: 21,
    color: '#555555',
    marginBottom: 18,
  },

  secaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  resultadoSecaoTitulo: {
    fontSize: 15,
    fontWeight: '800',
    color: '#222222',
    marginTop: 14,
    marginBottom: 8,
  },

  usarSugestao: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1565C0',
    marginTop: 14,
    marginBottom: 8,
  },

  inputIA: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#D8E3F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    lineHeight: 21,
    color: '#333333',
    backgroundColor: '#F9FBFE',
  },

  dica: {
    fontSize: 12,
    lineHeight: 18,
    color: '#777777',
    marginTop: 6,
  },

  habilidadeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0EAF7',
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 8,
    paddingVertical: 10,
    marginBottom: 8,
    backgroundColor: '#F5F9FF',
  },

  habilidadeTexto: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#333333',
  },

  botaoRemover: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoRemover: {
    fontSize: 24,
    lineHeight: 26,
    color: '#777777',
  },

  adicionarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },

  inputAdicionar: {
    flex: 1,
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },

  botaoAdicionar: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#1565C0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoBotaoAdicionar: {
    fontSize: 25,
    lineHeight: 28,
    fontWeight: '500',
    color: '#FFFFFF',
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },

  botaoVoltar: {
    flex: 1,
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1565C0',
    backgroundColor: '#FFFFFF',
  },

  textoVoltar: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1565C0',
  },

  botaoContinuar: {
    flex: 1.5,
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1565C0',
  },

  textoContinuar: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});