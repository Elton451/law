import { Typography } from 'antd';
import styled from 'styled-components';
import { spacing } from '@shared/theme/tokens';

// Summary beside the content on desktop, below it on mobile (SB02).
export const Columns = styled.div`
  display: grid;
  gap: ${spacing.lg}px;

  @media (min-width: 992px) {
    grid-template-columns: minmax(0, 1fr) 360px;
    align-items: start;
  }
`;

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg}px;
  min-width: 0;
`;

export const Aside = styled.aside`
  min-width: 0;
`;

export const Section = styled.section`
  fieldset {
    border: 0;
    margin: 0;
    padding: 0;
  }
`;

export const SectionTitle = styled(Typography.Title)`
  &&& {
    font-size: 20px;
  }
`;
