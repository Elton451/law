import { Button, Result } from 'antd';
import { useNavigate } from 'react-router';
import { paths } from '@shared/routes';

/** No edition open for this discipline: purchase disabled (US02). */
const NoOpenOffer = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="info"
      title="Sem turma disponível"
      subTitle="Ainda não há edição do exame aberta para este novelo. Consulte o calendário para as próximas datas."
      extra={[
        <Button key="buy" type="primary" disabled>
          Criar conta e continuar
        </Button>,
        <Button key="calendar" onClick={() => navigate(paths.homeSection('calendario'))}>
          Ver calendário
        </Button>,
      ]}
    />
  );
};

export default NoOpenOffer;
