import { Cell, CellLabel, Cells, Heading, Row, Text } from './styles';

type ComparisonRowProps = {
  label: string;
  expected: string;
  given: string;
};

/** One section of the piece: the answer key next to the student's answer (US-019). */
const ComparisonRow = ({ label, expected, given }: ComparisonRowProps) => (
  <Row>
    <Heading>{label}</Heading>
    <Cells>
      <Cell>
        <CellLabel>Gabarito</CellLabel>
        <Text>{expected}</Text>
      </Cell>
      <Cell $student>
        <CellLabel>Sua resposta</CellLabel>
        <Text $muted={!given.trim()}>{given.trim() ? given : 'Em branco'}</Text>
      </Cell>
    </Cells>
  </Row>
);

export default ComparisonRow;
