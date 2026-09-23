import { Typography } from 'antd';
import { Description, Heading, Sparkle, Wrapper } from './styles';

const FinalHighlightSection = () => {
  return (
    <Wrapper>
      <Sparkle>✦✦</Sparkle>
      <Heading>
        <Typography.Title level={2}>Você não está apenas estudando Direito.</Typography.Title>
        <Typography.Title level={2}>Você está desenrolando o Direito.</Typography.Title>
      </Heading>
      <Description>
        Com sequências de estudo, medalhas desbloqueáveis e um mapa visual do seu progresso, cada
        sessão tem significado e recompensa.
      </Description>
    </Wrapper>
  );
};

export default FinalHighlightSection;
