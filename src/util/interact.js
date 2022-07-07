require('dotenv').config();
const alchemyKey = 'https://eth-ropsten.alchemyapi.io/v2/gAQOlZdHS3eIpGULYGNg2jRhyxwmA-DS';//process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const contractABI = require("../contract-abi.json");
const contractAddress = "0x069CbA76416f83b1b8dD1059EC7C6421dc5C22a6";
// 0x4fE944b980E34D77beF8758b3c3B40762FD706bB

// 0x4a161e492cCbb7aB12F5b0e6FbA507734E7eCF0E


export const helloWorldContract = new web3.eth.Contract(
    contractABI,
    contractAddress
);

//export const helloWorldContract;

export const loadCurrentMessage = async () => { 
    //const balance = await helloWorldContract.methods.getBalance().call();
    // console.log(balance);
    //return balance;
};

export const disconnectWallet = async () => {

}




export const connectWallet = async () => {
    if (window.ethereum) {
        try {
          const addressArray = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const obj = {
            // status: "👆🏽 Write a domain in the text-field above.",
            status:"",
            address: addressArray[0],
          };
          return obj;
        } catch (err) {
          return {
            address: "",
            status: "😥 " + err.message,
          };
        }
      }
      else {
        return {
          address: "",
          status: " You must install Metamask, a virtual Ethereum wallet, in your browser."    
     }; 
    }
    
};

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
          const addressArray = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (addressArray.length > 0) {
            return {
              address: addressArray[0],
              // status: "👆🏽 Write a domain in the text-field above.",
              status:"",
            };
          } else {
            return {
              address: "",
              // status: "🦊 Connect to Metamask using the top right button.",
              status:"",
            };
          }
        } catch (err) {
          return {
            address: "",
            status: "😥 " + err.message,
          };
        }
      } 
      else {
        return {
          address: "",
          status: " You must install Metamask, a virtual Ethereum wallet, in your browser."    
     }; 
    }
};

export const updateMessage = async (address, message) => {
  
};
