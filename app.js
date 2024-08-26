// app.js
const { ethers } = window.ethers;
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

// Contract Addresses
const nftContractAddress = 'YOUR_NFT_CONTRACT_ADDRESS';
const stakingContractAddress = 'YOUR_STAKING_CONTRACT_ADDRESS';

// Contract ABIs
const nftAbi = [
    // Paste your NFT contract ABI here
];

const stakingAbi = [
    // Paste your Staking contract ABI here
];

// UI Elements
const connectWalletButton = document.getElementById('connectWallet');
const disconnectWalletButton = document.getElementById('disconnectWallet');
const userAddressSpan = document.getElementById('userAddress');
const walletInfoDiv = document.getElementById('walletInfo');
const output = document.getElementById('output');

// NFT Operation Buttons
const mintNFTButton = document.getElementById('mintNFT');
const burnNFTButton = document.getElementById('burnNFT');
const burnTokenIdInput = document.getElementById('burnTokenId');

// Staking Operation Buttons
const stakeTokensButton = document.getElementById('stakeTokens');
const unstakeTokensButton = document.getElementById('unstakeTokens');
const calculateRewardsButton = document.getElementById('calculateRewards');

// Web3Modal instance
let web3Modal;
let provider;
let signer;
let nftContract;
let stakingContract;

// Initialize Web3Modal
function initWeb3Modal() {
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider, // required
            options: {
                rpc: {
                    1: "https://mainnet.infura.io/v3/YOUR_INFURA_ID",  // Mainnet (can be replaced with another RPC)
                    3: "https://public-rpc-url-for-ropsten.com",       // Ropsten (example public RPC URL)
                    4: "https://public-rpc-url-for-rinkeby.com",       // Rinkeby (example public RPC URL)
                    42: "https://public-rpc-url-for-kovan.com",        // Kovan (example public RPC URL)
                    137: "https://polygon-rpc.com/",                   // Polygon Mainnet (example public RPC URL)
                    // Add other networks you want to support here
                },
                // Additional WalletConnect options
                // For example, chainId, qrcode, etc.
            }
        },
        // Additional provider options can go here
    };

    web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions, // required
        theme: "light", // optional, can be "dark"
    });
}

// Connect Wallet Function
async function connectWallet() {
    try {
        // Open Web3Modal to connect
        const instance = await web3Modal.connect();

        // Create Ethers provider
        provider = new ethers.providers.Web3Provider(instance);

        // Get the signer
        signer = provider.getSigner();

        // Get user address
        const address = await signer.getAddress();
        userAddressSpan.innerText = address;
        walletInfoDiv.style.display = 'block';
        connectWalletButton.style.display = 'none';
        disconnectWalletButton.style.display = 'inline-block';

        // Initialize contracts
        nftContract = new ethers.Contract(nftContractAddress, nftAbi, signer);
        stakingContract = new ethers.Contract(stakingContractAddress, stakingAbi, signer);

        // Subscribe to provider events
        instance.on("accountsChanged", (accounts) => {
            console.log('Accounts changed:', accounts);
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                userAddressSpan.innerText = accounts[0];
            }
        });

        instance.on("chainChanged", (chainId) => {
            console.log('Chain changed to:', chainId);
            // Optionally handle network changes
        });

        instance.on("disconnect", (code, reason) => {
            console.log('Disconnected:', code, reason);
            disconnectWallet();
        });

        output.innerText = 'Wallet Connected';
    } catch (error) {
        console.error("Could not connect to wallet", error);
        output.innerText = `Error: ${error.message}`;
    }
}

// Disconnect Wallet Function
async function disconnectWallet() {
    if (web3Modal) {
        await web3Modal.clearCachedProvider();
    }
    provider = null;
    signer = null;
    nftContract = null;
    stakingContract = null;
    userAddressSpan.innerText = '';
    walletInfoDiv.style.display = 'none';
    connectWalletButton.style.display = 'inline-block';
    disconnectWalletButton.style.display = 'none';
    output.innerText = 'Wallet Disconnected';
}

// NFT Operations
async function mintNFT() {
    if (!nftContract) {
        output.innerText = 'Please connect your wallet first.';
        return;
    }
    try {
        const tx = await nftContract.mint();
        output.innerText = 'Minting NFT...';
        await tx.wait();
        output.innerText = 'NFT Minted Successfully!';
    } catch (error) {
        console.error("Mint NFT Error:", error);
        output.innerText = `Error: ${error.message}`;
    }
}

async function burnNFT() {
    if (!nftContract) {
        output.innerText = 'Please connect your wallet first.';
        return;
    }
    const tokenId = burnTokenIdInput.value;
    if (!tokenId) {
        output.innerText = 'Please enter a Token ID to burn.';
        return;
    }
    try {
        const tx = await nftContract.burn(tokenId);
        output.innerText = `Burning NFT with Token ID ${tokenId}...`;
        await tx.wait();
        output.innerText = 'NFT Burned Successfully!';
    } catch (error) {
        console.error("Burn NFT Error:", error);
        output.innerText = `Error: ${error.message}`;
    }
}

// Staking Operations
async function stakeTokens() {
    if (!stakingContract) {
        output.innerText = 'Please connect your wallet first.';
        return;
    }
    try {
        const tx = await stakingContract.stake();
        output.innerText = 'Staking tokens...';
        await tx.wait();
        output.innerText = 'Tokens Staked Successfully!';
    } catch (error) {
        console.error("Stake Tokens Error:", error);
        output.innerText = `Error: ${error.message}`;
    }
}

async function unstakeTokens() {
    if (!stakingContract) {
        output.innerText = 'Please connect your wallet first.';
        return;
    }
    try {
        const tx = await stakingContract.unstake();
        output.innerText = 'Unstaking tokens...';
        await tx.wait();
        output.innerText = 'Tokens Unstaked Successfully!';
    } catch (error) {
        console.error("Unstake Tokens Error:", error);
        output.innerText = `Error: ${error.message}`;
    }
}

async function calculateRewards() {
    if (!stakingContract) {
        output.innerText = 'Please connect your wallet first.';
        return;
    }
    try {
        const rewards = await stakingContract.pendingRewards();
        // Assuming rewards are in Wei, format to Ether
        const formattedRewards = ethers.utils.formatEther(rewards);
        output.innerText = `Pending Rewards: ${formattedRewards} ETH`;
    } catch (error) {
        console.error("Calculate Rewards Error:", error);
        output.innerText = `Error: ${error.message}`;
    }
}

// Initialize Web3Modal on page load
initWeb3Modal();

// Attach Event Listeners
connectWalletButton.addEventListener('click', connectWallet);
disconnectWalletButton.addEventListener('click', disconnectWallet);
mintNFTButton.addEventListener('click', mintNFT);
burnNFTButton.addEventListener('click', burnNFT);
stakeTokensButton.addEventListener('click', stakeTokens);
unstakeTokensButton.addEventListener('click', unstakeTokens);
calculateRewardsButton.addEventListener('click', calculateRewards);
