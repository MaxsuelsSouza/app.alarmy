import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Switch, TouchableOpacity, RefreshControl } from 'react-native';
import DesafioModal from '@/components/DesafioModal';
import { Ionicons } from '@expo/vector-icons';
import {
  Container, Header, PremiumButton, PremiumText, NextAlarmTime,
  AlarmHeader, DayText, AlarmHour, Mission, Fab,
  DaysContainer
} from './styles';
import Card from '@/components/Card';
import { router, useFocusEffect } from 'expo-router';
import { API_URL } from '@/constants/api';

interface Alarme {
  id: number;
  horario: string;
  ativo: boolean;
  dificuldade: number;
  dias?: string[];
  missao?: string;
}

export default function AlarmeHomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [alarmes, setAlarmes] = useState<Alarme[]>([]);
  const [nextAlarmText, setNextAlarmText] = useState('Nenhum alarme');
  const [desafio, setDesafio] = useState<{ pergunta: string; nivel: number } | null>(null);
  const [resposta, setResposta] = useState('');
  const [resultado, setResultado] = useState<'correto' | 'incorreto' | null>(null);

  const dayMap: Record<string, number> = {
    DOM: 0,
    SEG: 1,
    TER: 2,
    QUA: 3,
    QUI: 4,
    SEX: 5,
    SAB: 6,
  };

  const calcularProximoAlarme = (lista: Alarme[]) => {
    const agora = new Date();
    let proximaData: Date | null = null;

    for (const alarm of lista) {
      if (!alarm.ativo) continue;
      const [hStr, mStr] = alarm.horario.split(':');
      const hora = parseInt(hStr, 10);
      const minuto = parseInt(mStr, 10);
      const dias = alarm.dias && alarm.dias.length
        ? alarm.dias
        : ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];

      for (const dia of dias) {
        const diaIdx = dayMap[dia.toUpperCase()];
        if (diaIdx === undefined) continue;
        const data = new Date(agora);
        data.setHours(hora, minuto, 0, 0);
        const diffDias = (diaIdx - data.getDay() + 7) % 7;
        data.setDate(agora.getDate() + diffDias);
        if (diffDias === 0 && data <= agora) {
          data.setDate(data.getDate() + 7);
        }

        if (!proximaData || data < proximaData) {
          proximaData = data;
        }
      }
    }

    if (proximaData) {
      const diffMs = proximaData.getTime() - agora.getTime();
      const totalMin = Math.ceil(diffMs / 60000);
      const horas = Math.floor(totalMin / 60);
      const minutos = totalMin % 60;
      return { horas, minutos };
    }
    return null;
  };

  const fetchAlarmes = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/alarmes`);
      const data = await res.json();
      setAlarmes(data);
      const prox = calcularProximoAlarme(data);
      if (prox) {
        const { horas, minutos } = prox;
        const horasTxt = horas > 0 ? `${horas} hr${horas > 1 ? 's' : ''}. ` : '';
        setNextAlarmText(`Tocará em ${horasTxt}${minutos} min.`);
      } else {
        setNextAlarmText('Nenhum alarme');
      }
    } catch (err) {
      console.error('Erro ao buscar alarmes', err);
    }
  }, []);

  useEffect(() => {
    fetchAlarmes();
  }, [fetchAlarmes]);

  useFocusEffect(
    useCallback(() => {
      fetchAlarmes();
    }, [fetchAlarmes])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAlarmes().finally(() => setRefreshing(false));
  }, [fetchAlarmes]);

  const toggleAtivo = async (id: number, ativo: boolean) => {
    try {
      const endpoint = ativo ? 'desativar' : 'ativar';
      const res = await fetch(`${API_URL}/alarmes/${id}/${endpoint}`, {
        method: 'PUT',
      });
      if (!res.ok) {
        throw new Error('Erro ao atualizar alarme');
      }
      await fetchAlarmes();
    } catch (err) {
      console.error('Erro ao atualizar alarme', err);
    }
  };

  const fetchDesafio = useCallback(async (nivel: number) => {
    try {
      const res = await fetch(`${API_URL}/desafio/${nivel}`);
      const data = await res.json();
      setDesafio({ pergunta: data.pergunta, nivel });
      setResposta('');
      setResultado(null);
    } catch (err) {
      console.error('Erro ao buscar desafio', err);
    }
  }, []);

  const validarResposta = async () => {
    if (!desafio) return;
    try {
      const res = await fetch(`${API_URL}/validar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pergunta: desafio.pergunta,
          respostaUsuario: resposta,
        }),
      });
      const data = await res.json();
      setResultado(data.correto ? 'correto' : 'incorreto');
    } catch (err) {
      console.error('Erro ao validar resposta', err);
    }
  };

  useEffect(() => {
    const verificar = () => {
      if (desafio) return;
      const agora = new Date();
      const horaAtual = agora.toTimeString().slice(0, 5);
      const dia = agora.getDay();
      for (const alarm of alarmes) {
        if (!alarm.ativo) continue;
        const dias = alarm.dias && alarm.dias.length
          ? alarm.dias
          : ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
        if (
          alarm.horario === horaAtual &&
          dias.map(d => dayMap[d.toUpperCase()]).includes(dia)
        ) {
          fetchDesafio(alarm.dificuldade);
          break;
        }
      }
    };
    verificar();
    const id = setInterval(verificar, 60000);
    return () => clearInterval(id);
  }, [alarmes, desafio, fetchDesafio]);

  return (
    <Container>
      <NextAlarmTime>{nextAlarmText}</NextAlarmTime>
      <FlatList
        data={alarmes}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/Home/detalhesAlarme/[id]', params: { id: item.id } })}>
            <Card ativo={item.ativo}>
              <AlarmHeader>
                <DaysContainer>
                  <React.Fragment>
                    {item.dias
                      ?.slice()
                      .sort(
                        (a, b) =>
                          (dayMap[a.toUpperCase()] ?? 7) -
                          (dayMap[b.toUpperCase()] ?? 7)
                      )
                      .map((dia, idx) => (
                        <DayText key={idx} active={item.ativo}>{dia}</DayText>
                      ))}
                  </React.Fragment>
                </DaysContainer>
                <Switch
                  value={item.ativo}
                  onValueChange={() => toggleAtivo(item.id, item.ativo)}
                />
              </AlarmHeader>
              <AlarmHour>{item.horario}</AlarmHour>
              <Mission>{item.missao ?? 'Missão'}</Mission>
            </Card>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
      />
      <Fab onPress={() => router.push('/(tabs)/Home/adicionar' as any)}>
        <Ionicons name="add" size={36} color="#fff" />
      </Fab>
      <DesafioModal
        visible={!!desafio}
        pergunta={desafio?.pergunta || ''}
        resposta={resposta}
        onChangeResposta={setResposta}
        onConfirm={validarResposta}
        onCancel={() => setDesafio(null)}
        resultado={resultado}
      />
    </Container>
  );
}
