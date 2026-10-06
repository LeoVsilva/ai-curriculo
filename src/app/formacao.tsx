import { router } from 'expo-router';
import { useState } from 'react';

import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

import {
  Formacao,
  NivelEscolaridade,
  useCurriculo,
} from '@/context/CurriculoContext';

const NIVEIS: NivelEscolaridade[] = [
  'Ensino Fundamental Incompleto',
  'Ensino Fundamental Completo',
  'Ensino Médio Incompleto',
  'Ensino Médio Completo',
  'Ensino Superior Incompleto',
  'Ensino Superior Completo',
  'Pós-graduação',
  'Mestrado',
  'Doutorado',
];

const MESES = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
];

const ANOS = Array.from(
  { length: 61 },
  (_, index) => String(2026 - index)
);

function permiteEstarEstudando(
  nivel: NivelEscolaridade
) {
  return (
    nivel === 'Ensino Fundamental Incompleto' ||
    nivel === 'Ensino Médio Incompleto' ||
    nivel === 'Ensino Superior Incompleto' ||
    nivel === 'Pós-graduação' ||
    nivel === 'Mestrado' ||
    nivel === 'Doutorado'
  );
}

function exigeCurso(
  nivel: NivelEscolaridade
) {
  return (
    nivel === 'Ensino Superior Incompleto' ||
    nivel === 'Ensino Superior Completo' ||
    nivel === 'Pós-graduação' ||
    nivel === 'Mestrado' ||
    nivel === 'Doutorado'
  );
}

