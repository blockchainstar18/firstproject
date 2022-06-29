import React from "react";
import { useEffect, useState } from "react";
// import { ConnectWallet } from "@3rdweb/react";
// import { useWeb3 } from "@3rdweb/hooks";
import Web3Modal, { PROVIDER_WRAPPER_CLASSNAME } from "web3modal";
import { ethers } from "ethers";
import { providerOptions } from "./providerOptions";
import {
  helloWorldContract,
  connectWallet,
  updateMessage,
  loadCurrentMessage,
  getCurrentWalletConnected,
  disconnectWallet,
} from "./util/interact.js";

// import {
//   init,
//   onConnect,
//   onDisconnect,
//   refreshAccountData,
//   fetchAccountData,
// } from "./example.js"

import metamask from "./metamask.png";
import coinbase from "./coinbase.png"
import logo from "./0xlogo.svg";
const BigNumber = require('bignumber.js')

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions // required
});


let newMessage = "";
let price;
// const { address, chainId, provider } = useWeb3();
const HelloWorld = () => {
  //state variables
  // const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("No connection to the network."); //default message
  const [newMessage_, setNewMessage] = useState("");
  const [pricemessage, setPrice] = useState("");
  const [provider, setProvider] = useState("");
  const [library, setLibrary] = useState("");
  const [account, setAccount] = useState("");
  const [viewtx, settx] = useState("");
  //called only once
  useEffect(async () => {
    // const message = await loadCurrentMessage();
    // setMessage(message);
//  init();
    // addSmartContractListener();

    // const {address, status} = await getCurrentWalletConnected();
    // setWallet(address);
    // setStatus(status);

    // addWalletListener();

    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  window.addEventListener('load', async () => {
    // alert("example")
   
    // document.querySelector("#btn-connect").addEventListener("click", onConnect);
    // document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
  });

  function addSmartContractListener() { //TODO: implement
  }

  function addWalletListener() { //TODO: implement
    // if (window.ethereum) {
    //   window.ethereum.on("accountsChanged", connectWallet);
    // }
  }

  // const connectWalletPressed = async () => { //TODO: implement
  //     const walletResponse = await onConnect();
  //     // setStatus(walletResponse.status);
  //     setWallet(walletResponse);
  //     alert(walletAddress)
  // };

  function containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  }

  const onUpdatePressed = async () => { //TODO: implement
    setStatus("")
    if(newMessage.length == 0){
      setStatus("Domain name cannot be empty!")
      return;
    }
    if(newMessage.length >=3 )
      if(newMessage.substring(newMessage.length - 3) === ".0x" ||newMessage.substring(newMessage.length - 3) === ".0X")
        newMessage = newMessage.substring(0,newMessage.length - 3)
    if(containsSpecialChars(newMessage))
    {
      setStatus("Incorrect format!")
      return
    }
    newMessage += '.0x'
    newMessage = newMessage.toLowerCase()
    setNewMessage(newMessage)
    setPrice('Price: '+price+' eth')
    

    const ispsble = await helloWorldContract.methods.registryIsPossible(newMessage).call();
    if(!ispsble){
      const registeredaddress = await helloWorldContract.methods.searchName(newMessage).call();
      setStatus("Unavailable: registered by "+registeredaddress);
      return;
    }

    
    if(account == ""){
      setStatus("Connect to wallet using the top right button!") 
      return;
    }

    let cost = new BigNumber(1e+18)
    cost *= price;
    // alert(cost)
    await  helloWorldContract.methods
      .addNameToRegistry(newMessage)
      .send({ from: account, value: cost }, function (err, res) {
        if (err) {
          console.log("An error occured", err)
          setStatus("User denied transaction")
          return
        }
        console.log("Hash of the transaction: " + res)
        settx('https://ropsten.etherscan.io/tx/' + res)          
      })

    
};
const onChangeFunc = async (e) =>
    {
    setNewMessage("");
    setStatus("")
    setPrice("")
    settx("")
    let len = e.target.value.length;
    if(e.target.value.length >= 3 )
      if(e.target.value.substr(e.target.value.length - 3) == ".0x" ||
      e.target.value.substr(e.target.value.length - 3) == ".0X")
        len -= 3;
    var temp = 10;
    // if(len > 4) 
    //     temp = 1;
    // else temp = 20 - (len - 1 ) * 5;
    for (let index = 0; index < len-1; index++) {
      temp/=2;
    }
    
    // if(temp > 20)
    //   temp = 20;    
    // setPrice(temp);
    price = temp;

    newMessage = e.target.value;
    // newMessage +='.0x'
    // const ispsble = await helloWorldContract.methods.registryIsPossible(newMessage).call();
    // if(!ispsble){
    //   const registeredaddress = await helloWorldContract.methods.searchName(newMessage).call();
    //   setStatus("Unavailable: registered by "+registeredaddress);
    //   return;
    // }
  }





  const connectWallet = async () => {
    // try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      setProvider(provider);
      setLibrary(library);
      if (accounts){
        setAccount(accounts[0]);
      }
      // alert(accounts)
      // setChainId(network.chainId);
    // } 
    // catch (error) {
    //   setError(error);
    // }
  };
  const refreshState = () => {
    setAccount("");
    // setChainId();
    // setNetwork("");
    // setMessage("");
    // setSignature("");
    // setVerified(undefined);
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  };

  //the UI of our component
  return (
    <div id="container">
      <img id="logo" src={logo} width="150" height="50"></img>
{/*       
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button> */}


        <div >
          {
            !account ? (
              <button className="walletButton" onClick={connectWallet}>Connect Wallet</button>
            ) : (
              <button className="walletButton" onClick={disconnect}>Disconnect ({String(account).substring(0, 6) +
                "..." +
                String(account).substring(38)})</button>
            )
          }
        </div>      
      <div id = "searchbar">
      <h1> Buy Once, Own For Life! </h1>
      <row>
      <h2> {newMessage_} </h2>
      <h3> {pricemessage}</h3>
      </row>
        <input
          type="text"
          placeholder="Search for your new domain"
          onChange={onChangeFunc}
          // value={newMessage}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
                onUpdatePressed()
            }
          }}
        />
        <button id="publish" onClick={onUpdatePressed}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg> Search
        </button>
        <p id="error">{status}</p>
        <p>
          {
            viewtx !=="" ? (<p id = "success">Congratulations! You have registered the domain {newMessage_} &nbsp;&nbsp;&nbsp;
            <a href = {viewtx} target = '_blank'>etherscan</a></p> ):(<p></p>)
          }
        </p>
      
      </div>
      <div id = "board">
      </div>
    </div>
     

  );
};

export default HelloWorld;
