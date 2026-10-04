import { Result } from 'antd';

const ConfirmEmailNotice = ({ email }: { email: string }) => (
  <Result
    status="success"
    title="Confirme seu e-mail"
    subTitle={`Se ainda não houver uma conta com ${email}, enviamos um link de confirmação para ativá-la. Se você já tem conta, é só entrar.`}
  />
);

export default ConfirmEmailNotice;
