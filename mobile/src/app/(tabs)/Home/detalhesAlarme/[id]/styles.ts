import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: #23242a;
  padding: 45px;
`;

export const MiddleContent = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const Header = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  position: relative;
  min-height: 36px;
`;

export const TimeToRing = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 17px;
`;

export const Preview = styled.Text`
  color: #aaa;
  font-size: 15px;
  padding: 5px;
  text-align: right;
`;


export const DiasRow = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-vertical: 12px;
`;

export const DiaBtn = styled.TouchableOpacity<{ ativo?: boolean }>`
  margin: 0 4px;
  padding: 7px;
  border-radius: 18px;
  border-width: 1px;
  border-color: ${({ ativo }) => (ativo ? "#7BA6FA" : "#555")};
  background-color: ${({ ativo }) => (ativo ? "#23242A" : "#181A20")};
`;

export const DiaText = styled.Text<{ ativo?: boolean }>`
  color: ${({ ativo }) => (ativo ? "#7BA6FA" : "#aaa")};
  font-weight: bold;
`;

export const MissaoBloco = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: 12px;
`;

export const MissaoLabel = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 17px;
  margin-right: 12px;
`;

export const MissaoItem = styled.TouchableOpacity`
  background-color: #e9f8ed;
  flex-direction: row;
  align-items: center;
  border-radius: 14px;
  padding: 10px;
  margin-right: 8px;
`;

export const MissaoLock = styled.View`
  background-color: #23242a;
  border-radius: 10px;
  border-width: 1px;
  border-color: #444;
  padding: 14px;
  margin-right: 8px;
`;

export const VolRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: 18px;
`;

export const SomRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 16px;
  border-bottom-width: 1px;
  border-color: #444;
`;

export const SomLabel = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 15px;
`;

export const SomNome = styled.Text`
  color: #fff;
  font-size: 15px;
  flex: 1;
  margin: 0 10px;
`;

export const BtnGravar = styled.TouchableOpacity`
  background-color: #f03a51;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  padding: 16px;
  margin-top: 32px;
`;
