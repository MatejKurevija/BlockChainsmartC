pragma solidity ^0.8.0;

contract CreditContract {
    address payable public lender;
    address payable public borrower;
    uint public loanAmount;
    uint public interestRate;
    uint public loanDueDate;
    uint public collateralAmount;
    bool public loanRepaid;

    constructor(address payable _borrower, uint _loanAmount, uint _interestRate, uint _loanDueDate) {
        lender = payable(msg.sender);
        borrower = _borrower;
        loanAmount = _loanAmount;
        interestRate = _interestRate;
        loanDueDate = _loanDueDate;
        loanRepaid = false;
    }

    // Zajmoprimac postavlja kolateral
    function depositCollateral() public payable {
        require(msg.sender == borrower, "Samo zajmoprimac moze poloziti kolateral.");
        require(msg.value > 0, "Morate poloziti neki iznos kao kolateral.");
        collateralAmount = msg.value;
    }

    // Zajmodavac salje zajam
    function sendLoan() public payable {
    require(msg.sender == lender, "Samo zajmodavac moze poslati zajam.");
    require(collateralAmount > 0, "Kolateral mora biti postavljen.");
    require(msg.value == loanAmount, "Morate poslati tocan iznos zajma.");
    borrower.transfer(msg.value);
}

    // Zajmoprimac vraca zajam
    function repayLoan() public payable {
        require(msg.sender == borrower, "Samo zajmoprimac moze vratiti zajam.");
        require(block.timestamp <= loanDueDate, "Rok za vracanje zajma je prosao.");
        require(msg.value == loanAmount + (loanAmount * interestRate / 100), "Morate platiti pun iznos s kamatom.");
        loanRepaid = true;
        lender.transfer(msg.value); // Placanje zajmodavcu
        payable(borrower).transfer(collateralAmount); // Povrat kolaterala zajmoprimcu
    }

    // Ako zajam nije vracen na vrijeme, zajmodavac zadrzava kolateral
    function claimCollateral() public {
        require(msg.sender == lender, "Samo zajmodavac moze zahtijevati kolateral.");
        require(block.timestamp > loanDueDate, "Zajam jos nije dospio.");
        require(!loanRepaid, "Zajam je vec vracen.");
        lender.transfer(collateralAmount); // Zajmodavac zadrzava kolateral
    }
}
