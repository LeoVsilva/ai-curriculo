import { router } from 'expo-router';
import { useState } from 'react';

import {
  KeyboardAvoidingView,
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

import { useCurriculo } from '@/context/CurriculoContext';

export default function HabilidadesScreen() {
  const {
    sobreMim,
    cursos,
    ferramentas,
    setSobreMim,
    setCursos,
    setFerramentas,
  } = useCurriculo();

  const [curso, setCurso] = useState('');
  const [ferramenta, setFerramenta] = useState('');

  const [erroCurso, setErroCurso] = useState('');
  const [erroFerramenta, setErroFerramenta] = useState('');

  function adicionarCurso() {
    const novoCurso = curso.trim();

    if (novoCurso === '') {
      setErroCurso(
        'Digite o nome do curso antes de adicionar.'
      );
      return;
    }

    const cursoJaExiste = cursos.some(
      (item) =>
        item.toLowerCase() === novoCurso.toLowerCase()
    );

    if (cursoJaExiste) {
      setErroCurso('Esse curso já foi adicionado.');
      return;
    }

    setCursos([...cursos, novoCurso]);

    setCurso('');
    setErroCurso('');
  }

  function removerCurso(cursoParaRemover: string) {
    setCursos(
      cursos.filter(
        (item) => item !== cursoParaRemover
      )
    );
  }

  function adicionarFerramenta() {
    const novaFerramenta = ferramenta.trim();

    if (novaFerramenta === '') {
      setErroFerramenta(
        'Digite uma ferramenta ou conhecimento antes de adicionar.'
      );
      return;
    }

    const ferramentaJaExiste = ferramentas.some(
      (item) =>
        item.toLowerCase() ===
        novaFerramenta.toLowerCase()
    );

    if (ferramentaJaExiste) {
      setErroFerramenta(
        'Essa ferramenta já foi adicionada.'
      );
      return;
    }

    setFerramentas([
      ...ferramentas,
      novaFerramenta,
    ]);

    setFerramenta('');
    setErroFerramenta('');
  }

  function removerFerramenta(
    ferramentaParaRemover: string
  ) {
    setFerramentas(
      ferramentas.filter(
        (item) => item !== ferramentaParaRemover
      )
    );
  }

  function continuar() {
    router.push('/revisar');
  }

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
                ETAPA 4 DE 6
              </Text>

              <Text style={styles.title}>
                Sobre você
              </Text>

              <Text style={styles.subtitle}>
                Conte um pouco mais sobre você, seus
                conhecimentos e experiências. Essas informações
                podem ajudar a IA a criar um currículo mais
                personalizado.
              </Text>
            </View>

            {/* DESCRIÇÃO SOBRE VOCÊ */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Descrição sobre você
              </Text>

              <Text style={styles.helperText}>
                Escreva um resumo sobre quem você é, seus
                principais pontos fortes, conhecimentos e
                características profissionais.
              </Text>

              <TextInput
                style={styles.textArea}
                placeholder="Ex: Sou uma pessoa comunicativa, organizada e gosto de trabalhar em equipe. Tenho facilidade para aprender novas tecnologias..."
                placeholderTextColor="#777777"
                value={sobreMim}
                onChangeText={setSobreMim}
                multiline
                textAlignVertical="top"
                maxLength={1000}
              />

              <Text style={styles.characterCount}>
                {sobreMim.length}/1000
              </Text>
            </View>

            {/* CURSOS */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Cursos e certificações
              </Text>

              <Text style={styles.helperText}>
                Adicione cursos, certificações ou outras
                formações complementares que você já realizou.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Ex: Excel Avançado"
                placeholderTextColor="#777777"
                value={curso}
                onChangeText={(texto) => {
                  setCurso(texto);
                  setErroCurso('');
                }}
                onSubmitEditing={adicionarCurso}
                returnKeyType="done"
              />

              <Pressable
                onPress={adicionarCurso}
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.addButtonText}>
                  + Adicionar curso
                </Text>
              </Pressable>

              {erroCurso !== '' && (
                <Text style={styles.errorText}>
                  {erroCurso}
                </Text>
              )}

              {cursos.length > 0 && (
                <View style={styles.itemsContainer}>
                  <Text style={styles.itemsTitle}>
                    Cursos adicionados
                  </Text>

                  <View style={styles.tagsContainer}>
                    {cursos.map((item) => (
                      <Pressable
                        key={item}
                        onPress={() =>
                          removerCurso(item)
                        }
                        style={({ pressed }) => [
                          styles.tag,
                          pressed &&
                            styles.tagPressed,
                        ]}
                      >
                        <Text style={styles.tagText}>
                          {item}
                        </Text>

                        <Text style={styles.tagRemove}>
                          ×
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  <Text style={styles.tagHelperText}>
                    Toque em um curso para removê-lo.
                  </Text>
                </View>
              )}
            </View>

            {/* FERRAMENTAS */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Ferramentas e conhecimentos
              </Text>

              <Text style={styles.helperText}>
                Adicione ferramentas, tecnologias, programas
                ou conhecimentos que você sabe utilizar.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Ex: Excel, Java, Figma, SAP..."
                placeholderTextColor="#777777"
                value={ferramenta}
                onChangeText={(texto) => {
                  setFerramenta(texto);
                  setErroFerramenta('');
                }}
                onSubmitEditing={adicionarFerramenta}
                returnKeyType="done"
              />

              <Pressable
                onPress={adicionarFerramenta}
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.addButtonText}>
                  + Adicionar ferramenta
                </Text>
              </Pressable>

              {erroFerramenta !== '' && (
                <Text style={styles.errorText}>
                  {erroFerramenta}
                </Text>
              )}

              {ferramentas.length > 0 && (
                <View style={styles.itemsContainer}>
                  <Text style={styles.itemsTitle}>
                    Ferramentas adicionadas
                  </Text>

                  <View style={styles.tagsContainer}>
                    {ferramentas.map((item) => (
                      <Pressable
                        key={item}
                        onPress={() =>
                          removerFerramenta(item)
                        }
                        style={({ pressed }) => [
                          styles.tag,
                          pressed &&
                            styles.tagPressed,
                        ]}
                      >
                        <Text style={styles.tagText}>
                          {item}
                        </Text>

                        <Text style={styles.tagRemove}>
                          ×
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  <Text style={styles.tagHelperText}>
                    Toque em uma ferramenta para removê-la.
                  </Text>
                </View>
              )}
            </View>

            {/* DICA */}

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>
                💡 Dica
              </Text>

              <Text style={styles.infoText}>
                Quanto mais informações relevantes você
                fornecer, melhor a IA poderá entender seu
                perfil e adaptar o conteúdo do seu currículo.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* BOTÕES */}

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
              style={({ pressed }) => [
                styles.continueButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.continueButtonText}>
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

  section: {
    marginTop: 30,
  },

  sectionTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },

  helperText: {
    color: '#666666',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },

  textArea: {
    minHeight: 140,
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

  characterCount: {
    color: '#777777',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 6,
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

  addButton: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1565C0',
    marginTop: 10,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  errorText: {
    color: '#C62828',
    fontSize: 12,
    marginTop: 7,
  },

  itemsContainer: {
    marginTop: 18,
  },

  itemsTitle: {
    color: '#333333',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D5E5FF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F2F7FF',
  },

  tagPressed: {
    opacity: 0.65,
  },

  tagText: {
    color: '#1565C0',
    fontSize: 13,
    fontWeight: '600',
  },

  tagRemove: {
    color: '#1565C0',
    fontSize: 18,
    lineHeight: 18,
    marginLeft: 7,
  },

  tagHelperText: {
    color: '#888888',
    fontSize: 11,
    marginTop: 8,
  },

  infoBox: {
    marginTop: 30,
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

  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  buttonPressed: {
    opacity: 0.7,
  },
});