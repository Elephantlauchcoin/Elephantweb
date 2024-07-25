document.addEventListener('DOMContentLoaded', () => {
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const buyTokensBtn = document.getElementById('buyTokensBtn');
    const stakeTokensBtn = document.getElementById('stakeTokensBtn');
    const claimRewardsBtn = document.getElementById('claimRewardsBtn');
    const amountInput = document.getElementById('amountInput');

    // Ganti dengan alamat kontrak dan ABI yang sesuai
    const contractAddress = '0xEB5ae4B69c755dB67df765f1b9dab01a99175C5D;
    const contractABI = [[
	{]
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_tokenRate",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "Sell",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "buyTokens",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endPresale",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenRate",
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
		"inputs": [],
		"name": "tokensSold",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

    let web3;
    let contract;
    let userAccount;

    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(contractABI, contractAddress);

        connectWalletBtn.addEventListener('click', async () => {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                userAccount = accounts[0];
                connectWalletBtn.textContent = `Connected: ${userAccount}`;
            } catch (error) {
                console.error('User rejected the request.');
            }
        });

        buyTokensBtn.addEventListener('click', async () => {
            const amount = web3.utils.toWei(amountInput.value, 'ether');
            try {
                await contract.methods.buyTokens().send({
                    from: userAccount,
                    value: amount
                });
                alert('Purchase successful!');
            } catch (error) {
                console.error('Transaction failed:', error);
                alert('Purchase failed!');
            }
        });

        stakeTokensBtn.addEventListener('click', async () => {
            try {
                await contract.methods.stakeTokens().send({ from: userAccount });
                alert('Staking successful!');
            } catch (error) {
                console.error('Transaction failed:', error);
                alert('Staking failed!');
            }
        });

        claimRewardsBtn.addEventListener('click', async () => {
            try {
                await contract.methods.claimRewards().send({ from: userAccount });
                alert('Rewards claimed!');
            } catch (error) {
                console.error('Transaction failed:', error);
                alert('Claiming rewards failed!');
            }
        });
    } else {
        connectWalletBtn.textContent = 'Please install MetaMask!';
    }

    // Countdown Timer
    const timer = document.getElementById('timer');
    const endDate = new Date('2024-08-25T00:00:00Z').getTime(); // Ubah tanggal akhir presale sesuai kebutuhan

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endDate - now;

        if (distance < 0) {
            timer.innerHTML = 'Presale has ended';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days;
        document.getElementById('hours').innerText = hours;
        document.getElementById('minutes').innerText = minutes;
        document.getElementById('seconds').innerText = seconds;
    }

    setInterval(updateCountdown, 1000);
});

