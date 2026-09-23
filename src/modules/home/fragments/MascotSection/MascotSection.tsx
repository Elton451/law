import { Typography } from 'antd';
import { Description, Inner, MascotBreed, MascotName, Phrase, Sparkle, Wrapper } from './styles';

const MascotSection = () => {
  return (
    <Wrapper>
      <Inner>
        <Sparkle>✦✦✦</Sparkle>
        <Typography.Title level={2}>Seu companheiro de estudos</Typography.Title>
        <MascotName>
          Miaudante <MascotBreed>· British Longhair</MascotBreed>
        </MascotName>
        <Description>
          estará ao seu lado em cada sessão de estudos. Ele reage às suas conquistas, comemora seus
          acertos e nunca deixa você desanimar.
        </Description>
        <Phrase>
          “Porque estudar Direito não precisa ser solitário nem entediante. Com o Novelo Jurídico,
          você transforma conhecimento em uma jornada.”
        </Phrase>
      </Inner>
    </Wrapper>
  );
};

export default MascotSection;
