import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { API_URL } from '@/constants/api';

export function useDetalhesAlarme() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [hora, setHora] = useState(17);
  const [minuto, setMinuto] = useState(10);
  const [dias, setDias] = useState<string[]>(['SEG', 'TER', 'QUA', 'QUI', 'SEX']);

  const incrementarHora = () => setHora(h => (h + 1) % 24);
  const decrementarHora = () => setHora(h => (h + 23) % 24);
  const incrementarMinuto = () => setMinuto(m => (m + 1) % 60);
  const decrementarMinuto = () => setMinuto(m => (m + 59) % 60);

  const toggleDia = (dia: string) => {
    setDias(prev =>
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    );
  };

  const salvarAlteracoes = async () => {
    if (!id) return;
    const horario = `${hora.toString().padStart(2, '0')}:${minuto
      .toString()
      .padStart(2, '0')}`;

    try {
      const res = await fetch(`${API_URL}/alarmes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ horario, dias }),
      });

      if (!res.ok) {
        throw new Error('Erro ao atualizar alarme');
      }

      router.push('/(tabs)/Home');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível atualizar o alarme.');
    }
  };

  const excluirAlarme = async () => {
    if (!id) return;
    try {
      const res = await fetch(`${API_URL}/alarmes/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Erro ao excluir alarme');
      }
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível excluir o alarme.');
    }
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/alarmes/${id}`);
        const data = await res.json();
        if (data.horario) {
          const [h, m] = data.horario.split(':').map(Number);
          setHora(h);
          setMinuto(m);
        }
        if (Array.isArray(data.dias)) {
          setDias(data.dias);
        }
      } catch (err) {
        console.error('Erro ao buscar alarme:', err);
      }
    })();
  }, [id]);

  return {
    hora,
    minuto,
    dias,
    incrementarHora,
    decrementarHora,
    incrementarMinuto,
    decrementarMinuto,
    toggleDia,
    salvarAlteracoes,
    excluirAlarme,
  };
}

