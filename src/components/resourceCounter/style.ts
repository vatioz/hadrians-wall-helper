import styled from 'styled-components';
export const CounterContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: auto;
  justify-content: space-between;
`;

export const ButtonSetContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: auto;
`;

export const StyledText = styled.span<{ color: string }>`
  font-size: 1.5em;
  text-align: left;
  padding: 0 0.5em 0;
  color: ${(props) => props.color};
  width: 3em;
`;

export const StyledNumberText = styled.span<{ color: string }>`
  font-size: 1.5em;
  text-align: center;
  padding: 0 0.5em 0;
  color: ${(props) => props.color};
  width: 1.25em;
`;
