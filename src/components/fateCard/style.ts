import Button from '@mui/material/Button/Button';
import styled from 'styled-components';

export const FateCardsContainer = styled.div`
  flex-direction: column;
  flex-wrap: auto;
  width: auto;
`;

export const ArrowLeftContainer = styled.div`
  width: auto;
`;

export const ArrowCenterContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: auto;
  width: auto;
  justify-content: center;
`;

export const ArrowRightContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: auto;
  justify-content: end;
`;

export const MiddleContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: auto;
  margin: 0 1em 0.5em;
  justify-content: space-between;
`;

export const ColorBoxContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: auto;
`;

export const NumberText = styled.span`
  font-size: 1.25em;
  text-align: center;
`;

export const CardPrimaryButton = styled(Button)<{ disabled?: boolean }>`
  border-radius: 20px !important;
  /* background-color: #c2442a !important; */
  background-color: ${(props) =>
    props.disabled ? 'black' : '#c2442a'} !important;
  color: #fff !important;
  margin: auto !important;
  &:hover {
    background-color: #d34f34 !important;
  }
`;
