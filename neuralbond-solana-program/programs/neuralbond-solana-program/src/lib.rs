use anchor_lang::prelude::*;
use anchor_lang::solana_program::{
	system_instruction,
	clock::{Clock}
};

declare_id!("UfQzdDXyS6huk6DTDKvvM5pTK2VtWQVmaGiNJ5qTJmo");

#[program]
pub mod neuralbond_solana_program {
    use super::*;

    pub fn send_message(ctx: Context<SendMessage>, encrypted_message: String) -> Result<()> {
		let message_config = &mut ctx.accounts.message_config;

		if message_config.price > 0 {
			// Create the transfer instruction
			let transfer_instruction = system_instruction::transfer( &ctx.accounts.sender.key(), &ctx.accounts.receiver.key(), message_config.price);

			// Invoke the transfer instruction
			anchor_lang::solana_program::program::invoke_signed(
				&transfer_instruction,
				&[
					ctx.accounts.sender.to_account_info(),
					ctx.accounts.receiver.to_account_info().clone(),
					ctx.accounts.system_program.to_account_info(),
				],
				&[],
			)?;
		}

		let message = &mut ctx.accounts.message;
		message.receiver = ctx.accounts.receiver.key();
		message.sender = ctx.accounts.sender.key();
		message.created_at = Clock::get().unwrap().unix_timestamp as u64;
		message.encrypted_message = encrypted_message;

        msg!("MSG TO: {:?} - FROM: {:?}", ctx.accounts.receiver.key(), ctx.accounts.sender.key());
        Ok(())
    }

    pub fn save_message_config(ctx: Context<ConfigMessage>, price: u64, encryption_pubkey: [u8; 32]) -> Result<()> {
		let message_config = &mut ctx.accounts.message_config;
		message_config.receiver = ctx.accounts.receiver.key();
		message_config.price = price;
		message_config.encryption_pubkey = encryption_pubkey;	
        Ok(())
    }

    pub fn delete_message(ctx: Context<DeleteMessage>) -> Result<()> {
        msg!("MSG DELETED {:?}", ctx.accounts.message.key());
        Ok(())
    }
}

/**
Holds the message price for a user.
*/
#[account]
#[derive(InitSpace)]
pub struct MessageConfig {
	/// The price in lamports to send a message to this user
	pub price: u64,

	/// The receiver of the message
	pub receiver: Pubkey,

	/// The encryption pubkey of the receiver
	pub encryption_pubkey: [u8; 32],
}

/**
Holds a message sent by a user.
*/
#[account]
#[derive(InitSpace)]
pub struct Message {
	/// The receiver of the message
	pub receiver: Pubkey,

	/// The sender of the message
	pub sender: Pubkey,

	/// Current date_time on creation; technically unix_timestamp, i64 but anchor can't tell it's size
	pub created_at: u64,

	/// The encrypted message as a base64 string
	#[max_len(1000)]
	pub encrypted_message: String,
}

/**
Seeds are the sender and receiver, so you cannot send a message to someone who already has a pending message from you.
*/
#[derive(Accounts)]
pub struct SendMessage<'info> {
    #[account(init, payer = sender, space = 8 + Message::INIT_SPACE, 
		seeds = [b"neuralbondmessage", sender.key().as_ref(), receiver.key().as_ref()], bump,)]
    pub message: Account<'info, Message>,

    #[account(seeds = [b"neuralbondmessageconfig", receiver.key().as_ref()], bump,)]
    pub message_config: Account<'info, MessageConfig>,

    #[account(mut)]
    pub receiver: SystemAccount<'info>,
    
	#[account(mut)]
    pub sender: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/**
Seeds are the sender and receiver, so you cannot send a message to someone who already has a pending message from you.
*/
#[derive(Accounts)]
pub struct DeleteMessage<'info> {
    #[account(mut, close = sender, seeds = [b"neuralbondmessage", sender.key().as_ref(), receiver.key().as_ref()], bump,)]
    pub message: Account<'info, Message>,
   
	#[account(mut)]
    pub receiver: Signer<'info>,

    #[account(mut)]
    pub sender: SystemAccount<'info>,
}

/**
Seeds is the receiver, so there is only one config account per receiver.
*/
#[derive(Accounts)]
pub struct ConfigMessage<'info> {
    #[account(init_if_needed, payer = receiver, space = 8 + MessageConfig::INIT_SPACE, 
		seeds = [b"neuralbondmessageconfig", receiver.key().as_ref()], bump,)]
    pub message_config: Account<'info, MessageConfig>,

    #[account(mut)]
    pub receiver: Signer<'info>,
 
    pub system_program: Program<'info, System>,
}