import {ethers} from 'ethers'

export const connectMetamask = async () => {
    if(typeof window.ethereum!=='undefined'){
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            if (accounts.length === 0) {
                throw new Error('No accounts found in Metamask');
              }
            console.log("Connected with Address : ",accounts[0])

            const connectedWalletAddress = accounts[0]

            return {connectedWalletAddress,provider,signer}
        } catch (error) {
            console.log("Error in connecting metamask")
        }
    }
}