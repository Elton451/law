import { Button } from 'antd';
import { useNavigate } from 'react-router';
import { paths } from '@shared/routes';
import { ScrollIndicator, Slogan, Title, Wrapper } from './styles';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Slogan>desenrolando o direito</Slogan>
      <Title level={1}>Plataforma de Gestão de Conhecimento Jurídico</Title>
      <Button type="primary" size="large" onClick={() => navigate(paths.signUp)}>
        ✦ Começar a Desenrolar
      </Button>
      <ScrollIndicator>Role para explorar ↓</ScrollIndicator>
    </Wrapper>
  );
};

export default HeroSection;
