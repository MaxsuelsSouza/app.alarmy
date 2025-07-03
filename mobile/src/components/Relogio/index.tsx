import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Row, PickerValue, PickerActive, PickerDots } from './styles';

interface RelogioProps {
  hora: number;
  minuto: number;
  incrementarHora: () => void;
  decrementarHora: () => void;
  incrementarMinuto: () => void;
  decrementarMinuto: () => void;
}

export default function Relogio({
  hora,
  minuto,
  incrementarHora,
  decrementarHora,
  incrementarMinuto,
  decrementarMinuto,
}: RelogioProps) {
  return (
    <>
      <Row>
        <TouchableOpacity onPress={decrementarHora}>
          <PickerValue>{(hora + 23) % 24}</PickerValue>
        </TouchableOpacity>
        <TouchableOpacity onPress={decrementarMinuto}>
          <PickerValue>
            {((minuto + 59) % 60).toString().padStart(2, '0')}
          </PickerValue>
        </TouchableOpacity>
      </Row>
      <Row>
        <PickerActive>{hora}</PickerActive>
        <PickerDots>:</PickerDots>
        <PickerActive>{minuto.toString().padStart(2, '0')}</PickerActive>
      </Row>
      <Row>
        <TouchableOpacity onPress={incrementarHora}>
          <PickerValue>{(hora + 1) % 24}</PickerValue>
        </TouchableOpacity>
        <TouchableOpacity onPress={incrementarMinuto}>
          <PickerValue>
            {((minuto + 1) % 60).toString().padStart(2, '0')}
          </PickerValue>
        </TouchableOpacity>
      </Row>
    </>
  );
}
