import { Tag } from 'antd';
import { originLabel } from '@shared/case-studies/origin';
import type { CaseStudy } from '../../api/caseStudy';
import { Statement, Title, Wrapper } from './styles';

const CaseStatement = ({ caseStudy }: { caseStudy: CaseStudy }) => (
  <Wrapper>
    <Tag>{originLabel(caseStudy)}</Tag>
    <Title level={2}>{caseStudy.title}</Title>
    <Statement>{caseStudy.statement}</Statement>
  </Wrapper>
);

export default CaseStatement;
