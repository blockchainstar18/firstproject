import React from "react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
// import logo from "./0xlogo.svg";
import logo from "./image_.png"
import ox from "./0x.png"
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
  const [list, setlist] = useState("")
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
    helloWorldContract.events.UpdatedBalance({}, (error, data) => {
      if (error) {
        alert(error.message);
      } else {
        alert(data.returnValues[0])
      }
    });
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
    if(newMessage.length >3 )
      if(newMessage.substring(newMessage.length - 3) === ".0x" ||newMessage.substring(newMessage.length - 3) === ".0X")
        newMessage = newMessage.substring(0,newMessage.length - 3)
    if(containsSpecialChars(newMessage))
    {
      setStatus("Only letters and numbers are currently recognized!")
      return
    }
    var english = /^[A-Za-z0-9]*$/;
    for (let index = 0; index < newMessage.length; index++) {
      if (!english.test(newMessage[index]))
        {
          setStatus("Only English is currently recognized!")
          return
        }
    }

    newMessage += '.0x'
    newMessage = newMessage.toLowerCase()
    setNewMessage(newMessage)
    setPrice('Price: '+price+' ETH')
    

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
    const lists = await helloWorldContract.methods.searchAddress(account).call();
        setlist(lists)
    
};
const onChangeFunc = async (e) =>
    {
    setNewMessage("");
    setStatus("")
    setPrice("")
    settx("")
    let len = e.target.value.length;
    if(e.target.value.length > 3 )
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
      // const network = await library.getNetwork();
      setProvider(provider);
      setLibrary(library);
      if (accounts){
        setAccount(accounts[0]);
        const lists = await helloWorldContract.methods.searchAddress(accounts[0]).call();
        setlist(lists)
      }
      
  };
  const refreshState = () => {
    setAccount("");
    setlist("")
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


  let navigate = useNavigate(); 
  const routeChange = () =>{ 
      let path = `/aboutus`; 
      navigate(path);
      window.scrollTo(0, 0)
  }

  //the UI of our component
  return (
    <div>
      <img id="logo" src={logo}></img>
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
      <h1> Buy Once, Own For Life </h1>
      <row><div id = "ox">.0x</div></row>
      <row>
      <h2> {newMessage_} </h2>
      <h3> {pricemessage}</h3>
      </row>
      
      <row>
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
        </row>
        <p id="error">{status}</p>
        <p>
          {
            viewtx !=="" ? (<p id = "success">Congratulations! You have registered the domain {newMessage_} &nbsp;
            <a href = {viewtx} target = '_blank'>Etherscan</a>
            </p> )
            :(<p></p>)
          }
        </p>
        <row>
          {
            !account ? (
              <p></p>
            ) : (
              <div class="dropdown">          
                <button class="dropbtn">Your domains</button>
                <div class="dropdown-content">
                  {list.length > 0 ? list.map(name => (<a href="#">{name}</a>))
                  :(<p></p>)}
                </div>
              </div>
            )
          }
        </row>
        
      
      </div>
      <div id = "board">
      </div>

      <div className='footer'>
        <div id = "aboutus">Copyright © 2022 ZeroX Domains.<br/> All Rights Reserved.</div>
          <div id = "aboutus"><p onClick={routeChange} class = "about"> About us</p></div>
          <div id = "aboutus">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Contact us&nbsp;&nbsp;&nbsp;
            <a href = "https://twitter.com/ZeroxDomains" target="_blank" >
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#8090d1" class="bi bi-twitter" viewBox="0 0 16 16">
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
              </svg>
            </a>
        </div>
      </div>
    </div>
     
    
  );
};

export default HelloWorld;
