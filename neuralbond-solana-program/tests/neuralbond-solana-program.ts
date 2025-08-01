import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NeuralbondSolanaProgram } from "../target/types/neuralbond_solana_program";

describe("neuralbond-solana-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const conn = provider.connection;

  const program = anchor.workspace.neuralbondSolanaProgram as Program<NeuralbondSolanaProgram>;
  const senderWallet = anchor.web3.Keypair.generate();
  const receiverWallet = anchor.web3.Keypair.generate();

  console.log(`PROGRAM: ${program.programId.toBase58()}`);
  console.log(`SENDER: ${senderWallet.publicKey.toBase58()}`);
  console.log(`RECEIVER: ${receiverWallet.publicKey.toBase58()}`);

  let [msgPDAAddress, msgPDABump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("neuralbondmessage", 'utf-8'), senderWallet.publicKey.toBuffer(), receiverWallet.publicKey.toBuffer()],
    program.programId
  )

  console.log(`MSG address: ${msgPDAAddress.toBase58()}`);
  console.log(`MSG bump: ${msgPDABump}`);

  let [msgConfigPDAAddress, msgConfigPDABump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("neuralbondmessageconfig", 'utf-8'), receiverWallet.publicKey.toBuffer()],
    program.programId
  )

  console.log(`MSGCNFG address: ${msgConfigPDAAddress.toBase58()}`);
  console.log(`MSGCNFG bump: ${msgConfigPDABump}`);

  let airdrop = async (wallet, latestBlockHash) => {
    await conn.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: await conn.requestAirdrop(
        wallet.publicKey,
        1 * anchor.web3.LAMPORTS_PER_SOL
      ),
    })
  }

	it("Accounts receive airdrops", async () => {
		const latestBlockHash = await conn.getLatestBlockhash();
		await airdrop(senderWallet, latestBlockHash);
		await airdrop(receiverWallet, latestBlockHash);
	});

    it("Msg price saved!", async () => {
    // Add your test here.
    const tx = await program.methods.saveMessageConfig(new anchor.BN(1000))
	.accounts({
		messageConfig: msgConfigPDAAddress,
		receiver: receiverWallet.publicKey,
	})
	.signers([receiverWallet]).rpc();
    console.log("Your transaction signature", tx);

	const account = await program.account.messageConfig.fetch(msgConfigPDAAddress);
	console.log("Message price: ", account.price.toNumber());

  });

  it("Msg sent!", async () => {
    // Add your test here.
    const tx = await program.methods.sendMessage("Hello, world!")
	.accounts({
		message: msgPDAAddress,
		sender: senderWallet.publicKey,
		receiver: receiverWallet.publicKey,
	})
	.signers([senderWallet]).rpc();
    console.log("Your transaction signature", tx);

	const account = await program.account.message.fetch(msgPDAAddress);
	console.log("Message content: ", account.encryptedMessage);

  });

    it("Msg deleted!", async () => {
    // Add your test here.
    const tx = await program.methods.deleteMessage()
	.accounts({
		message: msgPDAAddress,
		sender: senderWallet.publicKey,
		receiver: receiverWallet.publicKey,
	})
	.signers([receiverWallet]).rpc();
    console.log("Your transaction signature", tx);
  });

    it("Msg sent again!", async () => {
    // Add your test here.
    const tx = await program.methods.sendMessage("Hello, world number TWO!")
	.accounts({
		message: msgPDAAddress,
		sender: senderWallet.publicKey,
		receiver: receiverWallet.publicKey,
	})
	.signers([senderWallet]).rpc();
    console.log("Your transaction signature", tx);

	const account = await program.account.message.fetch(msgPDAAddress);
	console.log("Message content: ", account.encryptedMessage);

  });
});
