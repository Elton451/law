import { Collapse } from 'antd';
import { formatExamples } from '../../constants/markdownFormats';
import { Example, FormatBody, Formats, FormatTitle, Footnote } from './styles';

const MarkdownSyntaxHelp = () => (
  <Collapse
    size="small"
    items={[
      {
        key: 'formats',
        label: 'Formatos aceitos (Obsidian Spaced Repetition)',
        children: (
          <>
            <Formats>
              {formatExamples.map(({ title, example, note }) => (
                <div key={title}>
                  <FormatTitle>{title}</FormatTitle>
                  <FormatBody>
                    <Example>{example}</Example>
                    {note}
                  </FormatBody>
                </div>
              ))}
            </Formats>
            <Footnote>
              Separe os cards com uma linha em branco. Frontmatter, títulos, tags (#flashcards) e
              comentários de agendamento (&lt;!--SR:...--&gt;) são ignorados, então dá para colar a
              nota inteira. **Negrito** continua sendo formatação, não lacuna.
            </Footnote>
          </>
        ),
      },
    ]}
  />
);

export default MarkdownSyntaxHelp;
