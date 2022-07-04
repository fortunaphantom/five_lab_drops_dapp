import { AnyAction } from '@reduxjs/toolkit';
import ImageFlipper from 'components/ImageFlipper';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectWallet, disconnectWallet } from 'slices/web3Slice';
import { AppDispatch } from 'store';
import Web3 from 'web3';
import contractAbi from 'DreamBuds/DreamBuds.json';
import contractConfig from 'DreamBuds/config.json';
import { NotificationManager } from 'components/Notification';
import { setLoading } from 'slices/viewState';

interface IHome {}

const Home = (props: IHome) => {
  const dispatch = useDispatch<AppDispatch>();

  const [mintCount, setMintCount] = useState<number>(1);
  const web3 = useSelector<any, any>(state => state.web3.web3);
  const account = useSelector<any, string | null>(state => state.web3.selectedAddress);
  const [connectText, setConnectText] = useState<string>("Connect");
  const [contract, setContract] = useState<any>();
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [soldCount, setSoldCount] = useState<number>(0);

  useEffect(() => {
    dispatch(connectWallet());
    const id = setInterval(async () => {
      if (contract) {
        const _totalSupply = await contract.methods.totalSupply().call();
        setSoldCount(_totalSupply);
      }
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const trimAddress = (addr: string): string => {
    return "0x" + addr.substring(2, 6).toUpperCase() + "..." + addr.substring(addr.length - 3, addr.length).toLowerCase();
  }

  useEffect(() => {
    console.log({account})
    setConnectText(account ? "Connected to " + trimAddress(account) : "Connect");
  }, [account]);

  useEffect(() => {
  }, [])

  useEffect(() => {
    if (!web3) {
      setContract(null);
      return;
    }

    const _contract = new web3.eth.Contract(
      contractAbi as any,
      contractConfig.contractAddress
    );
    setContract(_contract);

    (async function() {
      const _price = await _contract.methods.price(1).call();
      const _QUANTITY = await _contract.methods.QUANTITY().call();
      const _price1 = Number(Web3.utils.fromWei(_price, 'ether'));
      setPrice(_price1);
      setQuantity(_QUANTITY);
    })();
  }, [web3]);

  const onConnect = () => {
    dispatch(account ? disconnectWallet() : connectWallet());
  }

  const onMint = async () => {
    if (!web3) {
      NotificationManager.warning("Wallet not connected");
      return;
    }

    const contract = new web3.eth.Contract(
      contractAbi as any,
      contractConfig.contractAddress
    );

    //dispatch(setLoading(true));
    try {
      const tx = {
        from: window.ethereum.selectedAddress,
        to: contractConfig.contractAddress,
        value: Web3.utils.toWei(String(price * mintCount)),
        data: contract.methods.mint(mintCount).encodeABI(),
      };

      console.log(tx);
      await web3.eth.sendTransaction(tx);
      NotificationManager.success("Done", "Done");
    } catch (e) {
      console.log(e);
    }
    //dispatch(setLoading(false));
  }

  return (
    <div className='home-page'>
      <header>
        <div className='title'>Dream</div>
        <img src='./assets/logo.png' alt="Dream Buds" />
        <div className='title'>Buds</div>
        <button className='btn connect' type='button' onClick={onConnect}>{connectText}</button>
        <div className="social-area">
          <a href="#" title="#"><img src="./assets/8725815_discord_icon.png" style={{width: '50px'}} alt="discord"></img></a>
          <a href="#" title="#"><img src="./assets/5296516_tweet_twitter_twitter logo_icon.png" style={{width: '40px'}} alt="discord"></img></a>
        </div>
      </header>
      <div className="content">
        <div className="mint">
          <div className="arts">
            <ImageFlipper />
            <ImageFlipper />
            <ImageFlipper />
            <ImageFlipper />
            <ImageFlipper />
            <ImageFlipper />
            <ImageFlipper />
            <ImageFlipper />
            <ImageFlipper />
          </div>
          <div className="mint-area">
            <div className='status'>SOLD: {quantity}/{soldCount}</div>
            <div className="mint-control">
              <button className='btn minus' type='button' onClick={() => setMintCount(mintCount <= 1 ? 1 : mintCount - 1)}>-</button>
              <button className='btn mint' type='button' onClick={onMint}>Mint: {mintCount}</button>
              <button className='btn plus' type='button' onClick={() => setMintCount(mintCount + 1)}>+</button>
            </div>
            <div className="price">Amount: {mintCount * price} ETH</div>
          </div>
        </div>
        <div className="roadmap">
          1. levels 1000<br/>
          2. levels 2000   lvl 2 we should airdrop the 500 <br/>
          3. levels 3000  level 3 we will give  away 500 nfts <br/>
          4. levels 4000   100 whitelist spots 550 nfts<br/>
          5. levels 5000 550 nfts<br/>
          <br/><br/>
          
          Build a community and growing it <br/>
          Pay back our parents<br/>
          Build defi protocal <br/>
          Rise the floor price <br/>
          Filping nft game <br/>
        </div>
      </div>
    </div>
  )
}

export default Home;
