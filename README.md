# PulseFi

Staking platform.

🪙 Multi-Token Staking Platform (Solana + Anchor + Rust + Next.js)

A multi-token staking platform built on the Solana blockchain, powered by the Anchor framework.
On the first login, a user automatically gets an on-chain account that stores their public key, registration timestamp, and a record of any tokens they decide to stake later.

When tokens are staked, a second account is created — its address is deterministically derived from the user’s public key and the token mint.
This account holds:
	•	the token mint address,
	•	the total staked amount,
	•	the amount of rewards already paid,
	•	the timestamp of the last payout,
	•	and the associated token account (ATA).

In parallel, the server performs secure authentication using Ed25519 cryptographic signatures.
Signatures are verified and cached via Redis, while user statistics and metadata (nickname, rewards history, last activity, etc.) are stored in PostgreSQL.
Authentication is handled through HTTP-only JWT cookies for security.

By leveraging Solana, the platform ensures transparent and trustless financial operations, while the server side keeps non-critical data off-chain, reducing unnecessary blockchain costs.

⸻

🧩 Tech Stack

Frontend:
Next.js / React / TypeScript / Solana Web3.js / Anchor / TailwindCSS / Zustand / React Query

Backend:
Rust / Actix-web / Redis / PostgreSQL / SHA-2 cryptography



How to deploy lochal?

use " yarn dev " for start front
use " solana-test-validator " to start lochal blockchain node
use " anchor build / anchor deploy " to compile and deploy your smart to chain



NOTE for developers!

Dev-tools (just remove before deploy to main / testnet)
1) Some fn in ./src/helpers/helpers.dev/...
2) Add .env with server address


Created by Rasputin Egor