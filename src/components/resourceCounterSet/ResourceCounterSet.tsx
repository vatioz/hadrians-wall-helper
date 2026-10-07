import Stack from '@mui/material/Stack';
import React from 'react';
import ResourceCounter from '../resourceCounter/ResourceCounter';
// import { CounterSetContainer } from './style';

interface Props {
  resourceAmount: { [key: string]: number };
  setResourceAmount: (key: string, amount: number) => void;
}

const ResourceCounterSet: React.FC<Props> = ({
  resourceAmount,
  setResourceAmount,
}) => {
  return (
    // <CounterSetContainer>
    <Stack sx={{ mt: 2 }}>
      {Object.entries(resourceAmount).map(([key, value]) => (
        <ResourceCounter
          textColor={key}
          colorText={key}
          value={value}
          setResourceAmount={setResourceAmount}
          key={`${key}-counter`}
        />
      ))}
    </Stack>
    // </CounterSetContainer>
  );
};

export default ResourceCounterSet;
