document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navList = document.querySelector('.nav-list');

  hamburger.addEventListener('click', () => {
    navList.classList.toggle('open');
  });
});

// Menghubungkan ke Web3
if (typeof window.ethereum !== 'undefined') {
  window.web3 = new Web3(window.ethereum);
  window.ethereum.enable().catch(error => {
    console.error('Error enabling Ethereum:', error);
  });
} else {
  console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
}

// Alamat kontrak pintar
const presaleContractAddress = '0x2dB1d6fD8C07bD725C9208A087220bf9A2528261';
const tokenContractAddress = '0xEB5ae4B69c755dB67df765f1b9dab01a99175C5D';
const contractCreatorAddress = '0xAaEE78BCA8ee8698D272867D78053C6f1f9Fafe3'; // Alamat pembuat kontrak

// Memuat ABI dari file JSON gabungan
async function loadCombinedABI(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error('Error loading ABI:', error);
  }
}

async function init() {
  const combinedABI = await loadCombinedABI('path/to/combinedABI.json'); // Ganti dengan path yang benar

  if (!combinedABI) {
    console.error('Failed to load ABI. Initialization aborted.');
    return;
  }

  const presaleContract = new web3.eth.Contract(combinedABI.presaleABI, presaleContractAddress);
  const tokenContract = new web3.eth.Contract(combinedABI.tokenABI, tokenContractAddress);

  // Fungsi untuk membeli token saat presale
  async function buyTokens(amount) {
    try {
      const accounts = await web3.eth.getAccounts();
      const weiAmount = web3.utils.toWei(amount, 'ether');
      await presaleContract.methods.buyTokens().send({
        from: accounts[0],
        value: weiAmount,
        to: contractCreatorAddress // Alamat pembuat kontrak
      });
      console.log('Tokens purchased successfully');
    } catch (error) {
      console.error('Error purchasing tokens:', error);
    }
  }

  // Fungsi untuk mengklaim rewards
  async function claimRewards() {
    try {
      const accounts = await web3.eth.getAccounts();
      await tokenContract.methods.claimRewards().send({
        from: accounts[0]
      });
      console.log('Rewards claimed successfully');
    } catch (error) {
      console.error('Error claiming rewards:', error);
    }
  }

  // Menambahkan event listener pada tombol
  document.querySelector('.presale-box button').addEventListener('click', () => {
    const amount = document.querySelector('.presale-box input').value;
    buyTokens(amount);
  });

  document.querySelector('.rewards-box button').addEventListener('click', claimRewards);
}

init();

// Countdown Timer Script
const endDate = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000); // Tanggal akhir 30 hari dari sekarang

const countdown = () => {
  const now = new Date().getTime();
  const gap = endDate - now;

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const textDay = Math.floor(gap / day);
  const textHour = Math.floor((gap % day) / hour);
  const textMinute = Math.floor((gap % hour) / minute);
  const textSecond = Math.floor((gap % minute) / second);

  document.getElementById('days').innerText = textDay;
  document.getElementById('hours').innerText = textHour;
  document.getElementById('minutes').innerText = textMinute;
  document.getElementById('seconds').innerText = textSecond;
};

setInterval(countdown, 1000);

