import React from 'react';
import { Modal } from 'react-native';
import {
  Overlay,
  Container,
  PerguntaText,
  InputResposta,
  ButtonsRow,
  Button,
  ButtonText,
  ResultadoText,
} from './styles';

interface DesafioModalProps {
  visible: boolean;
  pergunta: string;
  resposta: string;
  onChangeResposta: (text: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  resultado?: 'correto' | 'incorreto' | null;
}

export default function DesafioModal({
  visible,
  pergunta,
  resposta,
  onChangeResposta,
  onConfirm,
  onCancel,
  resultado,
}: DesafioModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <Overlay>
        <Container>
          <PerguntaText>{pergunta}</PerguntaText>
          <InputResposta
            value={resposta}
            onChangeText={onChangeResposta}
            keyboardType="numeric"
            correct={resultado === 'correto'}
            incorrect={resultado === 'incorreto'}
            placeholder="Sua resposta"
            placeholderTextColor="#999"
          />
          {resultado && (
            <ResultadoText correct={resultado === 'correto'}>
              {resultado === 'correto' ? 'Correto' : 'Resposta incorreta'}
            </ResultadoText>
          )}
          <ButtonsRow>
            <Button variant="secondary" onPress={onCancel}>
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button variant="primary" onPress={onConfirm}>
              <ButtonText>Enviar resposta</ButtonText>
            </Button>
          </ButtonsRow>
        </Container>
      </Overlay>
    </Modal>
  );
}
