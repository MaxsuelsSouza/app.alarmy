import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Container,
  Header,
  TimeToRing,
  PickerRow,
  PickerValue,
  PickerActive,
  PickerDots,
  DiasRow,
  DiaBtn,
  DiaText,
  BtnGravar,
  MiddleContent,
} from './styles';
import { useAdicionarAlarme } from './page';

const diasDaSemana = [
  { label: 'D', value: 'DOM' },
  { label: 'S', value: 'SEG' },
  { label: 'T', value: 'TER' },
  { label: 'Q', value: 'QUA' },
  { label: 'Q', value: 'QUI' },
  { label: 'S', value: 'SEX' },
  { label: 'S', value: 'SAB' },
];

export default function AdicionarAlarmeScreen() {
  const {
    hora,
    minuto,
    dias,
    toggleDia,
    salvarAlarme,
    incrementarHora,
    decrementarHora,
    incrementarMinuto,
    decrementarMinuto,
  } = useAdicionarAlarme();

  return (
    <Container>
      <Header>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/Home')}
          style={{ position: 'absolute', left: -28 }}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <TimeToRing style={{ alignSelf: 'center' }}>Adicionar Alarme</TimeToRing>
      </Header>

      <MiddleContent>
        <PickerRow>
          <TouchableOpacity onPress={decrementarHora}>
            <PickerValue>{(hora + 23) % 24}</PickerValue>
          </TouchableOpacity>
          <TouchableOpacity onPress={decrementarMinuto}>
            <PickerValue>{((minuto + 59) % 60).toString().padStart(2, '0')}</PickerValue>
          </TouchableOpacity>
        </PickerRow>
        <PickerRow>
          <PickerActive>{hora}</PickerActive>
          <PickerDots>:</PickerDots>
          <PickerActive>{minuto.toString().padStart(2, '0')}</PickerActive>
        </PickerRow>
        <PickerRow>
          <TouchableOpacity onPress={incrementarHora}>
            <PickerValue>{(hora + 1) % 24}</PickerValue>
          </TouchableOpacity>
          <TouchableOpacity onPress={incrementarMinuto}>
            <PickerValue>{((minuto + 1) % 60).toString().padStart(2, '0')}</PickerValue>
          </TouchableOpacity>
        </PickerRow>

        <DiasRow>
          {diasDaSemana.map(({ label, value }, idx) => (
            <DiaBtn
              key={idx}
              ativo={dias.includes(value)}
              onPress={() => toggleDia(value)}
            >
              <DiaText ativo={dias.includes(value)}>{label}</DiaText>
            </DiaBtn>
          ))}
        </DiasRow>

        <BtnGravar onPress={salvarAlarme}>
          <DiaText style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
            Gravar
          </DiaText>
        </BtnGravar>
      </MiddleContent>
    </Container>
  );
}
