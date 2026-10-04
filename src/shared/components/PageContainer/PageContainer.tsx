import type { ReactNode } from 'react';
import { Wrapper } from './styles';

const PageContainer = ({ children }: { children: ReactNode }) => <Wrapper>{children}</Wrapper>;

export default PageContainer;
