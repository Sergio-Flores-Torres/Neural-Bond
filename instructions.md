# HOW TO USE/TEST

Since this version of NeuralBond is just the Proof of Concept, with the main goal of confirming if it was possible to use the Solana Keypairs to do asymmetric encryption and thus exchange paid messages over the public blockchain, some details are unpolished, though they work.

Note: We are seeing an error on Phantom, when using DEVNET, where the transaction simulation is reported as "reverted", however, if you proceed, it works, but then you get an error stating that the "transaction had already been processed"; implying it had been sent twice. Not sure if this is a devnet or phantom error, temporal, however it does not affect the program results or operation.

0. Make sure you are using https://neuralbond.saft.industries; this app is already configured to use DEVNET
1. For testing yourself the back and forth of messages, it's best to use 2 browser windows, each with Phantom installed. It is possible to test on the same browser, but it is more difficult to change constantly the wallet address.
2. Create in Phantom the 2 wallets you will be using for testing, both will need some SOL for configuration and sending messages. Configure your wallets to use DEVNET. 
3. Fund them from https://faucet.solana.com
4. A given address needs to have configured its Minimum Price to receive messages, so that other addresses can send messages to it. The price can be zero, but it has to be configured. To do this, connect your wallet, type the value on the Price box, and click "Save Configuration." This will send a Solana transaction to store your price, which you will sign with Phantom.
5. To send a message, go to wallet A and copy the private key into the box "Encryption key", type your message, and paste the destination address, that would be wallet B, on the corresponding textbox.
6. Click Send. Your key will be used locally to encrypt your message, with you will then sign with Phantom, then it will be stored on chain, for retrieval by Wallet B. The reason why we have to manually paste the private key, is because it cannot be exported from Phantom, and we want to use the same key for encryption and for signing. In the future this will change, since as you can see it is a fairly troublsome aspect.
7. On the browser with wallet B, paste Wallet's B key. Otherwise you won't be able to decrypt the messages.
8. In the incoming messages section, click the refresh button. You will see now the message sent by Wallet A.
9. Finally, the system only suports 1 message stored per sender-receiver, so in order for Wallet B, to receive another message from Wallet A, you have to delete the existing one. You do that by hovering over the message, and clicking the delete button.