export default function FormacaoScreen() {
  const {
    formacoes,
    setFormacoes,
  } = useCurriculo();

  const [nivel, setNivel] =
    useState<NivelEscolaridade | null>(null);

  const [curso, setCurso] = useState('');
  const [instituicao, setInstituicao] = useState('');

  const [inicioMes, setInicioMes] = useState('');
  const [inicioAno, setInicioAno] = useState('');

  const [fimMes, setFimMes] = useState('');
  const [fimAno, setFimAno] = useState('');

  const [atual, setAtual] = useState(false);

  const [formacaoEditando, setFormacaoEditando] =
    useState<number | null>(null);

  const [modalTipo, setModalTipo] = useState<
    | 'nivel'
    | 'inicioMes'
    | 'inicioAno'
    | 'fimMes'
    | 'fimAno'
    | null
  >(null);

  const [erro, setErro] = useState('');

  function limparFormulario() {
    setNivel(null);
    setCurso('');
    setInstituicao('');
    setInicioMes('');
    setInicioAno('');
    setFimMes('');
    setFimAno('');
    setAtual(false);
    setFormacaoEditando(null);
    setErro('');
  }

  function selecionarNivel(
    novoNivel: NivelEscolaridade
  ) {
    setNivel(novoNivel);

    if (!permiteEstarEstudando(novoNivel)) {
      setAtual(false);
    }

    setErro('');
    setModalTipo(null);
  }

  function editarFormacao(
    formacao: Formacao,
    index: number
  ) {
    setNivel(formacao.nivel);
    setCurso(formacao.curso);
    setInstituicao(formacao.instituicao);
    setInicioMes(formacao.inicioMes);
    setInicioAno(formacao.inicioAno);
    setFimMes(formacao.fimMes);
    setFimAno(formacao.fimAno);
    setAtual(formacao.atual);

    setFormacaoEditando(index);
    setErro('');
  }

  function removerFormacao(index: number) {
    setFormacoes(
      formacoes.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );

    if (formacaoEditando === index) {
      limparFormulario();
    }
  }

  function validarFormulario() {
    if (nivel === null) {
      setErro(
        'Selecione o nível de escolaridade.'
      );
      return false;
    }

    if (
      exigeCurso(nivel) &&
      curso.trim() === ''
    ) {
      setErro('Informe o curso.');
      return false;
    }

    if (instituicao.trim() === '') {
      setErro(
        'Informe a instituição de ensino.'
      );
      return false;
    }

    if (
      inicioMes === '' ||
      inicioAno === ''
    ) {
      setErro(
        'Informe o início da formação.'
      );
      return false;
    }

    if (
      !permiteEstarEstudando(nivel) &&
      atual
    ) {
      setErro(
        'Esse nível de escolaridade precisa ter uma data de término.'
      );
      return false;
    }

    if (
      !atual &&
      (fimMes === '' || fimAno === '')
    ) {
      setErro(
        'Informe o término da formação ou marque que está estudando atualmente.'
      );
      return false;
    }

    if (
      !atual &&
      inicioAno !== '' &&
      fimAno !== ''
    ) {
      const inicio =
        Number(inicioAno) * 100 +
        Number(inicioMes);

      const fim =
        Number(fimAno) * 100 +
        Number(fimMes);

      if (fim < inicio) {
        setErro(
          'A data de término não pode ser anterior ao início.'
        );
        return false;
      }
    }

    return true;
  }

  function salvarFormacao() {
    setErro('');

    if (!validarFormulario()) {
      return;
    }

    const novaFormacao: Formacao = {
      nivel: nivel!,
      curso: exigeCurso(nivel!)
        ? curso.trim()
        : '',
      instituicao: instituicao.trim(),
      inicioMes,
      inicioAno,
      fimMes: atual ? '' : fimMes,
      fimAno: atual ? '' : fimAno,
      atual,
    };

    if (formacaoEditando !== null) {
      const formacoesAtualizadas =
        formacoes.map(
          (formacao, index) =>
            index === formacaoEditando
              ? novaFormacao
              : formacao
        );

      setFormacoes(formacoesAtualizadas);
    } else {
      setFormacoes([
        ...formacoes,
        novaFormacao,
      ]);
    }

    limparFormulario();
  }

  function continuar() {
    if (formacoes.length === 0) {
      setErro(
        'Adicione pelo menos uma formação acadêmica.'
      );
      return;
    }

    router.push('/habilidades');
  }

  function abrirModal(
    tipo:
      | 'nivel'
      | 'inicioMes'
      | 'inicioAno'
      | 'fimMes'
      | 'fimAno'
  ) {
    setModalTipo(tipo);
  }

  function selecionarValor(valor: string) {
    if (modalTipo === 'nivel') {
      selecionarNivel(
        valor as NivelEscolaridade
      );
      return;
    }

    if (modalTipo === 'inicioMes') {
      setInicioMes(valor);
    }

    if (modalTipo === 'inicioAno') {
      setInicioAno(valor);
    }

    if (modalTipo === 'fimMes') {
      setFimMes(valor);
    }

    if (modalTipo === 'fimAno') {
      setFimAno(valor);
    }

    setModalTipo(null);
    setErro('');
  }

  function obterTituloModal() {
    if (modalTipo === 'nivel') {
      return 'Nível de escolaridade';
    }

    if (modalTipo === 'inicioMes') {
      return 'Mês de início';
    }

    if (modalTipo === 'inicioAno') {
      return 'Ano de início';
    }

    if (modalTipo === 'fimMes') {
      return 'Mês de término';
    }

    return 'Ano de término';
  }

  function obterOpcoesModal() {
    if (modalTipo === 'nivel') {
      return NIVEIS;
    }

    if (
      modalTipo === 'inicioMes' ||
      modalTipo === 'fimMes'
    ) {
      return MESES;
    }

    return ANOS;
  }

  const podeEstarEstudando =
    nivel !== null &&
    permiteEstarEstudando(nivel);

  const cursoObrigatorio =
    nivel !== null &&
    exigeCurso(nivel);

  const podeSalvar =
    nivel !== null &&
    (!cursoObrigatorio ||
      curso.trim() !== '') &&
    instituicao.trim() !== '' &&
    inicioMes !== '' &&
    inicioAno !== '' &&
    (atual ||
      (fimMes !== '' && fimAno !== ''));

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : 'height'
          }
          keyboardVerticalOffset={0}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={
              styles.scrollContent
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >

            <View style={styles.header}>
              <Text style={styles.step}>
                ETAPA 3 DE 6
              </Text>

              <Text style={styles.title}>
                Formação acadêmica
              </Text>

              <Text style={styles.subtitle}>
                Adicione sua formação acadêmica e
                outras informações importantes sobre
                seus estudos.
              </Text>
            </View>

            {formacoes.length > 0 && (
              <View
                style={styles.formacoesSection}
              >
                <Text
                  style={styles.sectionTitle}
                >
                  Suas formações
                </Text>

                {formacoes.map(
                  (formacao, index) => (
                    <View
                      key={`${formacao.instituicao}-${index}`}
                      style={styles.formacaoCard}
                    >
                      <View
                        style={styles.cardHeader}
                      >
                        <View
                          style={
                            styles.cardHeaderText
                          }
                        >
                          <Text
                            style={styles.cardTitle}
                          >
                            {formacao.nivel}
                          </Text>

                          {formacao.curso !== '' && (
                            <Text
                              style={
                                styles.cardCourse
                              }
                            >
                              {formacao.curso}
                            </Text>
                          )}

                          <Text
                            style={
                              styles.cardInstitution
                            }
                          >
                            {formacao.instituicao}
                          </Text>
                        </View>

                        <View
                          style={styles.cardActions}
                        >
                          <Pressable
                            onPress={() =>
                              editarFormacao(
                                formacao,
                                index
                              )
                            }
                          >
                            <Text
                              style={styles.editText}
                            >
                              Editar
                            </Text>
                          </Pressable>

                          <Pressable
                            onPress={() =>
                              removerFormacao(index)
                            }
                          >
                            <Text
                              style={
                                styles.removeText
                              }
                            >
                              Excluir
                            </Text>
                          </Pressable>
                        </View>
                      </View>

                      <Text
                        style={styles.periodText}
                      >
                        {formacao.inicioMes}/
                        {formacao.inicioAno}
                        {' — '}
                        {formacao.atual
                          ? 'Atual'
                          : `${formacao.fimMes}/${formacao.fimAno}`}
                      </Text>
                    </View>
                  )
                )}
              </View>
            )}

            <View style={styles.formDivider} />

            <Text style={styles.formTitle}>
              {formacaoEditando !== null
                ? 'Editar formação'
                : 'Adicionar formação'}
            </Text>

            <Text style={styles.label}>
              Nível de escolaridade *
            </Text>

            <Pressable
              onPress={() =>
                abrirModal('nivel')
              }
              style={styles.selectInput}
            >
              <Text
                style={[
                  styles.selectInputText,
                  nivel === null &&
                    styles.placeholderText,
                ]}
              >
                {nivel || 'Selecione o nível'}
              </Text>
            </Pressable>

            {nivel !== null && (
              <>
                {cursoObrigatorio && (
                  <>
                    <Text style={styles.label}>
                      Curso *
                    </Text>

                    <TextInput
                      style={styles.input}
                      placeholder="Ex: Análise de Sistemas"
                      placeholderTextColor="#777777"
                      value={curso}
                      onChangeText={(valor) => {
                        setCurso(valor);
                        setErro('');
                      }}
                    />
                  </>
                )}

                <Text style={styles.label}>
                  Instituição de ensino *
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Ex: Universidade XYZ"
                  placeholderTextColor="#777777"
                  value={instituicao}
                  onChangeText={(valor) => {
                    setInstituicao(valor);
                    setErro('');
                  }}
                />

                <Text style={styles.label}>
                  Início *
                </Text>

                <View style={styles.dateRow}>
                  <Pressable
                    onPress={() =>
                      abrirModal('inicioMes')
                    }
                    style={styles.dateInput}
                  >
                    <Text
                      style={[
                        styles.dateInputText,
                        inicioMes === '' &&
                          styles.placeholderText,
                      ]}
                    >
                      {inicioMes || 'Mês'}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      abrirModal('inicioAno')
                    }
                    style={styles.dateInput}
                  >
                    <Text
                      style={[
                        styles.dateInputText,
                        inicioAno === '' &&
                          styles.placeholderText,
                      ]}
                    >
                      {inicioAno || 'Ano'}
                    </Text>
                  </Pressable>
                </View>

                {podeEstarEstudando && (
                  <Pressable
                    onPress={() => {
                      setAtual(!atual);
                      setErro('');
                    }}
                    style={styles.checkboxRow}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        atual &&
                          styles.checkboxSelected,
                      ]}
                    >
                      {atual && (
                        <Text
                          style={styles.checkmark}
                        >
                          ✓
                        </Text>
                      )}
                    </View>

                    <Text
                      style={styles.checkboxText}
                    >
                      Atualmente estudando
                    </Text>
                  </Pressable>
                )}

                {!atual && (
                  <>
                    <Text style={styles.label}>
                      Término *
                    </Text>

                    <View
                      style={styles.dateRow}
                    >
                      <Pressable
                        onPress={() =>
                          abrirModal('fimMes')
                        }
                        style={styles.dateInput}
                      >
                        <Text
                          style={[
                            styles.dateInputText,
                            fimMes === '' &&
                              styles.placeholderText,
                          ]}
                        >
                          {fimMes || 'Mês'}
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() =>
                          abrirModal('fimAno')
                        }
                        style={styles.dateInput}
                      >
                        <Text
                          style={[
                            styles.dateInputText,
                            fimAno === '' &&
                              styles.placeholderText,
                          ]}
                        >
                          {fimAno || 'Ano'}
                        </Text>
                      </Pressable>
                    </View>
                  </>
                )}

                {erro !== '' && (
                  <View style={styles.errorBox}>
                    <Text
                      style={styles.errorText}
                    >
                      {erro}
                    </Text>
                  </View>
                )}

                <View style={styles.formButtons}>
                  <Pressable
                    onPress={salvarFormacao}
                    disabled={!podeSalvar}
                    style={({ pressed }) => [
                      styles.addButton,
                      !podeSalvar &&
                        styles.addButtonDisabled,
                      pressed &&
                        podeSalvar &&
                        styles.buttonPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.addButtonText,
                        !podeSalvar &&
                          styles.addButtonTextDisabled,
                      ]}
                    >
                      {formacaoEditando !== null
                        ? 'Salvar alterações'
                        : '+ Adicionar formação'}
                    </Text>
                  </Pressable>

                  {formacaoEditando !== null && (
                    <Pressable
                      onPress={limparFormulario}
                      style={styles.cancelButton}
                    >
                      <Text
                        style={
                          styles.cancelButtonText
                        }
                      >
                        Cancelar edição
                      </Text>
                    </Pressable>
                  )}
                </View>
              </>
            )}

          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.buttons}>
          <View style={styles.buttonRow}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                pressed &&
                  styles.buttonPressed,
              ]}
            >
              <Text
                style={styles.backButtonText}
              >
                Voltar
              </Text>
            </Pressable>

            <Pressable
              onPress={continuar}
              disabled={formacoes.length === 0}
              style={({ pressed }) => [
                styles.continueButton,
                formacoes.length === 0 &&
                  styles.continueButtonDisabled,
                pressed &&
                  formacoes.length > 0 &&
                  styles.buttonPressed,
              ]}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  formacoes.length === 0 &&
                    styles.continueButtonTextDisabled,
                ]}
              >
                Continuar
              </Text>
            </Pressable>
          </View>

          <View style={styles.adContainer}>
            <BannerAd
              unitId="ca-app-pub-5896868084315568/4468179804"
              size={BannerAdSize.BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
        </View>

        <Modal
          visible={modalTipo !== null}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setModalTipo(null)
          }
        >
          <View style={styles.modalOverlay}>
            <View
              style={styles.modalContainer}
            >
              <Text
                style={styles.modalTitle}
              >
                {obterTituloModal()}
              </Text>

              <ScrollView
                style={styles.modalScroll}
                showsVerticalScrollIndicator={
                  false
                }
              >
                {obterOpcoesModal().map(
                  (opcao) => (
                    <Pressable
                      key={opcao}
                      onPress={() =>
                        selecionarValor(
                          opcao
                        )
                      }
                      style={
                        styles.modalOption
                      }
                    >
                      <Text
                        style={
                          styles.modalOptionText
                        }
                      >
                        {opcao}
                      </Text>
                    </Pressable>
                  )
                )}
              </ScrollView>

              <Pressable
                onPress={() =>
                  setModalTipo(null)
                }
                style={styles.modalCancel}
              >
                <Text
                  style={
                    styles.modalCancelText
                  }
                >
                  Cancelar
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
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
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },

  keyboardContainer: {
    flex: 1,
  },

  scroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    paddingTop: 30,
    paddingBottom: 30,
  },

  header: {
    backgroundColor: '#FFFFFF',
  },

  step: {
    color: '#1565C0',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },

  title: {
    color: '#000000',
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 38,
  },

  subtitle: {
    color: '#333333',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },

  formacoesSection: {
    marginTop: 28,
  },

  sectionTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },

  formacaoCard: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cardHeaderText: {
    flex: 1,
    paddingRight: 10,
  },

  cardTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },

  cardCourse: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },

  cardInstitution: {
    color: '#555555',
    fontSize: 14,
    marginTop: 3,
  },

  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },

  editText: {
    color: '#1565C0',
    fontSize: 13,
    fontWeight: '700',
  },

  removeText: {
    color: '#C62828',
    fontSize: 13,
    fontWeight: '700',
  },

  periodText: {
    color: '#777777',
    fontSize: 12,
    marginTop: 12,
  },

  formDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 24,
  },

  formTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },

  label: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 8,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },

  selectInput: {
    height: 54,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },

  selectInputText: {
    color: '#000000',
    fontSize: 16,
  },

  placeholderText: {
    color: '#777777',
  },

  dateRow: {
    flexDirection: 'row',
    gap: 10,
  },

  dateInput: {
    flex: 1,
    height: 54,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },

  dateInputText: {
    color: '#000000',
    fontSize: 16,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: '#AAAAAA',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  checkboxSelected: {
    borderColor: '#1565C0',
    backgroundColor: '#1565C0',
  },

  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  checkboxText: {
    color: '#333333',
    fontSize: 14,
  },

  errorBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#F0CACA',
  },

  errorText: {
    color: '#C62828',
    fontSize: 13,
    lineHeight: 18,
  },

  formButtons: {
    marginTop: 16,
  },

  addButton: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1565C0',
  },

  addButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  addButtonTextDisabled: {
    color: '#777777',
  },

  cancelButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  cancelButtonText: {
    color: '#1565C0',
    fontSize: 14,
    fontWeight: '600',
  },

  buttons: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },

  adContainer: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  backButton: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1565C0',
    backgroundColor: '#FFFFFF',
  },

  backButtonText: {
    color: '#1565C0',
    fontSize: 16,
    fontWeight: '700',
  },

  continueButton: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1565C0',
  },

  continueButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },

  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  continueButtonTextDisabled: {
    color: '#777777',
  },

  buttonPressed: {
    opacity: 0.7,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },

  modalContainer: {
    maxHeight: '75%',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 24,
    backgroundColor: '#FFFFFF',
  },

  modalTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
  },

  modalScroll: {
    maxHeight: 450,
  },

  modalOption: {
    minHeight: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 8,
  },

  modalOptionText: {
    color: '#000000',
    fontSize: 16,
  },

  modalCancel: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  modalCancelText: {
    color: '#1565C0',
    fontSize: 15,
    fontWeight: '700',
  },
});