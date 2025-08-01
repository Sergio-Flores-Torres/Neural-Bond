use anchor_lang::prelude::*;

declare_id!("UfQzdDXyS6huk6DTDKvvM5pTK2VtWQVmaGiNJ5qTJmo");

#[program]
pub mod neuralbond_solana_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
