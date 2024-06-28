'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Bereket Alemayehu',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//////////////////////////////////////////////////////////
let count = 0;

//////////////////////////////////////////////////////////
const displayMovements = function (movements, sort) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
<div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
  <div class="movements__value">${mov}</div>
</div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

////////////////////////////////////////////////////////
//DISPLAY THE BALANCE
const calcPrintBalance = function (acc) {
  labelBalance.innerHTML = '';
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.insertAdjacentHTML('afterbegin', acc.balance + '€');
};
//////////////////////////////////////////////////////////SUMMERY
const calcDisplaySummary = function (acc) {
  labelSumIn.innerHTML = '';
  labelSumOut.innerHTML = '';

  const deposit = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const withdrew = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.insertAdjacentHTML('beforeend', deposit);
  labelSumOut.insertAdjacentHTML('beforeend', Math.abs(withdrew));

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(function (mov, i, arr) {
      // console.log(arr);
      return mov >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);

  labelSumInterest.textContent = interest + '€';
};

const firstWordReturn = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
firstWordReturn(accounts);
////////////////////////////////////////////////////////// updateUI
const updateUI = function (acc) {
  // Display balance
  calcPrintBalance(acc);

  // Display summary

  calcDisplaySummary(acc);

  //  Display movements
  displayMovements(acc.movements);
};

//////////////////////////////////////////////////////////
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and messages
    labelWelcome.textContent = `Wellcome back,${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    // updateUI(currentAccount);
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////TRANSFOR MONEY
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieveAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferTo.value = inputTransferAmount.value = '';
  if (
    amount > 0 &&
    recieveAcc &&
    currentAccount.balance >= amount &&
    recieveAcc?.username !== currentAccount.username
  ) {
    // doing the transfer
    currentAccount.movements.push(-amount);
    recieveAcc.movements.push(amount);
    // updateUI
    updateUI(currentAccount);
  }
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    accounts.splice(index, 1);
    // here the index shows the index of the account to be deleted and "1" used to show the number of account to be deleted.
  }
  inputCloseUsername.value = inputClosePin.value = '';
  containerApp.style.opacity = 0;
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(acc => acc >= 0.1 * amount)) {
    currentAccount.movements.push(amount);
  }
  inputLoanAmount.value = '';
  updateUI(currentAccount);
});

// 200, 450, -400, 3000, -650, -130, 70, 1300
// btnSort.addEventListener('click', function (e) {
//   e.preventDefault();
//   let temporaryMov = currentAccount.movements.slice();
//   count === 0 ? currentAccount.movements.sort((a, b) => a - b) && count++ : count = 0;
//   updateUI(currentAccount);
//   currentAccount.movements = temporaryMov;

// })

// OTHER WAY TO DO THE ABOVE TASK
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/* Beacause Arrays are object they have methods.methods means functions that are attached to every array that we created by the javaScript so they are built-in functions by the javaScript. these methods are seen as tools for array.
 Array have different methods(tools) that it uses.such as -push()     -pop()      - shift()    -unshift()
 -indexof()  -slice()     -splice()
 -reverse()  -join()     -concat()
 -includes()// used to test the Equality of something by checking the presence of something in it.                  etc...
*/
// Exercise

let arr = ['a', 'b', 'c', 'd', 'e'];
// SLICE
console.log(arr.slice(2));
console.log(arr);
console.log(arr.slice(2, 4));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice(-2));
console.log(arr.slice());
let arr1 = arr.slice();
console.log(arr1); //shallow copy  using slice() of the array.
/* slice() method are used just like in the same way as we use for string so one thing that we have to remeber is 
-the slice method in array can be used for shallow copy
-if we use "and" which means ex. arr.slice(1,2) the last index number is not used the only one that is extracted is form the begnning without include the last  index(in these case "2").
-we use slice to extract elements of the array partially or fully.
-we can use slice() method without put parameter  which extract the entire array.
-the slice() method doesn't mutuate the orginal array.*/

// SPLICE
console.log(arr.splice(2));
console.log(arr);
console.log(arr.splice(-1));
console.log(arr);

/* splice() method works in similar way to the slice() but have some difference as follow.
-splice() method is used to extract the specified element but it extract by deleting it form the orginal array ,so it mutuate the orginal array.
*/

// REVERSE

// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
const arr2 = ['f', 'e', 'd', 'c', 'b', 'a'];
console.log(arr2.reverse());
console.log(arr2.reverse());

/* Reverse is the method that mutuate the orginal array and make the reverse for the given array this doesn't mean make the given array ordered .it only do reversing the given array wether the array is on the correct order or not.*/

//CONCAT
const arr3 = ['g', 'h', 'i', 'j', 'k'];
// console.log(arr2.reverse().concat(arr3));
console.log(arr2);
console.log(arr3);

/* the concat() method used to concat(join) to array strings so doesn't mutuate the orginal array(string)*/

//JOIN
const letters = arr2.reverse().concat(arr3).join('-');
console.log(letters);

/* join is another function that is used for adhesive to strings but dosen't mutuate the orginal string it differ from concat() by the freature it creates between two strings or arrays.*/

// AT()
const arr4 = [2, 4, 3, 5];
console.log(arr4.at(-1));
console.log(arr4[arr4.length - 1]);
console.log(arr4.slice(-3)[0]); // which is the new behaviour that we use to get the value instead of the array. which is "[0]";

//FOREACH LOOP

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// using for-of loop
for (const [i, mov] of movements.entries()) {
  if (mov > 0) {
    console.log(`Mov ${i + 1} : You deposited:${Math.abs(mov)}`);
  } else {
    console.log(`Mov ${i + 1} : You withdrew:${Math.abs(mov)}`);
  }
}

// using forEach loop
console.log('----FOREACH LOOP-----');
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Mov ${i + 1} : You deposited:${Math.abs(mov)}`);
  } else {
    console.log(`Mov ${i + 1} : You withdrew:${Math.abs(mov)}`);
  }
});

