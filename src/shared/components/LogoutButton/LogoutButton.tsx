import { Button } from 'antd';
import { signOut } from '@shared/auth/authService';

const LogoutButton = () => <Button onClick={() => void signOut()}>Sair</Button>;

export default LogoutButton;
