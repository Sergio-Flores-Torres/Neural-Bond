# NeuralBond

"Chooms! I have a hot new Solana mod for you, right here. They call it -NeuralBond- and it's fresh off the SAFT.Industries factory. It's encrypted, it's descentralized, it's anoymous, it allows you receive messages from anybody and charge them for the privilege... or you can let them message you for free, if you're into that..."

## TLDR
A Solana on-chain messaging system, encrypted, public and descentralized with the purpose of enabling the users to receive paid messages from the public and eliminate spam.

## Rationale

Internet creators need to stay in contact with their audiences to enable business transactions or conduct monetized communications, for example:

- A Youtuber might want to allow incoming messages from their audience to explore sponsorhip opportunities
- An Accountant or Lawyer might want to offer paid consultation services
- A writer or storyteller might want to conduct monetized chats for fantasy content for entertainment.

Currently, all of the above need to rely on other platforms, or to open their email addresses to the public; the problem with that, is that

1. There's no easy way to monetize it, and
2. They receive a lot of spam and otherwise unwanted messages.

## Proposed solution

Neuralbond allows a creator to publish their public Solana address, to receive anonymous messages, on chain, and charge a specified amount for the privilege. The reasons to do so, are up to the participants, but the idea is that when the sender has to pay, they probably have a valid reason to engage in the communication.

## How it works

A web app, fully descentralized allows the receiver to connect their Phantom wallet and configure a price to initiate communication (if so desired), then they only need to make available said address to the publir or potential senders.

With the same web app, a sender, can connect their Phantom wallet, input the receiver's address and send a message by paying the fee.

The messages are stored on chain, encrypted end-to-end (because, data on-chain is fully public) and the messages are deleted upon retrieval by the recipient.

## Caveats

This app may or may not be secure; it's not fully tested, we're not cryptography experts. The goal here is to have discreet comms, not ultra-secure-quantum messages. So don't go around sending weird stuff that you'd be uncomfortable having exposed, cause a determined hacker will *probably* find a way to read it. 

## Permitted uses

Any legal, personal, non-commercial use, is allowed. We reserve the right to deploy a commercial solution using this software.



