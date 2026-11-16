import { Button } from 'antd';
import VideoPlaceholder from '../VideoPlaceholder/VideoPlaceholder';
import { Lead, Slogan, Title, Wrapper } from './styles';

const scrollToNovelos = () =>
  document.getElementById('novelos')?.scrollIntoView({ behavior: 'smooth' });

/** Opening: the practical-preparation pitch, "Escolher meu novelo" and the video area (SB01). */
const HeroSection = () => (
  <Wrapper>
    <Slogan>desenrolando o direito</Slogan>
    <Title level={1}>Treine para a 2ª fase da OAB como no dia da prova</Title>
    <Lead>
      Escolha sua disciplina, escreva peças e questões no formato do exame, compare com o espelho e
      acompanhe sua evolução.
    </Lead>
    <Button type="primary" size="large" onClick={scrollToNovelos}>
      Escolher meu novelo
    </Button>
    <VideoPlaceholder />
  </Wrapper>
);

export default HeroSection;
