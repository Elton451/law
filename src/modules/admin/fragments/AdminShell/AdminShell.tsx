import type { MenuProps } from 'antd';
import type { ReactNode } from 'react';
import { FaClone, FaFileLines, FaGavel, FaLayerGroup, FaPenNib, FaUsers } from 'react-icons/fa6';
import AppShell from '@shared/components/AppShell/AppShell';
import { paths } from '@shared/routes';

const adminMenuItems: NonNullable<MenuProps['items']> = [
  { key: paths.adminCases, icon: <FaGavel />, label: 'Casos concretos' },
  // Enabled as the other management areas land (US-021, US-022, US-023, US-025, US-026).
  { key: 'modulos', icon: <FaLayerGroup />, label: 'Módulos e lições', disabled: true },
  { key: 'resumos', icon: <FaFileLines />, label: 'Resumos', disabled: true },
  { key: 'flashcards', icon: <FaClone />, label: 'Flashcards', disabled: true },
  { key: 'pecas', icon: <FaPenNib />, label: 'Como fazer as peças', disabled: true },
  { key: 'usuarios', icon: <FaUsers />, label: 'Usuários', disabled: true },
];

/** Admin panel layout: the shared shell with the management areas menu (US-021). */
const AdminShell = ({ children }: { children: ReactNode }) => (
  <AppShell menuItems={adminMenuItems}>{children}</AppShell>
);

export default AdminShell;
