import styled from 'styled-components';
import Box from '@mui/material/Box/Box';

export const ColorBox = styled(Box)<{
  color: string;
}>`
  width: 1.25em;
  height: 1.25em;
  background-color: ${(props) => props.color};
  margin: 0.5em 0.5em 1em 0.5em;
`;
