import { router } from 'expo-router';
import { useState } from 'react';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
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
  Experiencia,
  useCurriculo,
} from '@/context/CurriculoContext';

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

export default function ExperienciaScreen() {
  const {
    experiencias,
    primeiroEmprego,
    setExperiencias,
    setPrimeiroEmprego,
  } = useCurriculo();

  const [modalTipo, setModalTipo] = useState<
    | 'inicioMes'
    | 'inicioAno'
    | 'fimMes'
    | 'fimAno'
    | null
  >(null);

  const [experienciaEditando, setExperienciaEditando] =
    useState<number | null>(null);

  const [cargo, setCargo] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [inicioMes, setInicioMes] = useState('');
  const [inicioAno, setInicioAno] = useState('');
  const [fimMes, setFimMes] = useState('');
  const [fimAno, setFimAno] = useState('');
  const [atual, setAtual] = useState(false);
  const [descricao, setDescricao] = useState('');

  const [erro, setErro] = useState('');

  function limparFormulario() {
    setCargo('');
    setEmpresa('');
    setInicioMes('');
    setInicioAno('');
    setFimMes('');
    setFimAno('');
    setAtual(false);
    setDescricao('');
    setExperienciaEditando(null);
    setErro('');
  }

  function selecionarExperiencia(
    possuiExperiencia: boolean
  ) {
    setPrimeiroEmprego(!possuiExperiencia);

    setErro('');

    if (!possuiExperiencia) {
      setExperiencias([]);
      limparFormulario();
    }
  }

  function editarExperiencia(
    experiencia: Experiencia,
    index: number
  ) {
    setCargo(experiencia.cargo);
    setEmpresa(experiencia.empresa);
    setInicioMes(experiencia.inicioMes);
    setInicioAno(experiencia.inicioAno);
    setFimMes(experiencia.fimMes);
    setFimAno(experiencia.fimAno);
    setAtual(experiencia.atual);
    setDescricao(experiencia.descricao);

    setExperienciaEditando(index);
    setErro('');
  }

  function removerExperiencia(index: number) {
    setExperiencias(
      experiencias.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );

    if (experienciaEditando === index) {
      limparFormulario();
    }
  }

  function validarFormulario() {
    if (cargo.trim() === '') {
      setErro('Informe o cargo.');
      return false;
    }

    if (empresa.trim() === '') {
      setErro('Informe a empresa.');
      return false;
    }

    if (inicioMes === '' || inicioAno === '') {
      setErro('Informe o início da experiência.');
      return false;
    }

    if (
      !atual &&
      (fimMes === '' || fimAno === '')
    ) {
      setErro(
        'Informe o término da experiência ou marque que trabalha atualmente aqui.'
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

  function salvarExperiencia() {
    setErro('');

    if (!validarFormulario()) {
      return;
    }

    const novaExperiencia: Experiencia = {
      cargo: cargo.trim(),
      empresa: empresa.trim(),
      inicioMes,
      inicioAno,
      fimMes: atual ? '' : fimMes,
      fimAno: atual ? '' : fimAno,
      atual,
      descricao: descricao.trim(),
    };

    if (experienciaEditando !== null) {
      const experienciasAtualizadas =
        experiencias.map((experiencia, index) =>
          index === experienciaEditando
            ? novaExperiencia
            : experiencia
        );

      setExperiencias(experienciasAtualizadas);
    } else {
      setExperiencias([
        ...experiencias,
        novaExperiencia,
      ]);
    }

    limparFormulario();
  }

  function continuar() {
    if (primeiroEmprego === null) {
      setErro(
        'Selecione uma das opções sobre sua experiência profissional.'
      );
      return;
    }

    if (
      primeiroEmprego === false &&
      experiencias.length === 0
    ) {
      setErro(
        'Adicione pelo menos uma experiência profissional.'
      );
      return;
    }

    router.push('/formacao');
  }

  function abrirModal(
    tipo:
      | 'inicioMes'
      | 'inicioAno'
      | 'fimMes'
      | 'fimAno'
  ) {
    setModalTipo(tipo);
  }

  function selecionarValor(valor: string) {
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
    if (
      modalTipo === 'inicioMes' ||
      modalTipo === 'fimMes'
    ) {
      return MESES;
    }

    return ANOS;
  }

  const podeSalvar =
    cargo.trim() !== '' &&
    empresa.trim() !== '' &&
    inicioMes !== '' &&
    inicioAno !== '' &&
    (atual ||
      (fimMes !== '' && fimAno !== ''));

  const podeContinuar =
    primeiroEmprego === true ||
    (primeiroEmprego === false &&
      experiencias.length > 0);

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
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View style={styles.header}>
              <Text style={styles.step}>
                ETAPA 2 DE 6
              </Text>

              <Text style={styles.title}>
                Experiência profissional
              </Text>

              <Text style={styles.subtitle}>
                Conte sobre sua experiência profissional ou
                informe se está procurando seu primeiro emprego.
              </Text>
            </View>

            <View style={styles.questionSection}>
              <Text style={styles.sectionTitle}>
                Você já possui experiência profissional?
              </Text>

              <Pressable
                onPress={() =>
                  selecionarExperiencia(true)
                }
                style={[
                  styles.option,
                  primeiroEmprego === false &&
                    styles.optionSelected,
                ]}
              >
                <View
                  style={[
                    styles.radio,
                    primeiroEmprego === false &&
                      styles.radioSelected,
                  ]}
                >
                  {primeiroEmprego === false && (
                    <View style={styles.radioDot} />
                  )}
                </View>

                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>
                    Sim, já trabalhei
                  </Text>

                  <Text style={styles.optionDescription}>
                    Quero adicionar minhas experiências
                    profissionais.
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() =>
                  selecionarExperiencia(false)
                }
                style={[
                  styles.option,
                  primeiroEmprego === true &&
                    styles.optionSelected,
                ]}
              >
                <View
                  style={[
                    styles.radio,
                    primeiroEmprego === true &&
                      styles.radioSelected,
                  ]}
                >
                  {primeiroEmprego === true && (
                    <View style={styles.radioDot} />
                  )}
                </View>

                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>
                    Não, estou procurando meu primeiro emprego
                  </Text>

                  <Text style={styles.optionDescription}>
                    Ainda não possuo experiência profissional.
                  </Text>
                </View>
              </Pressable>
            </View>

            {primeiroEmprego === false && (
              <View style={styles.experiencesSection}>
                <Text style={styles.sectionTitle}>
                  Suas experiências
                </Text>

                {experiencias.map(
                  (experiencia, index) => (
                    <View
                      key={`${experiencia.empresa}-${index}`}
                      style={styles.experienceCard}
                    >
                      <View style={styles.cardHeader}>
                        <View style={styles.cardHeaderText}>
                          <Text style={styles.cardTitle}>
                            {experiencia.cargo}
                          </Text>

                          <Text style={styles.cardCompany}>
                            {experiencia.empresa}
                          </Text>
                        </View>

                        <View style={styles.cardActions}>
                          <Pressable
                            onPress={() =>
                              editarExperiencia(
                                experiencia,
                                index
                              )
                            }
                          >
                            <Text style={styles.editText}>
                              Editar
                            </Text>
                          </Pressable>

                          <Pressable
                            onPress={() =>
                              removerExperiencia(index)
                            }
                          >
                            <Text style={styles.removeText}>
                              Excluir
                            </Text>
                          </Pressable>
                        </View>
                      </View>

                      <Text style={styles.periodText}>
                        {experiencia.inicioMes}/
                        {experiencia.inicioAno}
                        {' — '}
                        {experiencia.atual
                          ? 'Atual'
                          : `${experiencia.fimMes}/${experiencia.fimAno}`}
                      </Text>

                      {experiencia.descricao !== '' && (
                        <Text style={styles.cardDescription}>
                          {experiencia.descricao}
                        </Text>
                      )}
                    </View>
                  )
                )}

                <View style={styles.formDivider} />

                <Text style={styles.formTitle}>
                  {experienciaEditando !== null
                    ? 'Editar experiência'
                    : 'Adicionar experiência'}
                </Text>

                <Text style={styles.label}>
                  Cargo *
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Ex: Analista de QA"
                  placeholderTextColor="#777777"
                  value={cargo}
                  onChangeText={(valor) => {
                    setCargo(valor);
                    setErro('');
                  }}
                  returnKeyType="next"
                />

                <Text style={styles.label}>
                  Empresa *
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Ex: Empresa XYZ"
                  placeholderTextColor="#777777"
                  value={empresa}
                  onChangeText={(valor) => {
                    setEmpresa(valor);
                    setErro('');
                  }}
                  returnKeyType="next"
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

                <Pressable
                  onPress={() => setAtual(!atual)}
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
                      <Text style={styles.checkmark}>
                        ✓
                      </Text>
                    )}
                  </View>

                  <Text style={styles.checkboxText}>
                    Trabalho atualmente aqui
                  </Text>
                </Pressable>

                {!atual && (
                  <>
                    <Text style={styles.label}>
                      Término *
                    </Text>

                    <View style={styles.dateRow}>
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

                <Text style={styles.label}>
                  Descrição das atividades
                </Text>

                <TextInput
                  style={styles.textArea}
                  placeholder="Descreva brevemente suas principais atividades, responsabilidades e resultados."
                  placeholderTextColor="#777777"
                  value={descricao}
                  onChangeText={setDescricao}
                  multiline
                  textAlignVertical="top"
                  maxLength={1000}
                />

                {erro !== '' && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>
                      {erro}
                    </Text>
                  </View>
                )}

                <View style={styles.formButtons}>
                  <Pressable
                    onPress={salvarExperiencia}
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
                      {experienciaEditando !== null
                        ? 'Salvar alterações'
                        : '+ Adicionar experiência'}
                    </Text>
                  </Pressable>

                  {experienciaEditando !== null && (
                    <Pressable
                      onPress={limparFormulario}
                      style={styles.cancelButton}
                    >
                      <Text style={styles.cancelButtonText}>
                        Cancelar edição
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            )}

            {primeiroEmprego === true && (
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>
                  Tudo bem!
                </Text>

                <Text style={styles.infoText}>
                  Não é necessário ter experiência profissional.
                  Vamos usar sua formação, conhecimentos, cursos
                  e outras informações para criar seu currículo.
                </Text>
              </View>
            )}

            {erro !== '' &&
              primeiroEmprego !== false && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>
                    {erro}
                  </Text>
                </View>
              )}
          </ScrollView>

          <View style={styles.buttons}>
            <View style={styles.buttonRow}>
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.backButtonText}>
                  Voltar
                </Text>
              </Pressable>

              <Pressable
                onPress={continuar}
                disabled={!podeContinuar}
                style={({ pressed }) => [
                  styles.continueButton,
                  !podeContinuar &&
                    styles.continueButtonDisabled,
                  pressed &&
                    podeContinuar &&
                    styles.buttonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.continueButtonText,
                    !podeContinuar &&
                      styles.continueButtonTextDisabled,
                  ]}
                >
                  Continuar
                </Text>
              </Pressable>
            </View>

            {/* Banner de teste do AdMob */}
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
        </KeyboardAvoidingView>

        <Modal
          visible={modalTipo !== null}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setModalTipo(null)
          }
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {obterTituloModal()}
              </Text>

              <ScrollView
                style={styles.modalScroll}
                showsVerticalScrollIndicator={false}
              >
                {obterOpcoesModal().map((opcao) => (
                  <Pressable
                    key={opcao}
                    onPress={() =>
                      selecionarValor(opcao)
                    }
                    style={styles.modalOption}
                  >
                    <Text style={styles.modalOptionText}>
                      {opcao}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Pressable
                onPress={() => setModalTipo(null)}
                style={styles.modalCancel}
              >
                <Text style={styles.modalCancelText}>
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

  questionSection: {
    marginTop: 30,
  },

  sectionTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },

  optionSelected: {
    borderWidth: 2,
    borderColor: '#1565C0',
    backgroundColor: '#F8FBFF',
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#AAAAAA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  radioSelected: {
    borderColor: '#1565C0',
  },

  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#1565C0',
  },

  optionContent: {
    flex: 1,
  },

  optionTitle: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },

  optionDescription: {
    color: '#777777',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  experiencesSection: {
    marginTop: 20,
  },

  experienceCard: {
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

  cardCompany: {
    color: '#555555',
    fontSize: 14,
    marginTop: 4,
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

  cardDescription: {
    color: '#444444',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
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

  placeholderText: {
    color: '#777777',
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

  textArea: {
    minHeight: 130,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: 15,
    lineHeight: 21,
    color: '#000000',
    backgroundColor: '#FFFFFF',
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

  infoBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#F2F7FF',
    borderWidth: 1,
    borderColor: '#D5E5FF',
  },

  infoTitle: {
    color: '#1565C0',
    fontSize: 15,
    fontWeight: '700',
  },

  infoText: {
    color: '#333333',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
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

  adContainer: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },

  modalContainer: {
    maxHeight: '70%',
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
    maxHeight: 400,
  },

  modalOption: {
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
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