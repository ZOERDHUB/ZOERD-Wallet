use rand::rngs::OsRng;
use rand::RngCore;
use serde::{Deserialize, Serialize};
use zcash_keys::keys::{UnifiedAddressRequest, UnifiedSpendingKey};
use zcash_protocol::consensus::Network;
use zip32::AccountId;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WalletAddress {
    pub id: u32,
    pub alias: String,
    pub address: String,
    pub balance_zatoshis: u64,
}

impl WalletAddress {
    pub fn balance_zec(&self) -> f64 {
        self.balance_zatoshis as f64 / 100_000_000.0
    }
}

#[derive(Debug)]
pub struct WalletCore {
    seed: [u8; 32],
    spending_key: UnifiedSpendingKey,
    addresses: Vec<WalletAddress>,
}

impl WalletCore {
    pub fn generate() -> Result<Self, String> {
        let mut seed = [0u8; 32];
        OsRng.fill_bytes(&mut seed);

        Self::from_seed(seed)
    }

    pub fn from_seed(seed: [u8; 32]) -> Result<Self, String> {
        let network = Network::MainNetwork;

        let spending_key =
            UnifiedSpendingKey::from_seed(
                &network,
                &seed,
                AccountId::ZERO,
            )
            .map_err(|e| format!("Failed to derive wallet keys: {e:?}"))?;

        Ok(Self {
            seed,
            spending_key,
            addresses: Vec::new(),
        })
    }

    pub fn default_address(&self) -> Result<String, String> {
        let ufvk = self.spending_key.to_unified_full_viewing_key();

        let (address, _) = ufvk
            .default_address(UnifiedAddressRequest::AllAvailableKeys)
            .map_err(|e| format!("Failed to derive address: {e:?}"))?;

        Ok(address.encode(&Network::MainNetwork))
    }

    pub fn total_balance_zatoshis(&self) -> u64 {
        self.addresses
            .iter()
            .map(|address| address.balance_zatoshis)
            .sum()
    }

    pub fn total_balance_zec(&self) -> f64 {
        self.total_balance_zatoshis() as f64 / 100_000_000.0
    }

    pub fn addresses(&self) -> &[WalletAddress] {
        &self.addresses
    }

    pub fn add_address(
        &mut self,
        alias: String,
        address: String,
    ) -> u32 {
        let id = self.addresses.len() as u32;

        self.addresses.push(WalletAddress {
            id,
            alias,
            address,
            balance_zatoshis: 0,
        });

        id
    }

    pub fn set_address_balance(
        &mut self,
        id: u32,
        balance_zatoshis: u64,
    ) -> Result<(), String> {
        let address = self
            .addresses
            .iter_mut()
            .find(|address| address.id == id)
            .ok_or_else(|| format!("Address {} not found", id))?;

        address.balance_zatoshis = balance_zatoshis;

        Ok(())
    }

    pub fn seed(&self) -> &[u8; 32] {
        &self.seed
    }
}