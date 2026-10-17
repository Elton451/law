import { Tag } from 'antd';
import type { CaseStudy } from '../../api';
import { originLabel } from '../../origin';
import { Statement, Title, Wrapper } from './styles';

const CaseStatement = ({ caseStudy }: { caseStudy: CaseStudy }) => (
  <Wrapper>
    <Tag>{originLabel(caseStudy)}</Tag>
    <Title level={2}>{caseStudy.title}</Title>
    <Statement>{caseStudy.statement}</Statement>
  </Wrapper>
);

export default CaseStatement;
