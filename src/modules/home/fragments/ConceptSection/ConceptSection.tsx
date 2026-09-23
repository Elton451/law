import { Progress } from 'antd';
import { colors } from '@shared/theme/tokens';
import SectionHeading from '../SectionHeading/SectionHeading';
import {
  Legend,
  LegendDescription,
  LegendItem,
  LegendStatus,
  NoveloArea,
  NoveloCard,
  NoveloGrid,
  Wrapper,
} from './styles';

const legendaStatus = [
  { status: 'Novelo fechado', descricao: 'Área não iniciada' },
  { status: '33% desenrolado', descricao: 'Estudando...' },
  { status: '66% desenrolado', descricao: 'Quase lá!' },
  { status: '✦ Área dominada', descricao: 'Completo ✦' },
];

const novelos = [
  { area: 'Constitucional', progresso: 72 },
  { area: 'Eleitoral', progresso: 30 },
  { area: 'Dir. Humanos', progresso: 55 },
  { area: 'Civil', progresso: 45 },
  { area: 'Proc. Civil', progresso: 20 },
  { area: 'Consumidor', progresso: 60 },
  { area: 'ECA', progresso: 15 },
  { area: 'Penal', progresso: 80 },
  { area: 'Proc. Penal', progresso: 35 },
  { area: 'Administrativo', progresso: 50 },
];

const ConceptSection = () => {
  return (
    <Wrapper id="os-novelos">
      <SectionHeading
        eyebrow="O conceito"
        title="Cada área do Direito é um Novelo"
        description="Dez novelos. Dez áreas do Direito. Cada um com sua cor, sua identidade, seu nível de progresso. Quanto mais você estuda, mais o novelo se desenrola."
      />

      <Legend>
        {legendaStatus.map((item) => (
          <LegendItem key={item.status}>
            <LegendStatus>{item.status}</LegendStatus>
            <LegendDescription>{item.descricao}</LegendDescription>
          </LegendItem>
        ))}
      </Legend>

      <NoveloGrid>
        {novelos.map((novelo) => (
          <NoveloCard key={novelo.area}>
            <NoveloArea>{novelo.area}</NoveloArea>
            <Progress
              type="circle"
              percent={novelo.progresso}
              size={72}
              strokeColor={colors.primary}
            />
          </NoveloCard>
        ))}
      </NoveloGrid>
    </Wrapper>
  );
};

export default ConceptSection;
