import { Route, Routes } from 'react-router-dom';
import IndexPage from '@app/pages/index';
import ProjectPage from '@app/pages/project';
import UserPage from '@app/pages/user';
import { Container } from '@chakra-ui/react';

export default function App() {
  // const location = useLocation();
  // const navigate = useNavigate();

  return (
    <Container
      padding="2rem"
      paddingTop="1rem"
      width="100%"
      height="100%"
      maxW="none"
      margin="0"
      maxH="none"
    >
      <Routes>
        <Route>
          <Route path="/" element={<IndexPage />} />
          <Route path="/project/:projectId" element={<ProjectPage />} />
          <Route path="/user/:userId" element={<UserPage />} />
        </Route>
      </Routes>
    </Container>
  );
}
