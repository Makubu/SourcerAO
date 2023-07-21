import { Route, Routes } from 'react-router-dom';
import IndexPage from '@app/pages';
import { configureChains, createConfig, sepolia, WagmiConfig } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { publicProvider } from 'wagmi/providers/public';

const { publicClient, webSocketPublicClient, chains } = configureChains(
  [sepolia], // mainnet in prod
  [publicProvider()],
);

const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient,
  webSocketPublicClient,
});

export default function App() {
  // const location = useLocation();
  // const navigate = useNavigate();

  return (
    <WagmiConfig config={config}>
      <Routes>
        <Route>
          <Route path="/" element={<IndexPage />} />
          {/* <Route path="/:projectId" element={<IndexPage />} /> */}
          {/* <Route path="/:userId" element={<IndexPage />} /> */}
        </Route>
      </Routes>
    </WagmiConfig>
  );
}
