// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import vestingIDL from '../target/idl/vesting.json'
import type { Vesting } from '../target/types/vesting'

// Re-export the generated IDL and type
export { Vesting, vestingIDL }

// The programId is imported from the program IDL.
export const vesting_PROGRAM_ID = new PublicKey(vestingIDL.address)

// This is a helper function to get the Vesting Anchor program.
export function getvestingProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...vestingIDL, address: address ? address.toBase58() : vestingIDL.address } as Vesting, provider)
}

// This is a helper function to get the program ID for the Vesting program depending on the cluster.
export function getvestingProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Vesting program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return vesting_PROGRAM_ID
  }
}
