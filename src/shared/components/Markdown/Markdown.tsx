import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prose } from './styles';

/**
 * Renders admin-written Markdown (bold, lists, quotes, code, tables). Raw HTML in
 * the text is shown as text, never rendered.
 */
const Markdown = ({ children }: { children: string }) => (
  <Prose>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
  </Prose>
);

export default Markdown;
