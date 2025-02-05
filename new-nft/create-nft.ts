import { createNft , fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import {
    airdropIfRequired,
    getExplorerLink,
    getKeypairFromFile,
} from "@solana-developers/helpers";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity, percentAmount, publicKey } from "@metaplex-foundation/umi";

import {Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl} from "@solana/web3.js";

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

const collectionAddress = publicKey("BzKJSkoViPK6aY3a2f3yar3E17KAn6sUa3iesu4XKYgY")

console.log(`creating NFT...`)

const mint = generateSigner(umi);

const transaction = await createNft(umi, {
    mint,
    name: "My NFT",
    uri: "https://cryptonews.com/wp-content/uploads/2024/01/1705067977-dallc2b7e-2024-01-12-16-57-40-a-dynamic-scene-depicting-a-group-of-5-6-meme-coin-mascots-each-ready-to-fight-representing-various-cryptocurrencies-the-group-includes-the-dogecoi-min.png",
    sellerFeeBasisPoints: percentAmount(0),
    collection: {
        key: collectionAddress,
        verified : false
    }
})

await transaction.sendAndConfirm(umi);

const createdNFT = await fetchDigitalAsset(umi, mint.publicKey);

console.log(`Created NFT. Address is ${getExplorerLink("address", createdNFT.mint.publicKey, "devnet")}`);