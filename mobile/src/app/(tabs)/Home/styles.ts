import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: #181a20;
  padding-top: 50px;
  padding-horizontal: 18px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 18px;
`;

export const PremiumButton = styled.TouchableOpacity`
  background-color: #ffb02e;
  border-radius: 20px;
  padding-horizontal: 14px;
  padding-vertical: 6px;
`;

export const PremiumText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

export const NextAlarmLabel = styled.Text`
  color: #999;
  font-size: 16px;
  margin-bottom: 6px;
`;

export const NextAlarmTime = styled.Text`
  color: #fff;
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 22px;
`;

export const AlarmCard = styled.View.attrs<{ ativo?: boolean }>(props => ({
  style: {
    opacity: props.ativo ? 1 : 0.4,
  },
}))`
  background-color: #23242a;
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 18px;
  position: relative;
`;

export const AlarmHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
  align-items: center;
`;

export const DayText = styled.Text<{ active?: boolean }>`
  font-weight: bold;
  font-size: 13px;
  letter-spacing: 0.5px;
  color: ${({ active }) => (active ? "#7BA6FA" : "#666")};
  margin-right: 7px;
`;

export const AlarmHour = styled.Text`
  font-size: 38px;
  color: #fff;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const Mission = styled.Text`
  color: #fff;
  font-size: 15px;
  margin-bottom: 5px;
`;

export const Fab = styled.TouchableOpacity`
  position: absolute;
  right: 26px;
  bottom: 46px;
  background-color: #f03a51;
  width: 62px;
  height: 62px;
  border-radius: 31px;
  justify-content: center;
  align-items: center;
  elevation: 8;
  shadow-color: #000;
  shadow-opacity: 0.3;
  shadow-offset: 0px 4px;
  shadow-radius: 8px;
`;

export const DaysContainer = styled.View`
  flex-direction: row;
  gap: 0px;
`;
