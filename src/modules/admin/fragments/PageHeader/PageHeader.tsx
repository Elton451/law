import type { ReactNode } from 'react';
import { Title, Wrapper } from './styles';

const PageHeader = ({ title, extra }: { title: string; extra?: ReactNode }) => (
  <Wrapper>
    <Title level={1}>{title}</Title>
    {extra}
  </Wrapper>
);

export default PageHeader;
