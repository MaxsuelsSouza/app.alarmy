import styled from 'styled-components/native';

export const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 0px;
`;

export const PickerValue = styled.Text`
  color: #888;
  font-size: 32px;
  margin: 0 30px;
  opacity: 0.5;
`;

export const PickerActive = styled(PickerValue)`
  color: #fff;
  font-size: 46px;
  opacity: 1;
  font-weight: bold;
`;

export const PickerDots = styled.Text`
  color: #fff;
  font-size: 44px;
  margin: 0 8px;
  font-weight: bold;
`;
