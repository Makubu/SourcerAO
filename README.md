# SourcerAO

 ![SourcerAO Logo](/fig/sourcerao_log.webp)

SourcerAO is a decentralized marketplace that connects contributors with people willing to fund open-source projects (or for instance new features on open-source projects). Funders lock their stakes into a communal bounty, developers apply and are elected through a DAO vote, and both sides post a bail to guarantee good behaviour. At delivery time, the DAO can settle disputes: arbitrators are selected based on reputation, are rewarded from the losing side’s bail, and decide how the bounty is split.

This codebase was produced during the ETHCC Paris 2023 hackathon and contains everything needed to run the end-to-end demo:

- **Smart contract (`blockchain/`)** – Hardhat project defining the `SourcerAO` contract, its DAO-powered governance, the full set of project states, and Hardhat tests that cover the happy path and litigation scenarios.
- **Backend API (`backend/`)** 
- **Frontend dApp (`frontend/`)** – Vite + React + Chakra UI dashboard that connects with MetaMask, uploads project briefs to IPFS, and orchestrates every interaction with the `SourcerAO` smart contract.
- **Pitch assets (`animation/`)** – Manim scripts that generate the animations used in the hackathon presentation.


## Core Workflow

1. **Create & describe a project**
   - Funders create a project from the dApp. The textual brief is uploaded to IPFS (`backend` → `ipfs`) and the IPFS CID is stored on-chain. The project can be a brand new initiative or a feature request on an existing open-source repo.
   - Funders can keep the project open, lock more bounty, or withdraw while the opportunity is still in the `OPEN` state.

2. **Developers apply**
   - Developers submit applications and optional CV links (stored in the contract).
   - Once the application window closes (or the creator forces it), the project enters `VOTE_PHASE`.

3. **DAO vote and bail lock**
   - Funders vote on the applicant list; the contract aggregates the weighted votes and emits a `dev_chosen` event.
   - The winner must deposit a bail that mirrors the community’s bail to enter the `PROGRESS` state.

4. **Delivery, acceptance, and payouts**
   - The developer works on the project off-chain and signals completion on the contract.
   - Funders vote to accept the delivered work (during a certain time window). If the work is accepted, the developer receives the bounty and both sides get their bails back.
   - If the work is rejected, a litigation process is initiated. A neutral party with enough on-chain reputation is picked as arbitrator and decides if the work should be accepted or not. He receives a reward from the losing side’s bail.

Here is a video walkthrough of the workflow and a demo of the dApp:

[![Alt text](/fig/sourcerao_vid.png)](https://drive.google.com/file/d/1cNU8hxFXLXyMZ6YrSaBrnPFyepohNaTE/view)


## Prerequisites

- **Node.js 18+** (required by Vite, pnpm, and Hardhat)
- **MetaMask** 
- **Python 3.10+ & Manim** (only if you plan to rebuild the pitch animations)
- **Docker** (optional, but the easiest way to run the backend together with an IPFS daemon)


## Run with Docker (includes IPFS)

```bash
cd backend
docker-compose up --build
```

This spins up:

- `backend` (the Koa app built from `dockerfile`)
- `ipfs` (Kubo node on ports `4001`, `5001`, `8080`)

The service expects to reach the IPFS daemon at `http://ipfs:5001/api/v0` (see `controller.ts`).

### Frontend dApp (`frontend/`)

#### Environment

Create `frontend/.env.local` (or `.env`) with your deployed contract address:

```
VITE_CONTRACT_ADDRESS=0xYourDeployedSourcerAOAddress
```

The dApp connects to Goerli via Infura by default (`hooks/index.ts`); adjust the provider if you deploy elsewhere.

The backend API base URL is currently set in `src/hooks/http.ts`. For local development you will likely want to replace `http://90.3.31.132:8081` with `http://localhost:8081`.

#### Install & run

```bash
cd frontend
pnpm install
pnpm dev
```

Open the printed Vite URL (default `http://localhost:5173`). Connect MetaMask to the same network your contract is deployed to, then:

- Create a project, enter title + Markdown-friendly description, and submit.
- Fund the project, apply as a developer, or progress the state through voting and completion.
- Explore `Project` pages to interact with the contract (fund, apply, vote, accept, close, trigger litigation).

The UI uses Chakra UI’s dark theme (fonts defined under `public/fonts`) and SWR for data revalidation (`revalidateProjects` ensures on-chain state stays fresh after each transaction).

## Animations (`animation/`)

The `animation` workspace contains Manim scenes that illustrate the SourcerAO workflow. You can regenerate them with:

```bash
cd animation
pip install -r requirements.txt  
make run                         # renders all scenes into media/videos/
```
