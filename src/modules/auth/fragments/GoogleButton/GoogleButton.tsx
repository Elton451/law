import { Button } from 'antd';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

type GoogleButtonProps = { onClick: () => Promise<unknown> };

/** "Continuar com Google" (SB03). The page leaves for Google on success. */
const GoogleButton = ({ onClick }: GoogleButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="large"
      block
      icon={<FcGoogle aria-hidden />}
      loading={loading}
      onClick={handleClick}
    >
      Continuar com Google
    </Button>
  );
};

export default GoogleButton;
