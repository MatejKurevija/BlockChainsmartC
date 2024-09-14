const CreditContract = artifacts.require("CreditContract");

contract("CreditContract", accounts => {
    const lender = accounts[0];    // Zajmodavac
    const borrower = accounts[1];  // Zajmoprimac
    const loanAmount = web3.utils.toWei('1', 'ether'); // Iznos zajma
    const interestRate = 5; // Kamatna stopa
    const loanDueDate = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // Rok za vraćanje (7 dana)

    it("should allow borrower to deposit collateral and lender to send loan", async () => {
        const creditInstance = await CreditContract.new(borrower, loanAmount, interestRate, loanDueDate, { from: lender });

        // Provjeri početno stanje kolaterala
        let collateralAmount = await creditInstance.collateralAmount();
        console.log("Initial collateral amount:", collateralAmount.toString());

        // Borrower deposits collateral
        await creditInstance.depositCollateral({ from: borrower, value: web3.utils.toWei('0.5', 'ether') });

        // Provjeri stanje kolaterala nakon depozita
        collateralAmount = await creditInstance.collateralAmount();
        console.log("Collateral amount after deposit:", collateralAmount.toString());

        // Provjeri stanje ugovora nakon kolaterala
        let contractBalance = await web3.eth.getBalance(creditInstance.address);
        console.log("Contract balance after collateral:", contractBalance);

        // Lender sends loan with the correct value
        await creditInstance.sendLoan({ from: lender, value: web3.utils.toWei('1', 'ether') });

        // Provjera stanja na ugovoru
        contractBalance = await web3.eth.getBalance(creditInstance.address);
        console.log("Contract balance after loan sent:", contractBalance);

        // Očekujemo da je saldo ugovora sada 0.5 ethera (jer je zajmodavac poslao 1 ether zajma, ali kolateral ostaje)
        assert.equal(contractBalance, web3.utils.toWei('0.5', 'ether'));
    });

});
