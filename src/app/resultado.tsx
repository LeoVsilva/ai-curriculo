import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

import { useCurriculo } from '@/context/CurriculoContext';

export default function Resultado() {
  const {
    nome,
    email,
    telefone,
    experiencias,
    formacoes,
    sobreMim,
    cursos,
    ferramentas,
    modeloSelecionado,
    resultadoIA,
    corCurriculo,
  } = useCurriculo();

  /*
   * O texto final de "Sobre mim" vem da revisão da IA
   * quando existe um resultado.
   */
  const sobreMimFinal =
    resultadoIA?.sobreMim || sobreMim;

  /*
   * As habilidades são as versões que passaram
   * pela tela de revisão.
   */
  const habilidadesFinais =
    resultadoIA?.habilidadesSugeridas || [];

  /*
   * As ferramentas e conhecimentos também podem ter
   * sido ajustados pela IA durante a revisão.
   */
  const ferramentasFinais =
    resultadoIA?.ferramentasSugeridas ?? ferramentas;

  function escaparHtml(valor: string) {
    return valor
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function gerarHtmlCurriculo() {
    const experienciaHtml =
      experiencias.length > 0
        ? experiencias
            .map(
              (experiencia) => `
                <div class="experience-item">
                  <div class="item-header">
                    <div>
                      <div class="item-title">
                        ${escaparHtml(experiencia.cargo)}
                      </div>

                      <div class="item-company">
                        ${escaparHtml(experiencia.empresa)}
                      </div>
                    </div>

                    <div class="item-period">
                      ${escaparHtml(
                        experiencia.inicioMes
                      )}/${escaparHtml(
                        experiencia.inicioAno
                      )}
                      -
                      ${
                        experiencia.atual
                          ? 'Atual'
                          : `${escaparHtml(
                              experiencia.fimMes
                            )}/${escaparHtml(
                              experiencia.fimAno
                            )}`
                      }
                    </div>
                  </div>

                  ${
                    experiencia.descricao
                      ? `
                        <div class="description">
                          ${escaparHtml(
                            experiencia.descricao
                          )}
                        </div>
                      `
                      : ''
                  }
                </div>
              `
            )
            .join('')
        : '';

    const formacaoHtml =
      formacoes.length > 0
        ? formacoes
            .map(
              (formacao) => `
                <div class="education-item">
                  <div class="item-header">
                    <div>
                      <div class="item-title">
                        ${escaparHtml(
                          formacao.curso ||
                            formacao.nivel
                        )}
                      </div>

                      ${
                        formacao.instituicao
                          ? `
                            <div class="item-company">
                              ${escaparHtml(
                                formacao.instituicao
                              )}
                            </div>
                          `
                          : ''
                      }

                      <div class="education-level">
                        ${escaparHtml(
                          formacao.nivel
                        )}
                      </div>
                    </div>

                    <div class="item-period">
                      ${escaparHtml(
                        formacao.inicioMes
                      )}/${escaparHtml(
                        formacao.inicioAno
                      )}
                      -
                      ${
                        formacao.atual
                          ? 'Atual'
                          : `${escaparHtml(
                              formacao.fimMes
                            )}/${escaparHtml(
                              formacao.fimAno
                            )}`
                      }
                    </div>
                  </div>
                </div>
              `
            )
            .join('')
        : '';

    const sobreMimHtml = sobreMimFinal
      ? `
        <section class="section">
          <h2 class="section-title">
            SOBRE MIM
          </h2>

          <div class="section-line"></div>

          <p class="description">
            ${escaparHtml(sobreMimFinal)}
          </p>
        </section>
      `
      : '';

    const habilidadesHtml =
      habilidadesFinais.length > 0
        ? `
          <section class="section">
            <h2 class="section-title">
              HABILIDADES
            </h2>

            <div class="section-line"></div>

            <div class="tag-list">
              ${habilidadesFinais
                .map(
                  (habilidade) => `
                    <span class="tag">
                      ${escaparHtml(habilidade)}
                    </span>
                  `
                )
                .join('')}
            </div>
          </section>
        `
        : '';

    const cursosHtml =
      cursos.length > 0
        ? `
          <section class="section">
            <h2 class="section-title">
              CURSOS E CERTIFICAÇÕES
            </h2>

            <div class="section-line"></div>

            <div class="tag-list">
              ${cursos
                .map(
                  (curso) => `
                    <span class="tag">
                      ${escaparHtml(curso)}
                    </span>
                  `
                )
                .join('')}
            </div>
          </section>
        `
        : '';

    const ferramentasHtml =
      ferramentasFinais.length > 0
        ? `
          <section class="section">
            <h2 class="section-title">
              FERRAMENTAS E CONHECIMENTOS
            </h2>

            <div class="section-line"></div>

            <div class="tag-list">
              ${ferramentasFinais
                .map(
                  (ferramenta) => `
                    <span class="tag">
                      ${escaparHtml(ferramenta)}
                    </span>
                  `
                )
                .join('')}
            </div>
          </section>
        `
        : '';

    return `
      <!DOCTYPE html>

      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <style>
            @page {
              size: A4;
              margin: 0;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 0;
              background: #ffffff;
              color: #222222;
              font-family:
                Arial,
                Helvetica,
                sans-serif;
              font-size: 12px;
            }

            .page {
              width: 100%;
              min-height: 297mm;
              padding: 24mm 20mm 20mm 20mm;
              background: #ffffff;
            }

            .header {
              border-bottom: 3px solid ${corCurriculo};
              padding-bottom: 18px;
              margin-bottom: 24px;
            }

            .name {
              margin: 0 0 8px 0;
              color: #111827;
              font-size: 28px;
              font-weight: bold;
              line-height: 1.15;
            }

            .contact {
              color: #555555;
              font-size: 11px;
              line-height: 18px;
            }

            .section {
              margin-bottom: 23px;
              page-break-inside: avoid;
            }

            .section-title {
              margin: 0;
              color: ${corCurriculo};
              font-size: 13px;
              font-weight: bold;
              letter-spacing: 0.5px;
            }

            .section-line {
              height: 1px;
              background: #D9DEE5;
              margin-top: 6px;
              margin-bottom: 12px;
            }

            .description {
              margin: 0;
              color: #444444;
              font-size: 11.5px;
              line-height: 18px;
              text-align: justify;
            }

            .experience-item,
            .education-item {
              margin-bottom: 18px;
              page-break-inside: avoid;
            }

            .item-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 15px;
            }

            .item-title {
              color: #222222;
              font-size: 13px;
              font-weight: bold;
              line-height: 17px;
            }

            .item-company {
              margin-top: 3px;
              color: #555555;
              font-size: 11.5px;
              line-height: 16px;
            }

            .education-level {
              margin-top: 2px;
              color: #777777;
              font-size: 10.5px;
              line-height: 15px;
            }

            .item-period {
              min-width: 90px;
              color: #777777;
              font-size: 10px;
              line-height: 15px;
              text-align: right;
              white-space: nowrap;
            }

            .experience-item .description {
              margin-top: 7px;
            }

            .tag-list {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
            }

            .tag {
              display: inline-block;
              padding: 5px 8px;
              border: 1px solid ${corCurriculo};
              border-radius: 3px;
              background: #F7F9FB;
              color: #333333;
              font-size: 10px;
              line-height: 13px;
            }

            @media print {
              body {
                background: #ffffff;
              }

              .page {
                box-shadow: none;
              }

              .section,
              .experience-item,
              .education-item {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>

        <body>
          <main class="page">

            <header class="header">
              <div class="name">
                ${escaparHtml(nome)}
              </div>

              <div class="contact">
                ${escaparHtml(email)}

                ${
                  telefone
                    ? ` • ${escaparHtml(telefone)}`
                    : ''
                }
              </div>
            </header>

            ${sobreMimHtml}

            ${
              experiencias.length > 0
                ? `
                  <section class="section">
                    <h2 class="section-title">
                      EXPERIÊNCIA PROFISSIONAL
                    </h2>

                    <div class="section-line"></div>

                    ${experienciaHtml}
                  </section>
                `
                : ''
            }

            ${
              formacoes.length > 0
                ? `
                  <section class="section">
                    <h2 class="section-title">
                      FORMAÇÃO ACADÊMICA
                    </h2>

                    <div class="section-line"></div>

                    ${formacaoHtml}
                  </section>
                `
                : ''
            }

            ${habilidadesHtml}

            ${cursosHtml}

            ${ferramentasHtml}

          </main>
        </body>
      </html>
    `;
  }

  /*
   * Exibe o anúncio recompensado.
   *
   * O PDF só será gerado quando o usuário
   * receber a recompensa do anúncio.
   */
  async function assistirVideoParaGerarPDF(): Promise<boolean> {
    return new Promise((resolve) => {
      let finalizado = false;

      const rewarded = RewardedAd.createForAdRequest(
  "ca-app-pub-5896868084315568/2420600965",
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

      const finalizar = (resultado: boolean) => {
        if (finalizado) {
          return;
        }

        finalizado = true;

        loadedListener();
        rewardListener();
        errorListener();
        closedListener();

        resolve(resultado);
      };

      const loadedListener =
        rewarded.addAdEventListener(
          RewardedAdEventType.LOADED,
          async () => {
            console.log(
              'Vídeo recompensado carregado.'
            );

            try {
              await rewarded.show();
            } catch (error) {
              console.error(
                'Erro ao exibir vídeo:',
                error
              );

              Alert.alert(
                'Erro',
                'Não foi possível exibir o vídeo. Tente novamente.'
              );

              finalizar(false);
            }
          }
        );

      const rewardListener =
        rewarded.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          (reward) => {
            console.log(
              'Recompensa recebida:',
              reward
            );

            finalizar(true);
          }
        );

      const errorListener =
        rewarded.addAdEventListener(
          AdEventType.ERROR,
          (error) => {
            console.error(
              'Erro no anúncio recompensado:',
              error
            );

            Alert.alert(
              'Vídeo indisponível',
              'Não foi possível carregar o vídeo. Tente novamente em alguns segundos.'
            );

            finalizar(false);
          }
        );

      const closedListener =
        rewarded.addAdEventListener(
          AdEventType.CLOSED,
          () => {
            /*
             * Se o usuário fechar o anúncio antes
             * de receber a recompensa, o PDF não
             * será liberado.
             */
            if (!finalizado) {
              Alert.alert(
                'Vídeo não concluído',
                'Assista ao vídeo até o final para liberar a geração do PDF.'
              );

              finalizar(false);
            }
          }
        );

      console.log(
        'Carregando vídeo recompensado...'
      );

      rewarded.load();
    });
  }

  /*
   * Gera e compartilha o PDF.
   *
   * Essa função só é chamada depois que
   * o usuário recebeu a recompensa.
   */
  async function gerarPDF() {
    try {
      console.log(
        '================================'
      );

      console.log(
        'INICIANDO EXPORTAÇÃO DO PDF'
      );

      console.log(
        '================================'
      );

      /*
       * Primeiro mostramos o anúncio.
       */
      const recebeuRecompensa =
        await assistirVideoParaGerarPDF();

      /*
       * Se não recebeu a recompensa,
       * interrompemos o processo.
       */
      if (!recebeuRecompensa) {
        console.log(
          'PDF não liberado: recompensa não recebida.'
        );

        return;
      }

      console.log(
        'Recompensa recebida. Liberando PDF...'
      );

      const html = gerarHtmlCurriculo();

      console.log(
        '1. GERANDO PDF EM BASE64'
      );

      const resultado =
        await Print.printToFileAsync({
          html,
          base64: true,
        });

      console.log('2. PDF GERADO');

      console.log(
        'Número de páginas:',
        resultado.numberOfPages
      );

      console.log(
        'Base64 recebido:',
        !!resultado.base64
      );

      if (!resultado.base64) {
        Alert.alert(
          'Erro',
          'Não foi possível obter o conteúdo do PDF.'
        );

        return;
      }

      if (!FileSystem.documentDirectory) {
        Alert.alert(
          'Erro',
          'A pasta de documentos não está disponível.'
        );

        return;
      }

      const nomeArquivo =
        `curriculo-${Date.now()}.pdf`;

      const destino =
        FileSystem.documentDirectory +
        nomeArquivo;

      console.log(
        '3. SALVANDO PDF EM:',
        destino
      );

      await FileSystem.writeAsStringAsync(
        destino,
        resultado.base64,
        {
          encoding:
            FileSystem.EncodingType.Base64,
        }
      );

      console.log(
        '4. PDF SALVO COM SUCESSO!'
      );

      const info =
        await FileSystem.getInfoAsync(
          destino
        );

      console.log(
        '5. INFORMAÇÕES DO ARQUIVO:',
        info
      );

      if (!info.exists) {
        Alert.alert(
          'Erro',
          'O PDF foi gerado, mas não foi possível salvar o arquivo.'
        );

        return;
      }

      const podeCompartilhar =
        await Sharing.isAvailableAsync();

      console.log(
        '6. COMPARTILHAMENTO:',
        podeCompartilhar
      );

      if (!podeCompartilhar) {
        Alert.alert(
          'PDF criado',
          'O PDF foi criado, mas o compartilhamento não está disponível neste dispositivo.'
        );

        return;
      }

      console.log(
        '7. ABRINDO COMPARTILHAMENTO...'
      );

      await Sharing.shareAsync(
        destino,
        {
          mimeType: 'application/pdf',
          dialogTitle:
            'Compartilhar currículo',
        }
      );

      console.log(
        '8. PDF COMPARTILHADO COM SUCESSO!'
      );
    } catch (error) {
      console.error(
        '================================'
      );

      console.error(
        'ERRO AO GERAR/COMPARTILHAR PDF:'
      );

      console.error(error);

      console.error(
        '================================'
      );

      Alert.alert(
        'Erro',
        error instanceof Error
          ? error.message
          : 'Não foi possível gerar ou compartilhar o PDF.'
      );
    }
  }

  const modelo =
    modeloSelecionado || 'moderno';

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <View style={styles.container}>

        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>
              ←
            </Text>
          </Pressable>

          <View style={styles.topBarCenter}>
            <Text style={styles.topBarTitle}>
              Seu currículo
            </Text>

            <Text style={styles.topBarSubtitle}>
              Pré-visualização
            </Text>
          </View>

          <View style={styles.topBarSpacer} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.resume,
              modelo === 'classico' &&
                styles.resumeClassico,
              modelo === 'minimalista' &&
                styles.resumeMinimalista,
              modelo === 'moderno' &&
                styles.resumeModerno,
            ]}
          >
            {modelo === 'moderno' ? (
              <View
                style={[
                  styles.modernHeader,
                  {
                    backgroundColor:
                      corCurriculo,
                  },
                ]}
              >
                <Text style={styles.modernName}>
                  {nome}
                </Text>

                <Text
                  style={styles.modernContact}
                >
                  {email}
                </Text>

                {telefone ? (
                  <Text
                    style={styles.modernContact}
                  >
                    {telefone}
                  </Text>
                ) : null}
              </View>
            ) : (
              <View
                style={[
                  styles.resumeHeader,
                  {
                    borderBottomColor:
                      corCurriculo,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.resumeName,
                    modelo === 'minimalista' &&
                      styles.minimalistaName,
                  ]}
                >
                  {nome}
                </Text>

                <Text
                  style={styles.resumeContact}
                >
                  {email}
                </Text>

                {telefone ? (
                  <Text
                    style={styles.resumeContact}
                  >
                    {telefone}
                  </Text>
                ) : null}
              </View>
            )}

            {sobreMimFinal ? (
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: corCurriculo,
                    },
                    modelo === 'minimalista' &&
                      styles.minimalistaSectionTitle,
                  ]}
                >
                  SOBRE MIM
                </Text>

                <Text style={styles.description}>
                  {sobreMimFinal}
                </Text>
              </View>
            ) : null}

            {experiencias.length > 0 ? (
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: corCurriculo,
                    },
                    modelo === 'minimalista' &&
                      styles.minimalistaSectionTitle,
                  ]}
                >
                  EXPERIÊNCIA PROFISSIONAL
                </Text>

                {experiencias.map(
                  (experiencia, index) => (
                    <View
                      key={index}
                      style={styles.item}
                    >
                      <Text
                        style={styles.itemTitle}
                      >
                        {experiencia.cargo}
                      </Text>

                      <Text
                        style={styles.itemSubtitle}
                      >
                        {experiencia.empresa}
                      </Text>

                      <Text
                        style={styles.itemPeriod}
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
                          style={
                            styles.description
                          }
                        >
                          {experiencia.descricao}
                        </Text>
                      ) : null}
                    </View>
                  )
                )}
              </View>
            ) : null}

            {formacoes.length > 0 ? (
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: corCurriculo,
                    },
                    modelo === 'minimalista' &&
                      styles.minimalistaSectionTitle,
                  ]}
                >
                  FORMAÇÃO ACADÊMICA
                </Text>

                {formacoes.map(
                  (formacao, index) => (
                    <View
                      key={index}
                      style={styles.item}
                    >
                      <Text
                        style={styles.itemTitle}
                      >
                        {formacao.curso ||
                          formacao.nivel}
                      </Text>

                      {formacao.curso ? (
                        <Text
                          style={
                            styles.itemSubtitle
                          }
                        >
                          {formacao.instituicao}
                        </Text>
                      ) : null}

                      <Text
                        style={styles.itemSubtitle}
                      >
                        {formacao.nivel}
                      </Text>

                      <Text
                        style={styles.itemPeriod}
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
                )}
              </View>
            ) : null}

            {habilidadesFinais.length > 0 ? (
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: corCurriculo,
                    },
                    modelo === 'minimalista' &&
                      styles.minimalistaSectionTitle,
                  ]}
                >
                  HABILIDADES
                </Text>

                <View
                  style={styles.tagsContainer}
                >
                  {habilidadesFinais.map(
                    (habilidade, index) => (
                      <View
                        key={index}
                        style={[
                          styles.tag,
                          {
                            borderColor:
                              corCurriculo,
                          },
                        ]}
                      >
                        <Text
                          style={styles.tagText}
                        >
                          {habilidade}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            ) : null}

            {cursos.length > 0 ? (
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: corCurriculo,
                    },
                    modelo === 'minimalista' &&
                      styles.minimalistaSectionTitle,
                  ]}
                >
                  CURSOS E CERTIFICAÇÕES
                </Text>

                <View
                  style={styles.tagsContainer}
                >
                  {cursos.map(
                    (curso, index) => (
                      <View
                        key={index}
                        style={[
                          styles.tag,
                          {
                            borderColor:
                              corCurriculo,
                          },
                        ]}
                      >
                        <Text
                          style={styles.tagText}
                        >
                          {curso}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            ) : null}

            {ferramentasFinais.length > 0 ? (
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: corCurriculo,
                    },
                    modelo === 'minimalista' &&
                      styles.minimalistaSectionTitle,
                  ]}
                >
                  FERRAMENTAS E CONHECIMENTOS
                </Text>

                <View
                  style={styles.tagsContainer}
                >
                  {ferramentasFinais.map(
                    (ferramenta, index) => (
                      <View
                        key={index}
                        style={[
                          styles.tag,
                          {
                            borderColor:
                              corCurriculo,
                          },
                        ]}
                      >
                        <Text
                          style={styles.tagText}
                        >
                          {ferramenta}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text
              style={
                styles.secondaryButtonText
              }
            >
              Voltar
            </Text>
          </Pressable>

          <Pressable
            style={styles.primaryButton}
            onPress={gerarPDF}
          >
            <Text
              style={styles.primaryButtonText}
            >
              Gerar PDF
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  topBar: {
    height: 64,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButtonText: {
    fontSize: 28,
    color: '#1565C0',
  },

  topBarCenter: {
    flex: 1,
    alignItems: 'center',
  },

  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  topBarSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  topBarSpacer: {
    width: 40,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },

  resume: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 24,
    minHeight: 700,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  resumeModerno: {
    padding: 24,
    overflow: 'hidden',
  },

  resumeClassico: {
    borderRadius: 0,
  },

  resumeMinimalista: {
    borderRadius: 0,
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  modernHeader: {
    marginHorizontal: -24,
    marginTop: -24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    marginBottom: 26,
  },

  modernName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
  },

  modernContact: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.95,
    marginBottom: 3,
  },

  resumeHeader: {
    borderBottomWidth: 2,
    borderBottomColor: '#1565C0',
    paddingBottom: 18,
    marginBottom: 24,
  },

  resumeName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },

  minimalistaName: {
    fontWeight: '600',
  },

  resumeContact: {
    fontSize: 12,
    color: '#555555',
    marginBottom: 3,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1565C0',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    paddingBottom: 7,
    marginBottom: 14,
  },

  minimalistaSectionTitle: {
    borderBottomColor: '#333333',
    fontWeight: '600',
  },

  item: {
    marginBottom: 18,
  },

  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 4,
  },

  itemSubtitle: {
    fontSize: 13,
    color: '#555555',
    marginBottom: 3,
  },

  itemPeriod: {
    fontSize: 11,
    color: '#777777',
    marginBottom: 7,
  },

  description: {
    fontSize: 12,
    lineHeight: 18,
    color: '#444444',
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },

  tag: {
    backgroundColor: '#EEF2F7',
    borderRadius: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    marginRight: 5,
    marginBottom: 5,
    borderWidth: 1,
  },

  tagText: {
    fontSize: 11,
    color: '#333333',
  },

  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 10,
  },

  secondaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1565C0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1565C0',
  },

  primaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#1565C0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});