import { useWalletSelector } from 'contexts/WalletSelectorContext';



function cutAddress(accountId) {
    const first = accountId.slice(0, 6);
    const last = accountId.slice(-6);
    const tryTest =  (first + '...' + last);
  
    let num = accountId;
    if (accountId.length > 15) {
      return tryTest
      console.log(tryTest)
    } else {
      return accountId
      console.log(accountId, 'test')
    }
  }

export { cutAddress };