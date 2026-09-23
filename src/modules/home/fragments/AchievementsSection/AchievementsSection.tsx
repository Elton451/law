import SectionHeading from '../SectionHeading/SectionHeading';
import {
  AchievementCard,
  AchievementCriteria,
  AchievementGrid,
  AchievementIcon,
  AchievementName,
  LockedTag,
  Wrapper,
} from './styles';

type Conquista = {
  nome: string;
  icone: string;
  criterio: string;
  bloqueado: boolean;
};

const conquistas: Conquista[] = [
  {
    nome: 'Caçador de Casos',
    icone: '🎯',
    criterio: 'Acertou 10 questões seguidas',
    bloqueado: false,
  },
  {
    nome: 'Viciado em Catnip',
    icone: '🌿',
    criterio: 'Estudou 7 dias seguidos',
    bloqueado: false,
  },
  {
    nome: 'Mestre dos Novelos',
    icone: '🏆',
    criterio: 'Completou uma área do Direito',
    bloqueado: true,
  },
  {
    nome: 'Miauadvogado',
    icone: '⚖️',
    criterio: 'Concluiu 100 flashcards',
    bloqueado: true,
  },
];

const AchievementsSection = () => {
  return (
    <Wrapper id="conquistas">
      <SectionHeading
        eyebrow="Miaurquivos"
        title="Conquistas que valem o esforço"
        description="Cada avanço nos estudos desbloqueia uma conquista. Colecione, mostre e continue."
      />

      <AchievementGrid>
        {conquistas.map((conquista) => (
          <AchievementCard key={conquista.nome} $bloqueado={conquista.bloqueado}>
            <AchievementIcon>{conquista.icone}</AchievementIcon>
            <AchievementName level={5}>{conquista.nome}</AchievementName>
            <AchievementCriteria>{conquista.criterio}</AchievementCriteria>
            {conquista.bloqueado && <LockedTag>🔒 Bloqueado</LockedTag>}
          </AchievementCard>
        ))}
      </AchievementGrid>
    </Wrapper>
  );
};

export default AchievementsSection;
