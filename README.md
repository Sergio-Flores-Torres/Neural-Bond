# NeuralBond

![NeuralBond by SAFT.Industries](web-fe/public/title.jpg)

"Chooms! I have a hot new Solana mod for you, right here. They call it -NeuralBond- and it's fresh off the SAFT.Industries factory. It's encrypted, it's decentralized, it's anoymous, it allows you receive messages from anybody and charge them for the privilege... or you can let them message you for free, if you're into that..."

## TLDR
A Solana on-chain messaging system, encrypted, public and decentralized with the purpose of enabling the users to receive paid messages from the public and eliminate spam.

## Purpose

Street-cred and kicks

## Rationale

Internet creators need to stay in contact with their audiences to enable business transactions or conduct monetized communications, for example:

- A youtuber might want to allow incoming messages from their audience to explore sponsorship opportunities
- An accountant or lawyer might want to offer paid consultation services
- A writer or storyteller might want to conduct monetized chats for fantasy content for entertainment.

Currently, all of the above need to rely on other platforms, or to open their email addresses to the public; the problem with that, is that

1. There's no easy way to monetize it, and
2. They receive a lot of spam and otherwise unwanted messages.

## Proposed solution

Neuralbond allows a creator to publish their public Solana address, to receive anonymous messages, on chain, and charge a specified amount for the privilege. The reasons to do so, are up to the participants, but the idea is that when the sender has to pay, they probably have a valid reason to engage in the communication.

## How it works

A web app, fully decentralized allows the receiver to connect their Phantom wallet and configure a price to initiate communication (if so desired), then they only need to make available said address to the public or potential senders.

With the same web app, a sender, can connect their Phantom wallet, input the receiver's address and send a message by paying the fee.

The messages are stored on chain, encrypted end-to-end (because otherwise, data on-chain is fully public) and the messages are deleted upon retrieval by the recipient, returning the rent to the sender.

So, because we cannot exchange the encryption keys securely, we are relying in public knowledge: We know the public address of the recipient, and the recipient will know the public address of the sender, and both, being Solana addresses, have a private key. So, what we do is use tweetnacl to encrypt/decrypt messages with both pairs, and use Phantom to sign the transaction.

Note that, the ED keys use by Solana are unsuitable for encryption, so we're doing a hackery thing to convert them into Curve, with the ed2curve library

**IMPORTANT**: For added safety, generate a new wallet to use with this app, since you'll have to copy your private key. It is not transmitted, just used locally to encrypt/decrypt. Maybe in a future version we'll add a more robust system to handle this issue.

## Caveats

This app may or may not be secure; most likely it is not, we're not cryptography experts. The goal here is to have discreet comms, safe from casual observers, not ultra-secure-quantum messages. So don't go around sending weird stuff that you'd be uncomfortable having exposed, cause a determined hacker will *probably* find a way to read it, mmmmmkay? Plus the copy pasting of the private key is a thing.

## Other stuff

TBH having a way to use your Solana keypair to move encryted data would be a useful feature to have solidly available on chain. Above my current paygrade, but later, who knows?

## Stack

Node 22  
React 18  
FE built AI assisted with Bolt  
twetnacl for encryption  
ed2curve for the conversion   
anchor 0.31.1   

## Screenshot

![NeuralBond by SAFT.Industries](web-fe/public/screenshot.jpg)

## Permitted uses

Use it for personal, non-commercial purposes. We reserve the right to deploy a commercial solution using this software.



