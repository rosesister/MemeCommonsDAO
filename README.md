# MemeCommonsDAO# MemeCommonsDAO

A decentralized platform for curating, licensing, and monetizing memes — empowering creators, protecting intellectual property, and enabling community-led governance of internet culture.

---

## Overview

MemeCommonsDAO is made up of ten Clarity smart contracts that work together to form a meme-powered Web3 ecosystem, where creators are rewarded, content is curated transparently, and commercial licensing is easy and compliant:

1. **Meme NFT Contract** – Mints and manages meme NFTs with embedded licenses.
2. **Creator Registry Contract** – Verifies and tracks meme creators and contributors.
3. **Curation DAO Contract** – Allows users to stake and vote on meme quality and categorization.
4. **Licensing Vault Contract** – Facilitates commercial meme licensing with on-chain proof.
5. **Tipping & Rewards Contract** – Enables tipping and quadratic funding for creators.
6. **Meme Derivatives Contract** – Handles remix attribution and revenue splits.
7. **Dispute Resolution Contract** – Resolves content originality and plagiarism disputes.
8. **Governance Contract** – Powers DAO voting, proposal creation, and parameter updates.
9. **$MEME Token Contract** – Provides a utility token for governance, staking, and rewards.
10. **Meme Oracle Integration Contract** – Brings off-chain meme trend data on-chain.

---

## Features

- **Meme NFTs** with licensing metadata and remix tracking  
- **Verified creator registry** for attribution and reputation  
- **DAO-based meme curation** with stake-slashing for spam resistance  
- **Automated licensing system** with commercial usage proof  
- **Tipping and quadratic funding** to support underdog creators  
- **Revenue sharing** between original creators and derivative authors  
- **Dispute arbitration** handled by community jurors  
- **Modular DAO governance** with proposals and voting  
- **Utility token ($MEME)** to power the ecosystem  
- **On-chain meme trend tracking** via oracle feeds  

---

## Smart Contracts

### Meme NFT Contract
- Mint, transfer, and burn meme NFTs  
- Embedded license type (e.g., CC0, custom, commercial)  
- Metadata includes meme format, tags, and origin  

### Creator Registry Contract
- Register and verify meme creators  
- Supports pseudonymous or ENS-linked identities  
- Contributor profiles with reputation score tracking  

### Curation DAO Contract
- Stake-based meme voting system  
- Curators tag, rank, and categorize memes  
- Misuse slashing and incentive rewards  

### Licensing Vault Contract
- Smart licensing purchase with on-chain receipt  
- Auto-revenue split between DAO and creators  
- Proof-of-license token issuance  

### Tipping & Rewards Contract
- Allows micro-donations to creators in STX or $MEME  
- Supports quadratic funding rounds  
- Leaderboards and engagement tracking  

### Meme Derivatives Contract
- Link derivative memes to originals  
- Track remix trees  
- Auto-split licensing and tipping income  

### Dispute Resolution Contract
- Handles disputes over plagiarism and licensing  
- Jury-based system using randomly selected stakers  
- Escrow and reward for jurors  

### Governance Contract
- Proposal creation, voting, and execution  
- Role-based permissions (curator, juror, mod)  
- DAO parameter updates (fees, slashing rates, etc.)

### $MEME Token Contract
- Mint and distribute $MEME utility tokens  
- Used for governance, staking, tipping, and rewards  
- Inflationary with partial burn on licensing events  

### Meme Oracle Integration Contract
- Pulls trending meme usage data from Web2 sources  
- Influences reward pools and trending tags  
- Optional incentive multiplier for viral content  

---

## Installation

1. Install [Clarinet CLI](https://docs.hiro.so/clarinet/getting-started)
2. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/memecommonsdao.git
   ```
3. Run tests:
    ```bash
    npm test
    ```
4. Deploy contracts:
    ```bash
    clarinet deploy
    ```

## Usage

Each contract is modular and can be integrated independently or as part of the full DAO flow. Use the Creator Registry to onboard artists, mint NFTs via the Meme NFT contract, and start governance or licensing flows through the DAO and Vault modules.

Refer to the /contracts directory for full contract definitions and /tests for usage examples.

## License

MIT License