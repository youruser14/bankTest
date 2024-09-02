const account1 = {
  userName: "Maxim Schc",
  pin: 1111,
  interest: 1.1,
  transaction: [
    5000, 500, -200, 478, 26, 372, -1000, 10000, 26, 372, -1000, 10000,
  ],
};

const account2 = {
  userName: "Jenya Gaz",
  pin: 2222,
  interest: 1,
  transaction: [
    486, 500, -200, 478, 26, 372, -1000, 2058, 26, 372, -951, 10713,
  ],
};

const account3 = {
  userName: "Youra Kasp",
  pin: 3333,
  interest: 1.1,
  transaction: [
    5054, 500, -200, 4078, 586, 372, -5500, 5670, 26, 372, -1000, 19900,
  ],
};

const account4 = {
  userName: "Elena Voron",
  pin: 4444,
  interest: 1.1,
  transaction: [
    5000, 500, -200, 764874, 26, 372, -1012300, 10000, 26, 372, -1000, 10000,
  ],
};

const account5 = {
  userName: "Afgan Cush",
  pin: 5555,
  interest: 1.1,
  transaction: [
    23040, 2310, -340, 478, 26, 8552, -4480, 1233, 26, 372, -1000, 1313,
  ],
};

const accounts = [account1, account2, account3, account4, account5];

const createNickName = (account) => {
  account.forEach((acc) => {
    acc.nickName = acc.userName
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
};
createNickName(accounts);

const $pincodeInput = document.querySelector(".authorization__pass");
const $loginInput = document.querySelector(".authorization__log");
const $btnLogIn = document.querySelector(".authorization__btn");

const $aothorizationPage = document.querySelector(".nav");
const $mainPage = document.querySelector(".main-container");
const $paymentSection = document.querySelector(".payment__section");
const $footerInfo = document.querySelector(".footer");

const openOrClose = () => {
  if (
    $aothorizationPage.style.display === "none" &&
    $mainPage.style.display === "block"
  ) {
    $aothorizationPage.style.display = "block";
    $mainPage.style.display = "none";
  } else {
    $aothorizationPage.style.display = "none";
    $mainPage.style.display = "block";
  }
};

// $aothorizationPage.style.display = "none";
// $mainPage.style.display = "block";
$footerInfo.style.display = "none";

const createTransactionPage = (transaction, sort = false) => {
  $paymentSection.innerHTML = "";
  const transacs = sort
    ? transaction.slice().sort((x, y) => x - y)
    : transaction;
  // console.log(transacs);
  transacs.forEach((trans, index) => {
    const transactionWords = trans > 0 ? "Депозит" : "Вывод средств";
    const reactStyle =
      transactionWords === "Депозит"
        ? "payment__operation-deposit"
        : "payment__operation-withdraw";
    const transactionPage = `<div class="payment__information">
        <div class="payment__action">
          <div class="payment__operation ${reactStyle}">${
      index + 1
    } ${transactionWords}</div>
          <div class="payment__date">2 дня назад</div>
        </div>
        <div class="payment__sum">${trans}$</div>
      </div>`;
    $paymentSection.insertAdjacentHTML("afterbegin", transactionPage);
  });
};
const $currentBalance = document.querySelector(".balance-current");
const totalBalance = (account) => {
  let balance = account.transaction.reduce((acc, el, index) => {
    return acc + el;
  }, 0);
  account.balance = balance;
  $currentBalance.textContent = account.balance + "$";
};

const $receiving = document.querySelector(".receiving");
const $conclusion = document.querySelector(".conclusion");
const $procent = document.querySelector(".procent");

const displayTotal = (account) => {
  const receiving = account.transaction
    .filter((el) => el > 0)
    .reduce((acc, trans) => acc + trans, 0);
  $receiving.textContent = receiving + "$";

  const conclusion = account.transaction
    .filter((el) => el < 0)
    .reduce((acc, trans) => acc + trans, 0);
  $conclusion.textContent = conclusion + "$";

  const procent = account.transaction
    .filter((el) => el > 0)
    .map((el) => (el / 100) * account.interest)
    .reduce((acc, procent) => acc + procent, 0);

  $procent.textContent = Math.trunc(procent) + "$";
};
const $transferAmount = document.querySelector(".transfer__amount");
const $transferRecipient = document.querySelector(".transfer__recipient");
const $transferBtn = document.querySelector(".transfer__btn");
let currentAccount;

const updateUi = (account) => {
  createTransactionPage(account.transaction);
  totalBalance(account);
  displayTotal(account);
};

const transfer = () => {
  const transferAccount = $transferRecipient.value;
  const transferAmount = Number($transferAmount.value);
  $transferRecipient.value = "";
  $transferAmount.value = "";

  if (
    currentAccount.nickName !== transferAccount &&
    transferAmount > 0 &&
    currentAccount.balance >= transferAmount
  ) {
    const recipient = accounts.find(
      (account) => account.nickName === transferAccount
    );
    recipient.transaction.push(transferAmount);
    currentAccount.transaction.push(-transferAmount);
    updateUi(currentAccount);
    console.log(currentAccount);
    console.log(recipient);
  }
};

const logIn = (e) => {
  e.preventDefault();
  const login = String($loginInput.value);
  const pincode = Number($pincodeInput.value);
  currentAccount = accounts.find((account) => account.nickName === login);
  // console.log(currentAccount);
  if (pincode === currentAccount?.pin) {
    openOrClose();
    $footerInfo.style.display = "block";
    updateUi(currentAccount);
  } else {
    alert(`Аккаунта с никнеймом: ${login} не существует`);
  }
  $loginInput.value = "";
  $pincodeInput.value = "";
};

const $closeName = document.querySelector(".close__name");
const $closePin = document.querySelector(".close__pin");
const $closeBtn = document.querySelector(".close__btn");

const closeBankAccount = () => {
  if (
    $closeName.value === currentAccount.nickName &&
    Number($closePin.value) === currentAccount.pin
  ) {
    const currentAccountIndex = accounts.findIndex(
      (account) => account.nickName === currentAccount.nickName
    );
    accounts.splice(currentAccountIndex, 1);
    console.log("asd");
  }
  alert(
    `Аккаунт ${currentAccount.userName} будет удален через 5 секунд`,
    setTimeout(openOrClose, 5000)
  );
  console.log("Delete");
};

const $request = document.querySelector(".request");
const $requestBtn = document.querySelector(".request__btn");
const makeRequest = () => {
  const requestValue = Number($request.value);
  if (
    currentAccount.transaction.some(
      (trans) => trans >= (requestValue * 10) / 100
    )
  ) {
    currentAccount.transaction.push(requestValue);
    updateUi(currentAccount);
  }
};

const $sortBtn = document.querySelector(".sort__btn");

let valueA = true;

const sortTransaction = () => {
  createTransactionPage(currentAccount.transaction, valueA);
  valueA = !valueA;
};

$sortBtn.addEventListener("click", sortTransaction);
$requestBtn.addEventListener("click", makeRequest);
$closeBtn.addEventListener("click", closeBankAccount);
$transferBtn.addEventListener("click", transfer);
$btnLogIn.addEventListener("click", logIn);
