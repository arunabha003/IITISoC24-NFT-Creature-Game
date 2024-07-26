import { useEffect, useState } from 'react';
import axios from 'axios';
import { connectMetamask } from '../utils/connectMetamask.js';

const useCritters = () => {
  const [connectedUserAddress, setConnectedUserAddress] = useState(null);
  const [allCritterData, setAllCritterData] = useState(null);

  axios.defaults.withCredentials = true;

  const useMetamask = async () => {
    const { connectedWalletAddress } = await connectMetamask();
    setConnectedUserAddress(connectedWalletAddress);
  };

  const walletVerification = async () => {
    const response = await axios.post(
      'http://localhost:5000/api/v1/check/onSameWallet',
      { connectedAddress: connectedUserAddress },
      { withCredentials: true }
    );
    const { isValid } = response.data;

    if (!isValid) {
      console.log('Connect same wallet as of the user');
      return false;
    }
    return true;
  };

  const fetchData = async () => {
    const fetched = await axios.get('http://localhost:5000/api/v1/critter/fetchCritters', { withCredentials: true });
    setAllCritterData(fetched.data);
    console.log(fetched.data);
  };

  useEffect(() => {
    useMetamask();
  }, []);

  useEffect(() => {
    if (connectedUserAddress) {
      walletVerification().then((isValid) => {
        if (isValid) {
          fetchData();
        }
      });
    }
  }, [connectedUserAddress]);

  return { allCritterData };
};

export default useCritters;
