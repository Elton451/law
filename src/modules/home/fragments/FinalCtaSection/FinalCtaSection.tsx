import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router';
import { paths } from '@shared/routes';
import { Actions, Description, Icon, Wrapper } from './styles';

const FinalCtaSection = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Icon>🧶</Icon>
      <Typography.Title level={2}>Comece a desenrolar agora</Typography.Title>
      <Description>
        Acesse os 10 novelos jurídicos, estude em microcápsulas e acompanhe seu progresso de forma
        visual, gamificada e elegante.
      </Description>
      <Actions>
        <Button type="primary" size="large" onClick={() => navigate(paths.signUp)}>
          ✦ Começar gratuitamente
        </Button>
        <Button size="large" onClick={() => navigate(paths.login)}>
          Já tenho conta
        </Button>
      </Actions>
    </Wrapper>
  );
};

export default FinalCtaSection;
