import { Alert } from 'antd';
import type { ReactNode } from 'react';
import { Wrapper } from './styles';

type AuthNoticeProps = {
  type: 'info' | 'warning' | 'success' | 'error';
  title: ReactNode;
  description?: ReactNode;
};

/** A message above an auth form, announced by screen readers. */
const AuthNotice = ({ type, title, description }: AuthNoticeProps) => (
  <Wrapper>
    <Alert type={type} showIcon title={title} description={description} role="alert" />
  </Wrapper>
);

export default AuthNotice;