/* here the forEach loop and the for-of loop are alot similar but they have some difference that is , 
-the forEach loop have easier way to acess the index value of the current element and also the entire array and which is a bit cleaner than for-of loop in some situations.
-the majer difference of forEach loop is that we can't stop the loop using break(keyword!),it continue untile it finish the array.
-on other hand for-of loop can be stopped using  break.
 
HOW FOREACH LOOP WORK BEHIND  THE SCENE?
-this loop works first by take the current element,current index and entire array form the array and pass it as  an argument to it's callback function .so we need callback function that used to do what we want.here  the function is not called manually by the forEach loop itself call it on each  iteration 
 
*** here  when we say callback function we don't mean it have "return" to return to the caller function ,that is not always  true.it may not have return as the name show it is called later by the higher-order functions to do something.so simply we can say that callback function is functions that the higher-order functions recieve and call later to do smt.
*/

console.log('----USING FOREACH LOOP ON MAP----');
// MAP
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}:${value}`);
});

console.log('----USING FOREACH LOOP ON SET----');
// USING FOREACH LOOP ON SET
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'USD']);

currenciesUnique.forEach(function (value, _, Set) {
  console.log(`${value}`);
});

/* as we know before "Set Datastructure" is used to remove the duplicated element on array or string that means it doesn't need index beacuse it dosen't used to order the elements rather used to make all elements unique.*/

// [200, 450, -400, 3000, -650, -130, 70, 1300]

// const user = "Steven Thomas Williams";

// console.log(accounts);
/* we can use  for-of loop or forEach or filter()or map()or  reduce() but in javaScript there are many conditions that push us to use functional code but there is also practical implication that is in function we can use different function together using "holo-chaining".*/

// FILTER()

const deposit = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposit);
// USING ARROW FUNCTION
const depositArrow = movements.filter(mov => mov > 0);
console.log(deposit);
// USING FOR-OF LOOP
let depositFor = [];
for (const mov of movements) if (mov > 0) depositFor.push(mov); // push is necessary because the index of the receiver array is not specified so push() add each element at the end of previous element.
console.log(depositFor);

// FILTER WITHDRAWALS
const withdrew = movements.filter(mov => mov < 0);
console.log(withdrew);

// REDUCE()
const balance = movements.reduce(function (acc, curr, i, arr) {
  console.log(`Iteration ${i}:${acc}`);

  return acc + curr;
}, 0);
console.log(movements);
console.log(balance);
// using for-of loop
let balance2 = 0;
for (const mov of movements) balance2 += mov;

console.log(balance2);
// using arrow function
const balance3 = movements.reduce((acc, curr) => acc + curr, 0);
console.log(balance3);

/* tips to be remebered 
1, we have to not use over chaining because when the methods goes large and large it causes a serious  performance issues.
2.look oppourtiunity instead  of over using of chaining. 
3.avoid using method that mutuate the orginal array or string.*/

// // CODEING CHALLENGE #1

// const checkDogs = function (arr1, arr2) {
//   let arrCopied = arr1.slice();
//   arrCopied.splice(-2);
//   arrCopied.splice(0, 1);//this enable us to delete the first element only because the last or the end value in these "and" or range operation is not included in the operation.
//   const correctedArray = arrCopied.concat(arr2);
//   correctedArray.forEach(function (age, num) {
//     console.log(`Dog number ${num + 1} is ${age >= 3 ? `an adult,and is ${age} years old` : `is still a puppy 🐶`}`);
//   })
// }

// console.log('---FOR TEST ONE---');
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

// console.log('---FOR TEST TWO---');

// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// // test data1= julia's [3,5,2,12,7] kate's[4,1,15,8,3]
// // test data2= julia's [9,16,6,8,3] kate's[10,5,6,1,4]

// /////////////////////////////////////////////////
// // DATA TRANSFORMATION WITH MAP,FILTER AND REDUCE
// /////////////////////////////////////////////////
//
/* as specified above these three methods are used for different thing

1, MAP() is  a method that is similar to forEach method but  it create abrand new array that have some opertaion performed on it so, as the name said it is mapped to the new array but have some operation to perform. it does not creat a side effect=whic means creating some work without returning value,but this change(mutuate) the orginal value,this is one side effect.it return some value to the new Brand array.

2, FILTER() is another array method that is used to select the element from the orginal array  based on the specified test condition.so it creat new array that store these new filtered value.

3,REDUCE() these method has accumulator variable that is add to the current element value and return the sum(or other operations performed on it) of all elements of the array in to one single value .but here we can also use another operation not only addition.but these method does not creat new array.have return but the return is not array. so all of the above three methods have return .here the reduce method can have different operation ,that means does not only have "+".
*/

// const euroUsd = 1.1;
// console.log('USING MAP METHOD');

// const movementsUSD = movements.map(function (mov) {
//   return mov * euroUsd;
// })
// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for (const mov of movements)
//   (movementsUSDfor.push(mov * euroUsd));

// console.log('USING FOR-OR LOOP');
// console.log(movements);
// console.log(movementsUSDfor);

// console.log('---USING ARROW FUNCTION---');
// const movementsUSDArrow = movements.map(mov => mov * euroUsd);
// console.log(movementsUSDArrow);
// /* in arro function if we have one parameter  we can leave the brace  like as we see above .....map(mov=>....*/
// const movementsDescription = movements.map((mov, i) => `Mov ${i + 1} : You ${mov > 0 ? 'deposited' : 'withdrew'}:${Math.abs(mov)}`
// )
// console.log(movementsDescription);

// // MAP() does not creat  a side effect only it creat a brand new array. where as "forEach loop" creat a side effect when it goes through each iteration which means it have seenable effect when it iterates. but these side-effect inturn used in functional programming.

// CODING CHALLENGE #2
// [5,2,4,1,15,8,3]
// [16,6,10,5,6,1,4]
const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(age => (age > 2 ? 16 + age * 4 : 2 * age));
  console.log(humanAges);
  const ageAbove18 = humanAges.filter(age => age >= 18);
  console.log(ageAbove18);
  const average = ageAbove18.reduce(
    (acc, ave, i, a) => acc + ave / a.length,
    0
  );
  return average;
};
console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// REWRITING  USING ARROW FUNCTION AND CHAINING
console.log('---USING ARROW FUNCTION AND CHAINING---');
const calcAverageHumanAgeD = function (ages) {
  const humanAges = ages
    .map(age => (age > 2 ? 16 + age * 4 : 2 * age))
    .filter(age => age >= 18)
    .reduce((acc, ave, i, a) => acc + ave / a.length, 0);
  return humanAges;
};
console.log(calcAverageHumanAgeD([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAgeD([16, 6, 10, 5, 6, 1, 4]));

//  FIND THE TOTAL AVERAGE DEPOSIT IN DOLLAR
let TotalAverage = 0;
let eurToUsd = 1.1;
const TotalAve = function (accounts) {
  accounts.forEach(function (account, index) {
    const deposit = account.movements
      .filter(val => val > 0)
      .map(acc => acc * eurToUsd)
      .reduce((acc, val, _, a) => acc + val / a.length, 0);

    TotalAverage += deposit;
  });
};
TotalAve(accounts);
console.log(`The Total Average is:${TotalAverage}`);

// FIND()
/*which is a method that is only return one first value that satisfy the condition,and does not return array instead return one value only but the other thing like callback function  is also needed here.it have return.*/

/*
In HTML form element the button  submit  cause the page reload after the form is submitted. so we can prevent by passing argument to the addEventListener and using that call preventDefault(). 
*/

console.log(movements);
// USING ARROW FUNCTION
const firstWithdrewl = movements.find(mov => mov < 0);
console.log(firstWithdrewl);

const findOwner = accounts.find(account => account.owner === 'Jessica Davis');
console.log(findOwner);

// USING FOR-OF LOOP
for (const mov of accounts)
  mov.owner === 'Jessica Davis' ? console.log(mov) : '';

// FINDINDEX
/*which is differ from find()which is the  one return index instead of element. we can use this method to get the wanted index then we can also delete that account using splice(index,1) '1' means only one account which is the specified account should be deleted.*/

// SOME AND EVERY
/* this two methods are used in similar way we use map,filter,reduce but  return boolean value. if SOME get one element that satisfy the required condition,it return true else false. AND if EVERY get every element in the array or string satisfy the required condition it return true else false.*/
console.log(movements);
// EQUALITY
console.log(movements.includes(-130));
// CONDITION
const anyDeposit = movements.some(mov => mov > 0);
console.log(anyDeposit);
// EVERY
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// separat using of callback()
console.log('---SEPARATE USE OF CALLBACK FUNCTION---');
const deposits = mov => mov < 0;
console.log(movements.some(deposits));
console.log(movements.every(deposits));
console.log(movements.filter(deposits));

// FLAT AND FLATMAP
/*flat is  a method have function like spread operator. and did not need  callback function */

const arrNew = [[1, 2], 3, [3, 4], 5, 6, [7, 8]];
console.log(arrNew.flat());
const arrNew1 = [[[1], 2], [3, [[4]]], 5, 6, [7, 8]];
console.log(arrNew1.flat(1)); // but here we can use parameter values in flat() to go deeper to more nested arrays. "1" is default value.
const arrDeep = [[[1], 2], [3, [[4]]], 5, 6, [7, 8]];
console.log(arrDeep.flat(3));

const accountsMovements = accounts.map(acc => acc.movements);
console.log(accountsMovements);
const allMovements = accountsMovements.flat();
console.log(allMovements);

const totalValue = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(totalValue);

// THIS CAN BE DONE SIMILARLY  USING SCOPE CHAINING AND FLATMAP()

console.log('USING SCOPE CHAINING AND FLATMAP');
const accountsMovements2 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(accountsMovements2);

//  USING FLATMAP()
const accountsMovements3 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(accountsMovements3);
//here flatMap() is used for one level deeper neseted arrays only if we want to use for more deeper arrays we need to use again flat() method.

// SORTING ARRAY
/* sort() is used to sort strings in simple way but for number we need to do something because it takes the number and convert it to string compare it by it's first word
 ** sort() mutuate the orginal array or string .and sort() can take callback function if zero "0" is returned the array or the string stays the same.*/
const owners = [
  'bereket',
  'selam',
  'emuye',
  'derej',
  'birhanu',
  'wudye',
  'gashe',
];
console.log(owners);
console.log(owners.sort());

// sort() for numbers
/* RULES FOR SORTING NUMBERS

 return < 0 A,B (Keep order)
 return > 0 A,B (Switch order)
*/

console.log(movements);
console.log(movements.sort());

// for Accesending order
movements.sort((a, b) => a - b);
console.log(movements);

// for decending order
movements.sort((a, b) => b - a);
console.log(movements);

// -650,-400,-130,70,200,450,1300,3000

movements.sort((a, b) => {
  // Accesending order
  if (a > b) return 1;
  // Decesending order
  if (b > a) return -1;
});
console.log(movements);

// MORE WAY OF CREATING ARRAYS

const arrr = [1, 2, 3, 4, 5, 6, 7];
console.log(arrr);
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// EMPTY ARRAY + FILL Method =fill()
const x = new Array(7); // here it create seven(7) empty elements so this is the particular property of creating array.
// console.log(x);
// x.fill(1);//here also it replace "1" for all "7" elements
// console.log(x);
x.fill(1, 3, 6); // here the first argument of fill() always the number or value to be filled and the rest arguments are the range to which these value is filled.
console.log(x);

console.log(Array.from({ length: 7 }, () => 1));
console.log(Array.from({ length: 7 }, (cur, i) => i + 1));
console.log(Array.from({ length: 12 }, (_, i) => i + 1));

// Generating 100 random dice rolls
const dices = Array.from(
  { length: 100 },
  () => Math.trunc(Math.random() * 100) + 1
);
console.log(dices);

//  USECASE OF ARRAY.FROM =as the name suggest it can create array form length and arrow function from iterables(map,set ,string,array...etc). so it take itereables and converted to real array . querySelectorAll() is used to select all elements as a node list but which is not a real array but it seems so it does not have all methods that real array have such as map ,set ...etc but to make it real array we can use Array.from() and convert each node list to real array element.

// Examples
labelBalance.addEventListener('click', function () {
  // const movementsUI = Array.from(document.querySelectorAll('.movements__value')).map(el => el.textContent.replace('€', ''));  //here also we can  use map().
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  /*
     here the map  can be used   as the second argument.that means as we have already seen EX.console.log(Array.from({ length: 7 }, (cur, i) => i + 1)); here first the array is prepared then the second argument is performed on that. here above on the example it take the array element and perform mapping.*/
  // const movementsUI2 = [...document.querySelectorAll('.movements__value')]
  console.log(movementsUI);
  // console.log(movementsUI2);
});

// so here we can use map,set or other array methods because the DOM element(node list ) is now converted to real-array(movementsUI).

//////////////////////////
//ARRAY METHODS PRACTICE

//1, find the total deposit of all accounts.
const bankDepositSum = accounts.reduce(
  (acc, mov) =>
    acc +
    mov.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0),
  0
);
console.log(bankDepositSum);

// other way to do the above problem
const bankDepositSum2 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
console.log(bankDepositSum2);
// 2, find the number of deposits that are at least 1000 deposits.
const numDeposit = accounts.reduce(
  (acc, mov) =>
    acc + mov.movements.filter(acc => acc > 0 && acc >= 1000).length,
  0
);
console.log(numDeposit);
// the second way
const numDeposit2 = accounts
  .flatMap(acc => acc.movements)
  .filter(acc => acc >= 1000).length; // saying acc>=1000 means the acc should be greater than zero(0).
console.log(numDeposit2);
//the third way
const numDeposit3 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, mov) => (mov >= 1000 ? ++count : count), 0);
console.log(numDeposit3);

// prefixed  ++ operator
let a = 10;
console.log(++a);
console.log(a);

//3.
const { deposit2, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, mov) => {
      // mov > 0 ? sums.deposit += mov : sums.withdrawals += mov;
      sums[mov > 0 ? 'deposit2' : 'withdrawals'] += mov;
      return sums;
    },
    { deposit2: 0, withdrawals: 0 }
  ); // here the accumulator created as object. with the initial value of deposit and withdrawals=0;
console.log(deposit2, withdrawals);
// 4.
const convertTitleCase = function (title) {
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const titleCase = title
    .toLowerCase()
    .split('  ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');

  return capitalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is  and another title with an EXAMPLE'));

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much? or too little?.
Eating too "much" means the dog's current food portion is larger than the recommended portion, and eating too "little" is the opposite.
Eating an "okay" amount means the dog's current food portion is within a range 10% above and 10% below the "recommended portion" (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

// */
// const ownersEatTooMuch = [];
// const ownersEatTooLittle = [];
// const checker = function (cur, recommended, owners) {
//   if (cur > 0.9 * recommended && cur < 1.1 * recommended)
//     console.log('The Dog eating OKAY');
//   else if (cur < 1.1 * recommended) {
//     console.log(' The Dog eating too much ');
//     ownersEatTooMuch.push(owners);
//     console.log(ownersEatTooMuch.join(' '));
//   }
//   else {
//     console.log('The Dog eating too little');
//     ownersEatTooLittle.push(owners);
//     console.log(ownersEatTooLittle);
//   }
// }
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
// dogs.forEach(acc =>
//   acc.recommended = Math.trunc(acc.weight ** 0.75 * 28)
// )
// console.log(dogs);
// // 2.
// dogs.forEach(obj => obj.owners.includes('Sarah') ? checker(obj.curFood, obj.recommended, obj.owners) : '');
// // 3.
// dogs.forEach(obj => checker(obj.curFood, obj.recommended, obj.owners));
// console.log('---The owners of Eat TooMuch---');
// console.log(new Set(ownersEatTooMuch.flat(2)));
// console.log('---The owners of Eat TooLittle---');
// console.log(new Set(ownersEatTooLittle.flat(2)));
// // 4.
// let xy;
// for (const mov of ownersEatTooMuch) {
//   xy = mov.join(' and ');
// }
// // Matilda and Alice and Bob's dogs eat too much!
// console.log(xy + "'s dogs eat too much!");
// for (const mov of ownersEatTooLittle) {
//   xy = mov.join(' and ');
// }
// console.log(xy + "'s dogs eat too little!");
// // 8.

// const sortedArray = dogs.slice();

// 1.
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);
// 2.
const SarahDogs = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(SarahDogs);
console.log(
  `Sarah's dog eating too ${
    SarahDogs.curFood > SarahDogs.recFood ? 'much' : 'little'
  }`
);
//3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);
const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);
// 4.
// for(const mov ownersEatTooMuch){
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);
// }
// 5.
console.log(dogs.some(dog => dog.curFood === dog.recFood));
// 6.
const checkEatingOkay = dog =>
  dog.curFood > 0.9 * dog.recFood && dog.curFood < 1.1 * dog.recFood; //here we create function.
console.log(dogs.some(checkEatingOkay));

// 7.
const dogsEatOkay = dogs.filter(checkEatingOkay);
console.log(dogsEatOkay);
// 8.
const copyDogs = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(copyDogs);
