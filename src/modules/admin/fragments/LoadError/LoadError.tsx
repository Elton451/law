import { Button, Result } from 'antd';

const LoadError = ({ title, onRetry }: { title: string; onRetry: () => void }) => (
  <Result
    status="error"
    title={title}
    extra={
      <Button type="primary" onClick={onRetry}>
        Tentar novamente
      </Button>
    }
  />
);

export default LoadError;
