// Initialize the Ethers.js provider and signer
let provider;
let signer;
let contract;

const stakingContractAddress = '0xBEc49fA140aCaA83533fB00A2BB19bDdd0290f25'; // Replace with your contract address
const stakingABI = [
  {
    "inputs": [
      {
        "internalType": "contract IMintableToken",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_claimInterval",
        "type": "uint256"
      },
      {
        "internalType": "contract IERC721",
        "name": "_nft",
        "type": "address"
      },
      {
        "internalType": "contract nftIface",
        "name": "_ifacenft",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "staker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ClaimedRewards",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "staker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Staked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "staker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Unstaked",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_staker",
        "type": "address"
      }
    ],
    "name": "calculatePendingRewards",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "unstake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Load the contract
async function loadContract() {
  try {
    if (typeof window.ethereum !== 'undefined') {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      contract = new ethers.Contract(stakingContractAddress, stakingABI, signer);
      console.log('Contract loaded:', contract); // Check if the contract is loaded correctly
    } else {
      throw new Error('MetaMask is not installed!');
    }
  } catch (error) {
    console.error('Error loading contract:', error);
  }
}

// Connect wallet
document.getElementById('connectWallet').addEventListener('click', async () => {
  try {
    await provider.send("eth_requestAccounts", []);
    const walletAddress = await signer.getAddress();
    document.getElementById('walletAddress').textContent = `Connected: ${walletAddress}`;
  } catch (error) {
    console.error('Error connecting wallet:', error);
  }
});

// Stake Tokens
document.getElementById('stakeTokens').addEventListener('click', async () => {
  try {
    const amount = document.getElementById('stakeAmount').value;
    if (!contract.stake) {
      throw new Error('Stake function not found in contract.');
    }
    const tx = await contract.stake(ethers.utils.parseUnits(amount, 18)); // Assuming 18 decimals
    await tx.wait();
    alert('Stake transaction confirmed!');
  } catch (error) {
    console.error('Staking failed:', error);
  }
});

// Unstake Tokens (with user input)
document.getElementById('unstakeTokens').addEventListener('click', async () => {
  try {
    const amount = document.getElementById('unstakeAmount').value; // Get user input for unstake
    if (!contract.unstake) {
      throw new Error('Unstake function not found in contract.');
    }
    const tx = await contract.unstake(ethers.utils.parseUnits(amount, 18)); // Assuming 18 decimals
    await tx.wait();
    alert('Unstake transaction confirmed!');
  } catch (error) {
    console.error('Unstaking failed:', error);
  }
});

// Claim Rewards
document.getElementById('claimRewards').addEventListener('click', async () => {
  try {
    const tx = await contract.claimRewards();
    await tx.wait();
    alert('Rewards claimed!');
  } catch (error) {
    console.error('Claim rewards failed:', error);
  }
});

// Initialize app
window.onload = async () => {
  await loadContract();
};
