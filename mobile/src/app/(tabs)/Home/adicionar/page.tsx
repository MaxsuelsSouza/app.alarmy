import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { API_URL } from '@/constants/api';

export function useAdicionarAlarme() {
  const [hora, setHora] = useState(17);
  const [minuto, setMinuto] = useState(10);
  const [dias, setDias] = useState<string[]>(['SEG', 'TER', 'QUA', 'QUI', 'SEX']);

  const toggleDia = (dia: string) => {
    setDias(prev =>
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    );
  };

  const salvarAlarme = async () => {
    const horario = `${hora.toString().padStart(2, '0')}:${minuto
      .toString()
      .padStart(2, '0')}`;

    try {
      const res = await fetch(`${API_URL}/alarmes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          horario,
          dificuldade: 2,
          dias,
        }),
      });

      if (!res.ok) {
        throw new Error('Erro ao salvar alarme');
      }

      router.push('/(tabs)/Home');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível salvar o alarme.');
    }
  };

  const incrementarHora = () => setHora(h => (h + 1) % 24);
  const decrementarHora = () => setHora(h => (h + 23) % 24);
  const incrementarMinuto = () => setMinuto(m => (m + 1) % 60);
  const decrementarMinuto = () => setMinuto(m => (m + 59) % 60);

  return {
    hora,
    minuto,
    dias,
    toggleDia,
    salvarAlarme,
    incrementarHora,
    decrementarHora,
    incrementarMinuto,
    decrementarMinuto,
  };
}
