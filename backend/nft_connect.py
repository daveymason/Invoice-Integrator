from web3 import Web3
import os
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure Web3
web3 = Web3(Web3.HTTPProvider(os.getenv("INFURA_ENDPOINT")))

# Smart contract address and ABI
contract_address = os.getenv("CONTRACT_ADDRESS")
with open("path_to_contract_abi.json") as f:
    contract_abi = json.load(f)

contract = web3.eth.contract(address=contract_address, abi=contract_abi)

def mint_nft(recipient, token_uri):
    # Ensure you have the private key securely stored
    private_key = os.getenv('PRIVATE_KEY')

    # Create the transaction
    nonce = web3.eth.getTransactionCount(web3.eth.default_account)
    txn = contract.functions.mintNFT(recipient, token_uri).buildTransaction({
        'chainId': 1,  # or your testnet ID
        'gas': 2000000,
        'gasPrice': web3.toWei('20', 'gwei'),
        'nonce': nonce,
    })

    # Sign the transaction
    signed_txn = web3.eth.account.sign_transaction(txn, private_key=private_key)
    tx_hash = web3.eth.sendRawTransaction(signed_txn.rawTransaction)

    return tx_hash.hex()