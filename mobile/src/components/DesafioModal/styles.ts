import styled from 'styled-components/native';

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
`;

export const Container = styled.View`
  background-color: #23242a;
  padding: 24px;
  border-radius: 16px;
  width: 80%;
`;

export const PerguntaText = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
`;

export const InputResposta = styled.TextInput<{ correct?: boolean; incorrect?: boolean }>`
  background-color: #181a20;
  color: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: ${({ correct, incorrect }) =>
    correct ? '#4bb543' : incorrect ? '#e11d48' : '#555'};
`;

export const ResultadoText = styled.Text<{ correct?: boolean }>`
  color: ${({ correct }) => (correct ? '#4bb543' : '#e11d48')};
  text-align: center;
  margin-bottom: 12px;
  font-weight: bold;
`;

export const ButtonsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const Button = styled.TouchableOpacity<{ variant: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ variant }) => (variant === 'primary' ? '#4bb543' : '#444')};
  margin-horizontal: 4px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  text-align: center;
`;
