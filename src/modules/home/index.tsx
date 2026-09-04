import { Layout } from 'antd';
import { Header } from 'antd/es/layout/layout';
import Navbar from '@shared/components/navbar/Navbar';

const Home = () => {
  return (
    <main>
      <Layout>
        <Header>
          <Navbar />
        </Header>
      </Layout>
    </main>
  );
};

export default Home;
