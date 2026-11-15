import { Alert, Tag } from 'antd';
import Markdown from '@shared/components/Markdown/Markdown';
import { formatLabels } from '../../constants/markdownFormats';
import type { ParseResult } from '../../utils/parseFlashcardMarkdown';
import { Back, CardItem, CardMeta, Cards, Issues, Side, Summary, Wrapper } from './styles';

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

/** What the import will create, and what in the text needs attention. */
const ParsedCardsPreview = ({ result }: { result: ParseResult }) => {
  const errors = result.issues.filter((issue) => issue.severity === 'error');
  const warnings = result.issues.filter((issue) => issue.severity === 'warning');

  return (
    <Wrapper>
      <Summary aria-live="polite">
        {plural(result.cards.length, 'card encontrado', 'cards encontrados')}
      </Summary>

      {errors.length > 0 && (
        <Alert
          type="error"
          showIcon
          title={plural(errors.length, 'erro impede', 'erros impedem') + ' a importação'}
          description={
            <Issues>
              {errors.map((issue, index) => (
                <li key={index}>
                  Linha {issue.line}: {issue.message}
                </li>
              ))}
            </Issues>
          }
        />
      )}
      {warnings.length > 0 && (
        <Alert
          type="warning"
          showIcon
          title={plural(warnings.length, 'trecho ignorado', 'trechos ignorados')}
          description={
            <Issues>
              {warnings.map((issue, index) => (
                <li key={index}>
                  Linha {issue.line}: {issue.message}
                </li>
              ))}
            </Issues>
          }
        />
      )}

      {result.cards.length > 0 && (
        <Cards aria-label="Cards a importar">
          {result.cards.map((card, index) => (
            <CardItem key={index}>
              <CardMeta>
                <span>
                  #{index + 1} · linha {card.line}
                </span>
                <Tag>{formatLabels[card.format]}</Tag>
              </CardMeta>
              <Side>
                <Markdown>{card.front || '—'}</Markdown>
              </Side>
              <Back>
                <Markdown>{card.back || '—'}</Markdown>
              </Back>
            </CardItem>
          ))}
        </Cards>
      )}
    </Wrapper>
  );
};

export default ParsedCardsPreview;
