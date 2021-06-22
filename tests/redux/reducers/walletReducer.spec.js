import walletReducer from '../../../redux/reducers/walletReducer';

describe("Wallet Reducer", () => {
  it("when previous state is initial and action type is pending, must reset value", () => {
    const newState = walletReducer({
      address:"",
      accountNumber:"",
      coins: [],
      loading:true,
      error:false,
      errorMessage:"",
    }, {type: 'connectVerifyWallet/pending'});

    const expectedState = {
      address: '',
      accountNumber: '',
      coins: [],
      loading: true,
      error: false,
      errorMessage: ''
    }
   
    expect(newState).toMatchObject(expectedState)
  });

  it("when previous state is pending state and action type is fulfilled, must set value of fulfilled", () => {
    const payload = {
      address:"sample address", 
      accountNumber: "sample account number",
      coins: [{denom: "uluna", amount: "1000"}]
    }
    const newState = walletReducer(
      {
        address:"",
        accountNumber:"",
        coins: [],
        loading:true,
        error:false,
        errorMessage:"",
      }, {type: 'connectVerifyWallet/fulfilled', payload});
    
    const expectedState =  {
      address: 'sample address',
      accountNumber: 'sample account number',
      loading: false,
      error: false,
      errorMessage: '',
      coins: [ { denom: 'uluna', amount: '1000' } ]
    }

    expect(newState).toMatchObject(expectedState);
  })

  it("when previous state is pending state and action type is rejected, must set value of fulfilled", () => {
    const payload = "500 something went wrong in the server";
    const newState = walletReducer(
      {
        address:"",
        accountNumber:"",
        coins: [],
        loading:true,
        error:false,
        errorMessage:"",
      }, {type: 'connectVerifyWallet/rejected', payload});
      
    const expectedState = {
      address: '',
      accountNumber: '',
      coins: [],
      loading: false,
      error: true,
      errorMessage: "500 something went wrong in the server"
    }

    expect(newState).toMatchObject(expectedState);
  })
})