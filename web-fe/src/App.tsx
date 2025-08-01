import React, { useState, useMemo, useEffect } from 'react';
import { Send, Zap, MessageCircle, User, Settings, DollarSign, Github, ExternalLink, Linkedin } from 'lucide-react';
import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import '@solana/wallet-adapter-react-ui/styles.css';
import { Program, Idl, AnchorProvider, setProvider, web3, BN } from "@coral-xyz/anchor";
import { test } from './encryption';
import { AnchorWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Buffer } from 'buffer';
window.Buffer = Buffer;

import idl from "./neuralbond_solana_program.json";
import type { NeuralbondSolanaProgram } from "./neuralbond_solana_program";

 
function Main() {
  const [message, setMessage] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [address, setAddress] = useState('');
  const [messagePrice, setMessagePrice] = useState('0.001');
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [lastSent, setLastSent] = useState<string | null>(null);
  const [lastConfigSaved, setLastConfigSaved] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  useEffect(() => {
	setIsClient(true);
  }, []);

  const [receivedMessages, setReceivedMessages] = useState([
    {
      id: 1,
      content: "Neural bond established. Welcome to the network, choom.",
      senderAddress: "1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z",
      timestamp: "2077-12-25T15:30:00Z"
    },
    {
      id: 2,
      content: "Data packet received. Initiating secure protocol handshake.",
      senderAddress: "9Z8Y7X6W5V4U3T2S1R0Q9P8O7N6M5L4K3J2I1H0G9F8E7D6C5B4A3",
      timestamp: "2077-12-25T16:45:00Z"
    }
  ]);

  // Placeholder API call function
  const sendMessage = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual endpoint later
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Placeholder for actual API call:
      // const response = await fetch('/api/send-message', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message, address })
      // });
      
      setLastSent(new Date().toLocaleTimeString());
      setMessage('');
      setAddress('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder function to fetch received messages
  const fetchReceivedMessages = async () => {
    // Placeholder for actual API call:
    // const response = await fetch('/api/received-messages');
    // const messages = await response.json();
    // setReceivedMessages(messages);
  };

  // Placeholder function to save configuration
  const saveConfiguration = async () => {
    setIsSavingConfig(true);
    try {
		const { solana } = window;

		if (solana && solana.isPhantom && solana.isConnected) {
			console.log('Phantom wallet connected!');

			const provider = new AnchorProvider(connection, wallet!, {commitment: 'confirmed'});
			setProvider(provider);
			// we can also explicitly mention the provider
			const program = new Program(idl as NeuralbondSolanaProgram, provider);	

			try {
				const tx = await program.methods.saveMessageConfig(new BN(parseFloat(messagePrice) * web3.LAMPORTS_PER_SOL))
					.accounts({
					})
					.rpc();
					console.log("Your transaction signature", tx);

			} catch (error) {	
				alert(error)
			}

		} else {
			console.log('Phantom wallet not connected...');
			alert('Please connect your Phantom wallet first.');
		}
      
      setLastConfigSaved(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to save configuration:', error);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };
  const isValidForm = message.trim().length > 0 && address.trim().length > 0;
  const isValidPrice = messagePrice.trim().length > 0 && !isNaN(parseFloat(messagePrice)) && parseFloat(messagePrice) >= 0;

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Cyberpunk grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

		<img src="/title.jpg" alt="Neural Bond Logo" width={512} height={288} className="w-512 h-288 mx-auto" />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-cyan-400 mr-2" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                Neural Bond
              </h1>
            </div>

            <p className="text-gray-400 text-sm">Possibly totally unsafe Solana messaging protocol by SAFT.Industries <br/> PoC - DEVNET version</p>
			<br/>
           {isClient && <WalletMultiButton />}

            {/* Instructions */}
            <div className="mt-8 space-y-2">
              <div className="flex items-center text-xs text-gray-500">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 flex-shrink-0"></div>
                <span>Generate a new wallet on Phantom and paste your private key</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <div className="w-2 h-2 bg-pink-400 rounded-full mr-3 flex-shrink-0"></div>
                <span>Enter your message and recipient's address</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 flex-shrink-0"></div>
                <span>Configure message pricing to control incoming transmissions</span>
              </div>
            </div>
          </div>

          {/* Main form container */}
          {/* Encryption Key Section */}
          <div className="backdrop-blur-xl bg-black/30 border border-green-500/20 rounded-2xl p-6 shadow-2xl mb-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <label className="block text-sm font-medium text-green-400">
                  Encryption Key
                </label>
                <div className="relative group">
                  <div className="w-4 h-4 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center cursor-help text-xs text-green-400 font-bold">
                    ?
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 border border-green-500/30 rounded text-xs text-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                         Phantom won't encrypt external data; if we send the data in clear text, anybody can read it, by using PKI, private keys stay safe, while enabling communication.
						<br/>
						Create a new address to send/receive messages, export the private key and just keep enough SOL in it to execute the transactions.
                  </div>
                </div>
              </div>
              <input
                type="password"
                value={encryptionKey}
                onChange={(e) => setEncryptionKey(e.target.value)}
                placeholder="Paste your encryption key here..."
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-300 font-mono text-sm"
              />
            </div>
          </div>

          <div className="backdrop-blur-xl bg-black/30 border border-cyan-500/20 rounded-2xl p-6 shadow-2xl">
            <div className="space-y-6">

              {/* Message input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-cyan-400">
                  Message
                </label>
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your clear text message; it will be encrypted locally with your private key..."
                    className="w-full h-32 px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 resize-none"
                    maxLength={500}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {message.length}/500
                  </div>
                </div>
              </div>

              {/* Address input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-pink-400">
                  Solana Public Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter recipient address..."
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 focus:outline-none transition-all duration-300 font-mono text-sm"
                />
              </div>

              {/* Send button */}
              <button
                onClick={sendMessage}
                disabled={!isValidForm || isLoading}
                className={`w-full py-4 rounded-lg font-semibold text-black transition-all duration-300 transform ${
                  isValidForm && !isLoading
                    ? 'bg-gradient-to-r from-cyan-400 to-pink-400 hover:from-cyan-300 hover:to-pink-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25 active:scale-95'
                    : 'bg-gray-700 cursor-not-allowed'
                } ${isLoading ? 'animate-pulse' : ''}`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </div>
              </button>

              {/* Status indicator */}
              {lastSent && (
                <div className="text-center">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Last transmission: {lastSent}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-xs text-gray-500">
            Encrypted • Decentralized • Anonymous
          </div>

          {/* Configuration Section */}
          <div className="mt-8">
            <div className="backdrop-blur-xl bg-black/30 border border-yellow-500/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center space-x-2 mb-6">
                <Settings className="w-5 h-5 text-yellow-400" />
                <h2 className="text-lg font-semibold text-yellow-400">Message Configuration</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-yellow-400">
                    Price to Receive Messages (SOL)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="w-4 h-4 text-yellow-400" />
                    </div>
                    <input
                      type="number"
                      value={messagePrice}
                      onChange={(e) => setMessagePrice(e.target.value)}
                      placeholder="0.001"
                      step="0.001"
                      min="0"
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all duration-300"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Set the minimum amount senders must pay to deliver messages to your address. It can be zero for free messages, but you must set a price to receive messages.
                  </p>
                </div>

                <button
                  onClick={saveConfiguration}
                  disabled={!isValidPrice || isSavingConfig}
                  className={`w-full py-3 rounded-lg font-semibold text-black transition-all duration-300 transform ${
                    isValidPrice && !isSavingConfig
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25 active:scale-95'
                      : 'bg-gray-700 cursor-not-allowed'
                  } ${isSavingConfig ? 'animate-pulse' : ''}`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {isSavingConfig ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Settings className="w-4 h-4" />
                        <span>Save Configuration</span>
                      </>
                    )}
                  </div>
                </button>

                {lastConfigSaved && (
                  <div className="text-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      Configuration saved: {lastConfigSaved}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Received Messages Section */}
          <div className="mt-8">
            <div className="backdrop-blur-xl bg-black/30 border border-purple-500/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-semibold text-purple-400">Incoming Transmissions</h2>
                </div>
                <div className="text-xs text-gray-500">
                  {receivedMessages.length} messages
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {receivedMessages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No incoming transmissions detected</p>
                    <p className="text-xs mt-1">Monitoring neural network...</p>
                  </div>
                ) : (
                  receivedMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-black/40 border border-gray-700/50 rounded-lg p-4 hover:border-purple-500/30 transition-all duration-300 group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-purple-400 font-mono">
                                {truncateAddress(msg.senderAddress)}
                              </span>
                              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(msg.timestamp)}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-9">
        <div className="max-w-md mx-auto px-">
          <div className="backdrop-blur-xl bg-black/20 rounded-2xl p-6 shadow-2xl">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-6 mb-4">
                <a
                  href="https://github.com/Sergio-Flores-Torres/neural-bond"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-2 px-4 py-2 bg-black/40 border border-gray-700 rounded-lg hover:border-cyan-400 hover:bg-black/60 transition-all duration-300 transform hover:scale-105"
                >
                  <Github className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
                  <span className="text-gray-400 group-hover:text-cyan-400 transition-colors duration-300 font-medium">
                    GitHub
                  </span>
                  <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-cyan-400 transition-colors duration-300" />
                </a>
                
                <a
                  href="https://linkedin.com/company/saft-industries"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-2 px-4 py-2 bg-black/40 border border-gray-700 rounded-lg hover:border-blue-400 hover:bg-black/60 transition-all duration-300 transform hover:scale-105"
                >
                  <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                  <span className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300 font-medium">
                    LinkedIn
                  </span>
                  <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-blue-400 transition-colors duration-300" />
                </a>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">

                <p>© 2025 Neural Bond v0.1.0 by <a href="https://saft.industries" className="text-cyan-400 hover:underline">SAFT.Industries</a>. Some rights reserved.</p>
				<br/>
				<p>Star us on Github && Send us business on Linkedin</p>
                <p className="flex items-center justify-center space-x-2">
                  <span>Built with</span>
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span>React & TypeScript</span>
				  <br/>
 		          <img src="/saft.png" alt="SAFT logo" className="inline-block" />
                </p>
				<br/>
              </div>
            </div>
          </div>
        </div>
      </footer>

		<br/><br/>

    </div>

  );
}

function App() {
	const network = WalletAdapterNetwork.Devnet;
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);
	const wallets = useMemo(
	  () => [
		// Add other wallets here
	  ],
	  [network],
	);

	return (
	<ConnectionProvider endpoint={endpoint}>
		<WalletProvider wallets={wallets} autoConnect>
		  <WalletModalProvider>
				<Main />
			</WalletModalProvider>
		</WalletProvider>
	  </ConnectionProvider>
	);
}

export default App;