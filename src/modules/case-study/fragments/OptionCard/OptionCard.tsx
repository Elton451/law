import type { ReactNode } from 'react';
import { Card, CardHeader, CardText, CardTitle, Eyebrow } from './styles';

type OptionCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  /** Shown at the right of the eyebrow (a tag, an info button). */
  aside?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
};

const OptionCard = ({
  eyebrow,
  title,
  description,
  aside,
  disabled,
  children,
}: OptionCardProps) => (
  <Card $disabled={disabled} aria-disabled={disabled || undefined}>
    <CardHeader>
      <Eyebrow>{eyebrow}</Eyebrow>
      {aside}
    </CardHeader>
    <CardTitle>{title}</CardTitle>
    <CardText>{description}</CardText>
    {children}
  </Card>
);

export default OptionCard;
