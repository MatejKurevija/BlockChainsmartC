

const CreditContract = artifacts.require("CreditContract");

module.exports = function (deployer) {
    const borrowerAddress = '0x3ebAfF28573265a07dB1315fb263b9b1A5B8C7DD';
    const loanAmount = web3.utils.toWei('1', 'ether');  // Iznos zajma
    const interestRate = 5;  // 5% kamata
    const loanDueDate = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;  // Rok 7 dana

    deployer.deploy(CreditContract, borrowerAddress, loanAmount, interestRate, loanDueDate);
};
