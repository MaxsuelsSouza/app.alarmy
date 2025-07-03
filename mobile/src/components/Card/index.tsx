import React from 'react';
import { CardContainer } from './styles';

export interface CardProps {
  children: React.ReactNode;
  ativo?: boolean;
}

export function Card({ children, ativo }: CardProps) {
  return <CardContainer ativo={ativo}>{children}</CardContainer>;
}

export default Card;
