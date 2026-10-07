import React from 'react';
import Grid from '@mui/material/Grid/Grid';
import Tooltip from '@mui/material/Tooltip';
import { AppPrimaryButton, AppPrimaryText, ResourceCounterCard } from '../../App.styled';
import ResourceCounterSet from '../resourceCounterSet';

interface Props {
  resourceAmount: { [key: string]: number };
  resetResourceAmount: () => void;
  changeResourceAmountByKey: (key: string, amount: number) => void;
}

const ResourceCounterPanel: React.FC<Props> = ({
  resourceAmount,
  resetResourceAmount,
  changeResourceAmountByKey,
}) => {
  return (
    <ResourceCounterCard key={`card-resource`}>
      <Grid item container direction='row' justifyContent='space-between'>
        <AppPrimaryText>Resource</AppPrimaryText>
        <Tooltip describeChild disableInteractive title='Set available resource counters to zero; keep cards, Neutral placements and Paths.'>
          <AppPrimaryButton onClick={resetResourceAmount}>Zero Resources</AppPrimaryButton>
        </Tooltip>
      </Grid>
      <ResourceCounterSet
        resourceAmount={resourceAmount}
        setResourceAmount={changeResourceAmountByKey}
      />
    </ResourceCounterCard>
  );
};

export default ResourceCounterPanel;
