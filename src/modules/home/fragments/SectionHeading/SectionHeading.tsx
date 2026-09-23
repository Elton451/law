import { Typography } from 'antd';
import type { ReactNode } from 'react';
import { Description, Eyebrow, Wrapper } from './styles';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
};

const SectionHeading = ({ eyebrow, title, description }: SectionHeadingProps) => {
  return (
    <Wrapper>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Typography.Title level={2}>{title}</Typography.Title>
      {description && <Description>{description}</Description>}
    </Wrapper>
  );
};

export default SectionHeading;
