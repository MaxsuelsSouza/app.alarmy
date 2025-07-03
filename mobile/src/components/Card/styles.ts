import styled from 'styled-components/native';

export const CardContainer = styled.View<{ ativo?: boolean }>`
  background-color: #23242a;
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 18px;
  position: relative;
  opacity: ${({ ativo }) => (ativo ? 1 : 0.4)};
`;
