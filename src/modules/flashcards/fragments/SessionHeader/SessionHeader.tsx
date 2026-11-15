import { Eyebrow, Title, Wrapper } from './styles';

const SessionHeader = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <Wrapper>
    <Eyebrow>{eyebrow}</Eyebrow>
    <Title>{title}</Title>
  </Wrapper>
);

export default SessionHeader;
