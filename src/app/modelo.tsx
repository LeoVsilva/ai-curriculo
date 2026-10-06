import { router } from 'expo-router';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CorCurriculo,
  useCurriculo,
} from '@/context/CurriculoContext';

export default function ModeloScreen() {
  const {
    modeloSelecionado,
    setModeloSelecionado,
    corCurriculo,
    setCorCurriculo,
  } = useCurriculo();

  const podeContinuar =
    modeloSelecionado !== null;

  function selecionarModelo(
    modelo:
      | 'classico'
      | 'moderno'
      | 'minimalista'
  ) {
    setModeloSelecionado(modelo);
  }

  function selecionarCor(cor: CorCurriculo) {
    setCorCurriculo(cor);
  }

  function continuar() {
    if (!podeContinuar) {
      return;
    }

    router.push('/resultado');
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.step}>
              ETAPA 6 DE 6
            </Text>

            <Text style={styles.title}>
              Escolha seu modelo
            </Text>

            <Text style={styles.subtitle}>
              Escolha o estilo visual do seu
              currículo. O conteúdo será mantido
              conforme as informações que você
              revisou.
            </Text>
          </View>

          {/* CORES */}

          <View style={styles.colorSection}>
            <Text style={styles.colorTitle}>
              Cor do currículo
            </Text>

            <Text style={styles.colorSubtitle}>
              Escolha a cor principal dos detalhes
              do seu currículo.
            </Text>

            <View style={styles.colorsContainer}>
              <Pressable
                onPress={() =>
                  selecionarCor('#1565C0')
                }
                style={[
                  styles.colorOption,
                  corCurriculo === '#1565C0' &&
                    styles.colorOptionSelected,
                ]}
              >
                <View
                  style={[
                    styles.colorCircle,
                    {
                      backgroundColor: '#1565C0',
                    },
                  ]}
                />
              </Pressable>

              <Pressable
                onPress={() =>
                  selecionarCor('#2E7D32')
                }
                style={[
                  styles.colorOption,
                  corCurriculo === '#2E7D32' &&
                    styles.colorOptionSelected,
                ]}
              >
                <View
                  style={[
                    styles.colorCircle,
                    {
                      backgroundColor: '#2E7D32',
                    },
                  ]}
                />
              </Pressable>

              <Pressable
                onPress={() =>
                  selecionarCor('#6A1B9A')
                }
                style={[
                  styles.colorOption,
                  corCurriculo === '#6A1B9A' &&
                    styles.colorOptionSelected,
                ]}
              >
                <View
                  style={[
                    styles.colorCircle,
                    {
                      backgroundColor: '#6A1B9A',
                    },
                  ]}
                />
              </Pressable>

              <Pressable
                onPress={() =>
                  selecionarCor('#C62828')
                }
                style={[
                  styles.colorOption,
                  corCurriculo === '#C62828' &&
                    styles.colorOptionSelected,
                ]}
              >
                <View
                  style={[
                    styles.colorCircle,
                    {
                      backgroundColor: '#C62828',
                    },
                  ]}
                />
              </Pressable>

              <Pressable
                onPress={() =>
                  selecionarCor('#EF6C00')
                }
                style={[
                  styles.colorOption,
                  corCurriculo === '#EF6C00' &&
                    styles.colorOptionSelected,
                ]}
              >
                <View
                  style={[
                    styles.colorCircle,
                    {
                      backgroundColor: '#EF6C00',
                    },
                  ]}
                />
              </Pressable>

              <Pressable
                onPress={() =>
                  selecionarCor('#212121')
                }
                style={[
                  styles.colorOption,
                  corCurriculo === '#212121' &&
                    styles.colorOptionSelected,
                ]}
              >
                <View
                  style={[
                    styles.colorCircle,
                    {
                      backgroundColor: '#212121',
                    },
                  ]}
                />
              </Pressable>
            </View>
          </View>

          {/* MODELO CLÁSSICO */}

          <Pressable
            onPress={() =>
              selecionarModelo('classico')
            }
            style={[
              styles.modelCard,
              modeloSelecionado === 'classico' &&
                styles.modelCardSelected,
            ]}
          >
            <View style={styles.preview}>
              <View style={styles.previewHeader}>
                <View style={styles.previewName} />

                <View
                  style={styles.previewLineSmall}
                />
              </View>

              <View style={styles.previewSection}>
                <View
                  style={[
                    styles.previewTitle,
                    {
                      backgroundColor:
                        corCurriculo,
                    },
                  ]}
                />

                <View style={styles.previewLine} />
                <View style={styles.previewLine} />
                <View style={styles.previewLine} />
              </View>

              <View style={styles.previewSection}>
                <View
                  style={[
                    styles.previewTitle,
                    {
                      backgroundColor:
                        corCurriculo,
                    },
                  ]}
                />

                <View style={styles.previewLine} />
                <View style={styles.previewLine} />
              </View>
            </View>

            <View style={styles.modelInfo}>
              <View style={styles.modelTextContainer}>
                <Text style={styles.modelTitle}>
                  Clássico
                </Text>

                <Text
                  style={styles.modelDescription}
                >
                  Tradicional e profissional
                </Text>
              </View>

              {modeloSelecionado ===
                'classico' && (
                <View style={styles.selectedBadge}>
                  <Text
                    style={styles.selectedBadgeText}
                  >
                    ✓ Selecionado
                  </Text>
                </View>
              )}
            </View>
          </Pressable>

          {/* MODELO MODERNO */}

          <Pressable
            onPress={() =>
              selecionarModelo('moderno')
            }
            style={[
              styles.modelCard,
              modeloSelecionado === 'moderno' &&
                styles.modelCardSelected,
            ]}
          >
            <View style={styles.preview}>
              <View
                style={[
                  styles.previewModernHeader,
                  {
                    backgroundColor: corCurriculo,
                  },
                ]}
              >
                <View
                  style={styles.previewModernName}
                />
              </View>

              <View style={styles.previewSection}>
                <View
                  style={[
                    styles.previewTitle,
                    {
                      backgroundColor:
                        corCurriculo,
                    },
                  ]}
                />

                <View style={styles.previewLine} />
                <View style={styles.previewLine} />
                <View style={styles.previewLine} />
              </View>

              <View style={styles.previewSection}>
                <View
                  style={[
                    styles.previewTitle,
                    {
                      backgroundColor:
                        corCurriculo,
                    },
                  ]}
                />

                <View style={styles.previewLine} />
                <View style={styles.previewLine} />
              </View>
            </View>

            <View style={styles.modelInfo}>
              <View style={styles.modelTextContainer}>
                <Text style={styles.modelTitle}>
                  Moderno
                </Text>

                <Text
                  style={styles.modelDescription}
                >
                  Atual e com maior destaque visual
                </Text>
              </View>

              {modeloSelecionado ===
                'moderno' && (
                <View style={styles.selectedBadge}>
                  <Text
                    style={styles.selectedBadgeText}
                  >
                    ✓ Selecionado
                  </Text>
                </View>
              )}
            </View>
          </Pressable>

          {/* MODELO MINIMALISTA */}

          <Pressable
            onPress={() =>
              selecionarModelo('minimalista')
            }
            style={[
              styles.modelCard,
              modeloSelecionado ===
                'minimalista' &&
                styles.modelCardSelected,
            ]}
          >
            <View style={styles.preview}>
              <View
                style={[
                  styles.previewHeader,
                  {
                    borderBottomColor:
                      corCurriculo,
                  },
                ]}
              >
                <View style={styles.previewName} />
              </View>

              <View style={styles.previewSection}>
                <View
                  style={[
                    styles.previewTitle,
                    {
                      backgroundColor:
                        corCurriculo,
                    },
                  ]}
                />

                <View style={styles.previewLine} />
                <View style={styles.previewLine} />
              </View>

              <View style={styles.previewSection}>
                <View
                  style={[
                    styles.previewTitle,
                    {
                      backgroundColor:
                        corCurriculo,
                    },
                  ]}
                />

                <View style={styles.previewLine} />
                <View style={styles.previewLine} />
              </View>
            </View>

            <View style={styles.modelInfo}>
              <View style={styles.modelTextContainer}>
                <Text style={styles.modelTitle}>
                  Minimalista
                </Text>

                <Text
                  style={styles.modelDescription}
                >
                  Limpo e focado no conteúdo
                </Text>
              </View>

              {modeloSelecionado ===
                'minimalista' && (
                <View style={styles.selectedBadge}>
                  <Text
                    style={styles.selectedBadgeText}
                  >
                    ✓ Selecionado
                  </Text>
                </View>
              )}
            </View>
          </Pressable>

          {/* INFORMAÇÃO */}

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>
              💡 Sobre o modelo
            </Text>

            <Text style={styles.infoText}>
              O modelo define apenas a aparência
              do currículo. Suas informações,
              experiências e sugestões aprovadas
              pela IA serão utilizadas no currículo
              final.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.buttons}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed &&
                styles.buttonPressed,
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

  colorSection: {
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  colorTitle: {
    color: '#000000',
    fontSize: 17,
    fontWeight: '700',
  },

  colorSubtitle: {
    color: '#555555',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },

  colorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 12,
  },

  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },

  colorOptionSelected: {
    borderColor: '#000000',
  },

  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },

  modelCard: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#FFFFFF',
  },

  modelCardSelected: {
    borderWidth: 2,
    borderColor: '#1565C0',
    backgroundColor: '#F8FBFF',
  },

  preview: {
    height: 180,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#FAFAFA',
  },

  previewHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
    paddingBottom: 10,
  },

  previewModernHeader: {
    height: 42,
    marginBottom: 12,
    borderRadius: 5,
    padding: 10,
  },

  previewName: {
    width: '55%',
    height: 10,
    backgroundColor: '#222222',
    borderRadius: 3,
  },

  previewModernName: {
    width: '65%',
    height: 9,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },

  previewLineSmall: {
    width: '35%',
    height: 6,
    backgroundColor: '#BBBBBB',
    borderRadius: 3,
    marginTop: 6,
  },

  previewSection: {
    marginTop: 14,
  },

  previewTitle: {
    width: '30%',
    height: 7,
    backgroundColor: '#1565C0',
    borderRadius: 3,
    marginBottom: 8,
  },

  previewLine: {
    width: '90%',
    height: 5,
    backgroundColor: '#CCCCCC',
    borderRadius: 3,
    marginBottom: 5,
  },

  modelInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  modelTextContainer: {
    flex: 1,
    paddingRight: 10,
  },

  modelTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },

  modelDescription: {
    color: '#555555',
    fontSize: 14,
    lineHeight: 19,
    marginTop: 4,
  },

  selectedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1565C0',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
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
    flexDirection: 'row',
    gap: 10,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
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
});