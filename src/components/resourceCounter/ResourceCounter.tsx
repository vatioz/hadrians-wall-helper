import React from 'react';
import {
  // ButtonSetContainer,
  // CounterContainer,
  StyledNumberText,
  StyledText,
} from './style';
// import Grid from '@mui/material/Grid/Grid';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

interface Props {
  colorText: string;
  textColor: string;
  value: number;
  setResourceAmount: (key: string, amount: number) => void;
}

const ResourceCounter: React.FC<Props> = ({
  colorText,
  textColor,
  value,
  setResourceAmount,
}) => {
  // const [count, setCounter] = useState(0);
  const minus = () => {
    if (value > 0) {
      setResourceAmount(colorText, value - 1);
    }
  };

  const plus = () => {
    setResourceAmount(colorText, value + 1);
  };

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const color = textColor === 'brick' ? 'grey' : textColor;

  return (
    <Stack>
      <Grid
        container
        direction='row'
        sx={{ justifyContent: 'space-between' }}
        key={`${textColor}-counter-sub`}
      >
        <StyledText color={color}>
          {capitalizeFirstLetter(colorText)}
        </StyledText>
        {/* <ButtonSetContainer key={`${textColor}-button-set`}> */}
        <Grid>
          <Button onClick={minus}>-</Button>
          <StyledNumberText color='black'>{value}</StyledNumberText>
          <Button onClick={plus}>+</Button>
        </Grid>
        {/* </ButtonSetContainer> */}
      </Grid>
    </Stack>
  );
};

export default ResourceCounter;
