import { router } from 'expo-router';
import { useState } from 'react';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
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

import { useCurriculo } from '@/context/CurriculoContext';

export default function CriarCurriculoScreen() {
  const {
    nome,
    email,
    telefone,
    setDadosPessoais,
  } = useCurriculo();

  const [emailError, setEmailError] = useState('');
  const [telefoneError, setTelefoneError] = useState('');

  function formatarTelefone(texto: string) {
    const numeros = texto
      .replace(/\D/g, '')
      .slice(0, 13);

    if (numeros.length === 0) {
      return '';
    }

    if (numeros.length <= 2) {
      return `+${numeros}`;
    }

    if (numeros.length <= 4) {
      return `+${numeros.slice(0, 2)} ${numeros.slice(2)}`;
    }

    return `+${numeros.slice(
      0,
      2
    )} ${numeros.slice(2, 4)} ${numeros.slice(4)}`;
  }

  function validarEmail(valor: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  function atualizarNome(valor: string) {
    setDadosPessoais({
      nome: valor,
      email,
      telefone,
    });
  }

  function atualizarEmail(valor: string) {
    setDadosPessoais({
      nome,
      email: valor,
      telefone,
    });

    setEmailError('');
  }

  function atualizarTelefone(valor: string) {
    setDadosPessoais({
      nome,
      email,
      telefone: formatarTelefone(valor),
    });

    setTelefoneError('');
  }

  function continuar() {
    let valido = true;

    setEmailError('');
    setTelefoneError('');

    if (!validarEmail(email.trim())) {
      setEmailError('Digite um e-mail válido.');
      valido = false;
    }

    const telefoneNumeros = telefone.replace(/\D/g, '');

    if (telefoneNumeros.length < 12) {
      setTelefoneError(
        'Digite um telefone válido com DDD.'
      );
      valido = false;
    }

    if (!valido) {
      return;
    }

    router.push('/experiencia');
  }

  const formularioValido =
    nome.trim().length > 0 &&
    email.trim().length > 0 &&
    telefone.replace(/\D/g, '').length >= 12;

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
                ETAPA 1 DE 6
              </Text>

              <Text style={styles.title}>
                Dados pessoais
              </Text>

              <Text style={styles.subtitle}>
                Vamos começar com algumas informações básicas
                para montar seu currículo.
              </Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>
                Nome completo *
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Digite seu nome"
                placeholderTextColor="#777777"
                value={nome}
                onChangeText={atualizarNome}
                autoCapitalize="words"
                returnKeyType="next"
              />

              <Text style={styles.label}>
                E-mail *
              </Text>

              <TextInput
                style={[
                  styles.input,
                  emailError !== '' &&
                    styles.inputError,
                ]}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#777777"
                value={email}
                onChangeText={atualizarEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />

              {emailError !== '' && (
                <Text style={styles.errorText}>
                  {emailError}
                </Text>
              )}

              <Text style={styles.label}>
                Telefone *
              </Text>

              <TextInput
                style={[
                  styles.input,
                  telefoneError !== '' &&
                    styles.inputError,
                ]}
                placeholder="+55 11 999999999"
                placeholderTextColor="#777777"
                value={telefone}
                onChangeText={atualizarTelefone}
                keyboardType="phone-pad"
                returnKeyType="done"
              />

              <Text style={styles.helperText}>
                Informe o número com código do país e DDD.
              </Text>

              {telefoneError !== '' && (
                <Text style={styles.errorText}>
                  {telefoneError}
                </Text>
              )}

              <Text style={styles.requiredText}>
                * Campos obrigatórios
              </Text>
            </View>
          </ScrollView>

          <View style={styles.buttons}>
            <Pressable
              onPress={continuar}
              disabled={!formularioValido}
              style={({ pressed }) => [
                styles.continueButton,
                !formularioValido &&
                  styles.continueButtonDisabled,
                pressed &&
                  formularioValido &&
                  styles.buttonPressed,
              ]}
            >
              <Text style={styles.continueButtonText}>
                Continuar
              </Text>
            </Pressable>

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
  },

  keyboardContainer: {
    flex: 1,
  },

  scroll: {
    flex: 1,
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

  form: {
    marginTop: 35,
    paddingBottom: 20,
  },

  label: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
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

  inputError: {
    borderColor: '#C62828',
  },

  helperText: {
    color: '#777777',
    fontSize: 12,
    marginTop: 7,
  },

  errorText: {
    color: '#C62828',
    fontSize: 12,
    marginTop: 6,
  },

  requiredText: {
    color: '#777777',
    fontSize: 12,
    marginTop: 20,
  },

  buttons: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },

  continueButton: {
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

  buttonPressed: {
    opacity: 0.7,
  },

  adContainer: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
});