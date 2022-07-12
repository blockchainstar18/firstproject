require('dotenv').config();
const alchemyKey = 'https://eth-mainnet.alchemyapi.io/v2/gAQOlZdHS3eIpGULYGNg2jRhyxwmA-DS';//process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const contractABI = require("../contract-abi.json");
// const contractAddress = "0x9042ef10E7D853bA62d30Fe2a018155322735DFc";

const contractAddress = "0xaf2f087149489a9b887804Bc196A5A17ab9a73Ef";



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
