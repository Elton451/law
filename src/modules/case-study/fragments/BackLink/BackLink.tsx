import type { ReactNode } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { StyledLink } from './styles';

const BackLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <StyledLink to={to}>
    <FaArrowLeft aria-hidden />
    {children}
  </StyledLink>
);

export default BackLink;
