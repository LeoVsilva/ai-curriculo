import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const mostrarEmBreve = () => {
    Alert.alert(
      'Em breve! 🚀',
      'Estamos trabalhando nessa funcionalidade para deixar seu currículo ainda melhor.\n\nA análise de currículo com IA estará disponível em breve!',
      [
        {
          text: 'Entendi',
          style: 'default',
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        {/* Cabeçalho */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.logo}>
            AI CV
          </ThemedText>

          <ThemedText type="title" style={styles.title}>
            Seu currículo,{'\n'}
            potencializado por IA.
          </ThemedText>

          <ThemedText style={styles.subtitle}>
            Crie um currículo profissional ou descubra
            como melhorar o seu em poucos minutos.
          </ThemedText>
        </ThemedView>

        {/* Botões principais */}
        <ThemedView style={styles.buttons}>

          <Pressable
            onPress={() => router.push('/criar-curriculo')}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <ThemedText style={styles.primaryButtonText}>
              Criar meu currículo
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={mostrarEmBreve}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <ThemedText style={styles.secondaryButtonText}>
              Analisar meu currículo
            </ThemedText>
          </Pressable>

        </ThemedView>

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

        {/* Rodapé */}
        <ThemedText style={styles.footer}>
          Inteligência artificial para destacar seu potencial.
        </ThemedText>

      </SafeAreaView>
    </ThemedView>
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
    justifyContent: 'space-between',
    paddingBottom: 30,
  },

  header: {
    marginTop: 70,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1565C0',
    marginBottom: 45,
  },

  title: {
    textAlign: 'center',
    fontSize: 32,
    lineHeight: 40,
    color: '#000000',
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
    color: '#333333',
  },

  buttons: {
    gap: 14,
    backgroundColor: '#FFFFFF',
  },

  primaryButton: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1565C0',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryButton: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1565C0',
    backgroundColor: '#FFFFFF',
  },

  secondaryButtonText: {
    color: '#1565C0',
    fontSize: 16,
    fontWeight: '600',
  },

  buttonPressed: {
    opacity: 0.75,
  },

  adContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    minHeight: 50,
  },

  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#333333',
  },
});