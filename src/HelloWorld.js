import React from "react";

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Web3Modal, { PROVIDER_WRAPPER_CLASSNAME } from "web3modal";
import { ethers } from "ethers";
import { providerOptions } from "./providerOptions";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
// import Accordion from './Accordion';
// import { accordionData } from './content';
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
import { findAllByTestId } from "@testing-library/react";
import { utils } from "ethers";

const BigNumber = require('bignumber.js')

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions // required
});


let newMessage = "";
let price;
let element;
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
  const [popupOpened, setPopup] = useState(false);
  const [saleMessage, setSaleMessage] = useState("")
  const [saleName, setSaleName] = useState("")
  const [salePrice, setSalePrice] = useState(0)
  const [buyPrice, setBuyPrice] = useState(0)
  const [saleBool, setSaleBool] = useState([]);
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
    setSaleMessage("")
    if (newMessage.length == 0) {
      setStatus("Domain name cannot be empty!")
      return;
    }
    if (newMessage.length > 3)
      if (newMessage.substring(newMessage.length - 3) === ".0x" || newMessage.substring(newMessage.length - 3) === ".0X")
        newMessage = newMessage.substring(0, newMessage.length - 3)
    if (containsSpecialChars(newMessage)) {
      setStatus("Only letters and numbers are currently recognized!")
      return
    }
    var english = /^[A-Za-z0-9]*$/;
    for (let index = 0; index < newMessage.length; index++) {
      if (!english.test(newMessage[index])) {
        setStatus("Only English is currently recognized!")
        return
      }
    }

    newMessage += '.0x'
    newMessage = newMessage.toLowerCase()
    setNewMessage(newMessage)
    setPrice('Price: ' + price + ' ETH')


    const ispsble = await helloWorldContract.methods.registryIsPossible(newMessage).call();
    if (ispsble == 1) {
      const price_ = await helloWorldContract.methods.getPrice(newMessage).call();
      setBuyPrice(price_)
      return
    }

    if (ispsble == 2) {
      const registeredaddress = await helloWorldContract.methods.getUser(newMessage).call();
      setStatus("Unavailable: registered by " + registeredaddress);
      return;
    }


    if (account == "") {
      setStatus("Connect to wallet using the top right button!")
      return;
    }

    let cost = utils.parseEther(price.toString())

    await helloWorldContract.methods
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
    const lists = await helloWorldContract.methods.getNames(account).call();
    setlist(lists)
    setSaleBool([]);
    lists.forEach(async list=>{
      let temp = await issale(list);
      setSaleBool(saleBool => [...saleBool, temp]);
    })
  };


  const prepareSale = async () => {
    let cost = utils.parseEther(salePrice)
    // alert(cost)
      await helloWorldContract.methods.prepare_sale(saleName, cost)
        .send({ from: account }, function (err, res) {
          if (err) {
            console.log("An error occured", err)
            return
          }
          console.log("Hash of the transaction: " + res)
          setSaleMessage("Congratulations! Your domain is up for sale")
        });
      // const lists = await helloWorldContract.methods.getNames(account).call();
      // setlist(lists)
      setSaleBool([]);
      list.forEach(async item=>{
        let temp = await issale(item);
        console.log(temp)
        setSaleBool(saleBool => [...saleBool, temp]);
      })
  }

  const onChangeFunc = async (e) => {
    setNewMessage("");
    setStatus("")
    setPrice("")
    settx("")
    setSaleMessage("")
    setBuyPrice(0)
    let len = e.target.value.length;
    if (e.target.value.length > 3)
      if (e.target.value.substr(e.target.value.length - 3) == ".0x" ||
        e.target.value.substr(e.target.value.length - 3) == ".0X")
        len -= 3;
    var temp = 10;
    for (let index = 0; index < len - 1; index++) {
      temp /= 2;
    }
    price = temp;
    newMessage = e.target.value;
  }

  const salePriceChange = async (e) => {
    setSalePrice(e.target.value)
  }

  const buyFromUser = async () => {

    await helloWorldContract.methods
      .addNameToRegistry(newMessage)
      .send({ from: account, value: buyPrice }, function (err, res) {
        if (err) {
          console.log("An error occured", err)
          setStatus("User denied transaction")
          return
        }
        console.log("Hash of the transaction: " + res)
        settx('https://ropsten.etherscan.io/tx/' + res)
      })



    setBuyPrice(0)
    const lists = await helloWorldContract.methods.getNames(account).call();
    setlist(lists)
    setSaleBool([]);
    lists.forEach(async list=>{
      let temp = await issale(list);
      setSaleBool(saleBool => [...saleBool, temp]);
    })
  }

  const connectWallet = async () => {
    const provider = await web3Modal.connect();
    const library = new ethers.providers.Web3Provider(provider);
    const accounts = await library.listAccounts();
    setProvider(provider);
    setLibrary(library);
    if (accounts) {
      setAccount(accounts[0]);
      const lists = await helloWorldContract.methods.getNames(accounts[0]).call();
      setlist(lists)
      setSaleBool([]);
      lists.forEach(async (list)=>{
        let temp = await issale(list);
        setSaleBool(saleBool => [...saleBool, temp]);
      })
    }

    // const flag = await helloWorldContract.methods.getIssold(accounts[0]).call()
    // if(flag)
    //   alert('Attention! Your domain (specific domain) has sold for (amount) ETH')
  };
  const refreshState = () => {
    setAccount("");
    setlist("")
    setSaleMessage("")
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  };


  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/aboutus`;
    navigate(path);
    window.scrollTo(0, 0)
  }

  const issale = async (name) => {
    const issale_ = await helloWorldContract.methods.getissale(name).call();
    // console.log
    return {name: name, issale: issale_};
  }


  //the UI of our component
  return (
    <div>
      <img id="logo" src={logo}></img>
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
      <div id="searchbar">
        <h1><b> Buy Once, Own For Life </b></h1>
        <row><div id="ox">.0x</div></row>
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
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg> Search
          </button>
        </row>
        <p id="error">{status}</p>
        <p>
          {
           buyPrice != 0 ? (<p id = "error">Buy from owner for {buyPrice/1000000000000000000}  ETH 
          <button class = "buybut" onClick={buyFromUser}>Buy</button> </p>):(<p></p>)
          }
          {
            viewtx !== "" ? (<p id="success">Congratulations! You have registered the domain {newMessage_} &nbsp;
              <a href={viewtx} target='_blank'>Etherscan</a>
            </p>)
              : (<p></p>)

          }
          {(<p id="success">{saleMessage}</p>)}
        </p>
        <row>
          {
            !account ? (
              <p></p>
            ) : (
              <div class="dropdown">
                <button class="dropbtn" >Your domains</button>
                <div class="dropdown-content">
                  {
                    list.length > 0 ?
                      list.map((name) => {
                        const is = saleBool.filter(s=>s.name === name);
                        const a = (
                          (is.length > 0 ? is[0].issale:false)
                            ?
                            (<a id="salecheck" onClick={() => { setPopup(true); setSaleName(name); setSaleMessage("") }}>{name}</a>) :
                            (<a onClick={() => { setPopup(true); setSaleName(name); setSaleMessage("") }}>{name}</a>)
                          
                        )
                        
                        return a;
                      }
                      )
                      : (<p></p>)
                  }
                </div>
              </div>
            )
          }
        </row>

        <div class="popup-wrapper">
          <Popup open={popupOpened} onClose={() => { setPopup(false); }}>
            <row>
              <h5>How much would you like to sell your domain for?</h5>
              <input id="priceinput" type="text" onChange={salePriceChange}
                placeholder="ETH"></input>
              <h5> &nbsp;ETH</h5>
            </row>
            <row>
              <p id="font">(Note: 1% of the sale will go to ZeroX Domains)</p>
            </row>
            <row>
              <button id="cancelb" onClick={() => { setPopup(false); setSaleName(""); setSalePrice(0) }}>Cancel</button>
              <button id="confirmb" onClick={async () => {
                prepareSale()
                setPopup(false)
              }}>Confirm</button>
            </row>

          </Popup>

        </div>

        <div id="board">
        </div>
        <div>
          <div class="bluearea">
            <h1>FAQ</h1>
            <div class="accordion" id="accordionExample">

              <div class="accordion-item">
                <h2 class="accordion-header" id="heading1">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="false" aria-controls="collapse1">
                    Where is my domain stored?
                  </button>
                </h2>
                <div id="collapse1" class="accordion-collapse collapse" aria-labelledby="heading1" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    Your domain is stored on the blockchain after it has been purchased.
                  </div>
                </div>
              </div>

              <div class="accordion-item">
                <h2 class="accordion-header" id="headingTwo">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    What wallets are supported?
                  </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    Metamask and Coinbase Wallet are supported.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingThree">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    Are there yearly fees for my domain?
                  </button>
                </h2>
                <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    Short answer: no.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header" id="heading4">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4" aria-expanded="false" aria-controls="collapse4">
                    How do I know that my domain is on the Ethereum blockchain?
                  </button>
                </h2>
                <div id="collapse4" class="accordion-collapse collapse" aria-labelledby="heading4" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    Straight after you purchase your domain, an Etherscan link will appear, directing you
                    to the particular domain transaction. Please note that this link will disappear after you refresh or leave the website.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>


      <div className='footer'>
        <div id="copyright">Copyright © 2022 ZeroX Domains.<br /> All Rights Reserved.</div>
        <div id="aboutus"><p onClick={routeChange} class="about"> About us</p></div>
        <div id="contactus">
          Contact us&nbsp;&nbsp;&nbsp;
          <a href="https://twitter.com/ZeroxDomains" target="_blank" >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#8090d1" class="bi bi-twitter" viewBox="0 0 16 16">
              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
            </svg>
          </a><br/>
          info@zerox.domains
        </div>
      </div>
    </div>


  );
};

export default HelloWorld;



