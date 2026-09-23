import { Button } from 'antd';
import { ScrollIndicator, Slogan, Title, Wrapper } from './styles';

const HeroSection = () => {
  return (
    <Wrapper>
      <Slogan>desenrolando o direito</Slogan>
      <Title level={1}>Plataforma de Gestão de Conhecimento Jurídico</Title>
      <Button type="primary" size="large">
        ✦ Começar a Desenrolar
      </Button>
      <ScrollIndicator>Role para explorar ↓</ScrollIndicator>
    </Wrapper>
  );
};

export default HeroSection;
