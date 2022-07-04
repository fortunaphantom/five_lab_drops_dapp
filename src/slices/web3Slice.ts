import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID,
      bridge: 'https://bridge.walletconnect.org/',
    },
  },
};

const web3Modal = new Web3Modal({
  network: 'mainnet', // optional
  cacheProvider: false, // optional
  providerOptions, // required
});

let web3: any;

const initialState = {
  web3: null as any,
  selectedAddress: undefined as any,
};

export const connectWallet = createAsyncThunk('connectWallet', async () => {
  try {
    const provider = await web3Modal.connect();
    web3 = new Web3(provider);
    console.log(web3);
    return web3;
  } catch {
    return null;
  }
});

export const disconnectWallet = createAsyncThunk(
  'disconnectWallet',
  async () => {
    try {
      await web3Modal.clearCachedProvider();
      return null;
    } catch {
      return null;
    }
  }
);

export const web3Slice = createSlice({
  name: 'web3',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(connectWallet.fulfilled, (state: any, action: IAction) => {
      state.web3 = action.payload;
      console.log({ action });
      state.selectedAddress = window?.ethereum?.selectedAddress;
    });
    builder.addCase(
      disconnectWallet.fulfilled,
      (state: any, action: IAction) => {
        state.web3 = null;
        state.selectedAddress = null;
      }
    );
  },
});

export default web3Slice.reducer;
