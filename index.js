// Imports
import { ethers } from "./ether-5.6.esm.min.js"
import { abi,contractAddress } from "./constants.js"

// Getting eelement from UI
const connectButton =document.getElementById('connectButton')
const fundButton=document.getElementById('fundButton')
const balanceButton = document.getElementById('balanceButton')
const withdrawButton = document.getElementById('withdrawButton')

// adding click event
connectButton.onclick=connect
fundButton.onclick=fund
balanceButton.onclick=getBalance
withdrawButton.onclick=withdraw

// Connecting to Wallet (MetaMask)
async function connect(){
  if(typeof window.ethereum !=='undefined'){
    try{
        await window.ethereum.request({method:"eth_requestAccounts"})
        connectButton.innerHTML="Connected"
    }catch(error){
        console.error(error)
    }
  }else{
    connectButton.innerHTML="Please install the metamask"
  }
}

// fund function
async function fund(){
    const ethAmount=document.getElementById('ethAmount').value  
    console.log(`Funding with ${ethAmount}...`)
  if(typeof window.ethereum !=='undefined'){
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    console.log(signer)
    // contract
    const contract = new ethers.Contract(contractAddress,abi,signer)
    try{
         const transactionResponse = await contract.fund({value:ethers.utils.parseEther(ethAmount)})
        // Wait for the transaction to be mine
        await listenForTransactionMine(transactionResponse,provider);
        console.log('Done !')
        alert('Transaction Complete successfully')
    }catch(error){
       console.log(error)
   }
  }
}
function listenForTransactionMine(transactionResponse,provider){
  console.log(`Mining ${transactionResponse.hash}`)
  return new Promise((resolve,reject)=>{
    provider.once(transactionResponse.hash,(transactionReceipt)=>{
       console.log(`Completed with ${transactionReceipt.confirmations} confirmations.`)
       resolve()
    })
  })
}

// Reading from blockchain - reading balance
async function getBalance(){
  if(typeof window.ethereum !='undefined'){
    const provider= new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    alert(ethers.utils.formatEther(balance))
    console.log(ethers.utils.formatEther(balance))
  }
}
// Withdraw
async function withdraw(){
  if(typeof window.ethereum !='undefined'){
    console.log('Withdring...')
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress,abi,signer)
    try{
        const transactionResponse= await contract.withdraw()
        await listenForTransactionMine(transactionResponse,provider)
        alert('Withdraw Successfully')
    }catch(error){
      console.log(error)
    }
  }
}
