import React from 'react';
import { ResourceCounterCard } from './style';
import Grid from '@mui/material/Grid/Grid';
import { AppPrimaryButton, AppPrimaryText } from '../../App.styled';
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
        <AppPrimaryButton onClick={resetResourceAmount}>Clear</AppPrimaryButton>
      </Grid>
      <ResourceCounterSet
        resourceAmount={resourceAmount}
        setResourceAmount={changeResourceAmountByKey}
      />
    </ResourceCounterCard>
  );
};

export default ResourceCounterPanel;
