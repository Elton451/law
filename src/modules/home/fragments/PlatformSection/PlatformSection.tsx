import SectionHeading from '../SectionHeading/SectionHeading';
import {
  FeatureCard,
  FeatureDescription,
  FeatureGrid,
  FeatureIcon,
  FeatureName,
  Wrapper,
} from './styles';

type Funcionalidade = {
  nome: string;
  icone: string;
  descricao: string;
};

const funcionalidades: Funcionalidade[] = [
  {
    nome: 'Resumeow',
    icone: '📖',
    descricao: 'Informações jurídicas condensadas e objetivas. Estude qualquer tema em minutos.',
  },
  {
    nome: 'KittyCard',
    icone: '🃏',
    descricao: 'Flashcards para revisão e memorização. Fixe conceitos com repetição espaçada.',
  },
  {
    nome: 'CatClip',
    icone: '▶',
    descricao: 'Vídeo-aulas curtas e objetivas. Aprenda vendo, sem enrolação.',
  },
  {
    nome: 'MiauMap',
    icone: '🗺',
    descricao: 'Mapas mentais para visualizar relações entre conceitos jurídicos.',
  },
];

const PlatformSection = () => {
  return (
    <Wrapper id="o-que-e">
      <SectionHeading
        eyebrow="A plataforma"
        title="O que é o Novelo Jurídico?"
        description="Uma plataforma de gestão de conhecimento jurídico em microcápsulas de aprendizagem. Cada área do Direito é um novelo. Você estuda, avança, e vai desenrolando o Direito."
      />

      <FeatureGrid>
        {funcionalidades.map((funcionalidade) => (
          <FeatureCard key={funcionalidade.nome}>
            <FeatureIcon>{funcionalidade.icone}</FeatureIcon>
            <FeatureName level={5}>{funcionalidade.nome}</FeatureName>
            <FeatureDescription>{funcionalidade.descricao}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeatureGrid>
    </Wrapper>
  );
};

export default PlatformSection;
