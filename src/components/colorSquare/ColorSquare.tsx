import React from 'react';
import { ColorBox } from './style';

interface Props {
  color: string;
}

const ColorSquare: React.FC<Props> = ({ color }) => <ColorBox color={color} />;

export default ColorSquare;
