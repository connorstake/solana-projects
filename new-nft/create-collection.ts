import { createNft , fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import {
    airdropIfRequired,
    getExplorerLink,
    getKeypairFromFile,
} from "@solana-developers/helpers";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";

import {Connection, LAMPORTS_PER_SOL, clusterApiUrl} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromFile();

// Airdrop some SOL to the user if required
await airdropIfRequired(connection, user.publicKey, 1 * LAMPORTS_PER_SOL, 0.5 * LAMPORTS_PER_SOL);

console.log("Loaded user", user.publicKey.toBase58());

const umi = createUmi(connection.rpcEndpoint);

umi.use(mplTokenMetadata())

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser))

console.log("Set up umi for user");

const collectionMint = generateSigner(umi);

const transaction = createNft(umi, {
    mint: collectionMint,
    name: "Mega Memes Collection",
    symbol: "MMC",
    uri: "https://raw.githubusercontent.com/connorstake/solana-projects/main/new-nft/metadata.json",
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true
});

await transaction.sendAndConfirm(umi)

const createdCollection = await fetchDigitalAsset(umi, collectionMint.publicKey)

console.log(`Created collection. Address is ${getExplorerLink("address", createdCollection.mint.publicKey, "devnet")}` );