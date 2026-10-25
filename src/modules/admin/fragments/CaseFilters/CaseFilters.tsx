import { Select } from 'antd';
import type { CaseOrigin } from '@shared/case-studies/origin';
import type { CaseFilters as Filters, Trail } from '../../api';
import { Wrapper } from './styles';

const originOptions: { value: CaseOrigin; label: string }[] = [
  { value: 'oab', label: 'OAB' },
  { value: 'autoral', label: 'Autoral' },
];

type CaseFiltersProps = {
  trails: Trail[];
  filters: Filters;
  onChange: (filters: Filters) => void;
};

const CaseFilters = ({ trails, filters, onChange }: CaseFiltersProps) => (
  <Wrapper>
    <Select
      aria-label="Filtrar por trilha"
      placeholder="Todas as trilhas"
      allowClear
      value={filters.trailId}
      options={trails.map(({ id, name }) => ({ value: id, label: name }))}
      onChange={(trailId?: string) => onChange({ ...filters, trailId })}
    />
    <Select
      aria-label="Filtrar por origem"
      placeholder="Todas as origens"
      allowClear
      value={filters.origin}
      options={originOptions}
      onChange={(origin?: CaseOrigin) => onChange({ ...filters, origin })}
    />
  </Wrapper>
);

export default CaseFilters;
