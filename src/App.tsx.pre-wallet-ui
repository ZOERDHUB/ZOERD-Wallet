import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

type Address = {
  id: number;
  alias: string;
  address: string;
  balance_zatoshis: number;
};

type View = "wallet" | "send" | "receive";

function App() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [activeAddressId, setActiveAddressId] = useState<number | null>(null);
  const [view, setView] = useState<View>("wallet");

  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [creatingAddress, setCreatingAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeAddress =
    addresses.find((item) => item.id === activeAddressId) ??
    addresses[0] ??
    null;

  useEffect(() => {
    initializeWallet();
  }, []);

  async function initializeWallet() {
    try {
      setLoading(true);
      setError(null);

      await invoke<string>("create_wallet_test");

      await refreshWallet();
    } catch (err) {
      console.error("Failed to initialize wallet:", err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  async function refreshWallet() {
    const [walletAddresses, totalBalance] = await Promise.all([
      invoke<Address[]>("get_addresses"),
      invoke<number>("get_total_balance"),
    ]);

    setAddresses(walletAddresses);
    setBalance(totalBalance);

    if (walletAddresses.length > 0) {
      setActiveAddressId((current) =>
        current !== null &&
        walletAddresses.some((address) => address.id === current)
          ? current
          : walletAddresses[0].id,
      );
    }
  }

  async function createAddress() {
    const alias = window.prompt(
      "Give this address a name:",
      `Address ${addresses.length + 1}`,
    );

    if (alias === null) {
      return;
    }

    const cleanAlias = alias.trim();

    if (!cleanAlias) {
      setError("Address alias cannot be empty.");
      return;
    }

    try {
      setCreatingAddress(true);
      setError(null);

      const newAddress = await invoke<Address>("create_address", {
        alias: cleanAlias,
      });

      setAddresses((current) => [...current, newAddress]);
      setActiveAddressId(newAddress.id);
    } catch (err) {
      console.error("Failed to create address:", err);
      setError(String(err));
    } finally {
      setCreatingAddress(false);
    }
  }

  function formatZec(zatoshis: number) {
    return (zatoshis / 100_000_000).toFixed(8);
  }

  async function copyAddress() {
    if (!activeAddress) {
      return;
    }

    try {
      await navigator.clipboard.writeText(activeAddress.address);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-symbol">Z</div>

          <div>
            <div className="logo-name">ZOERD</div>
            <div className="logo-subtitle">WALLET</div>
          </div>
        </div>

        <nav className="navigation">
          <button
            className={`nav-button ${view === "wallet" ? "active" : ""}`}
            onClick={() => setView("wallet")}
          >
            <span>◈</span>
            Wallet
          </button>

          <button
            className={`nav-button ${view === "send" ? "active" : ""}`}
            onClick={() => setView("send")}
          >
            <span>↑</span>
            Send ZEC
          </button>

          <button
            className={`nav-button ${view === "receive" ? "active" : ""}`}
            onClick={() => setView("receive")}
          >
            <span>↓</span>
            Receive ZEC
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-button">
            <span>⚙</span>
            Settings
          </button>

          <div className="network-status">
            <span className="status-dot" />

            <div>
              <strong>Mainnet</strong>
              <small>Wallet engine ready</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <div className="section-label">SHIELDED WALLET</div>

            <h1>
              {view === "wallet"
                ? "Your Wallet"
                : view === "send"
                  ? "Send ZEC"
                  : "Receive ZEC"}
            </h1>
          </div>

          <div className="wallet-selector">
            <span className="wallet-avatar">Z</span>
            <span>My Wallet</span>
            <span className="chevron">⌄</span>
          </div>
        </header>

        {error && (
          <div
            style={{
              marginBottom: "18px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "#fff1f1",
              color: "#b42318",
              fontSize: "12px",
              border: "1px solid #f3cccc",
            }}
          >
            {error}
          </div>
        )}

        {view === "wallet" && (
          <>
            <section className="balance-card">
              <div>
                <div className="section-label">TOTAL BALANCE</div>

                <div className="balance">
                  {formatZec(balance)}
                  <span>ZEC</span>
                </div>

                <div className="active-address">
                  {loading
                    ? "Loading wallet..."
                    : activeAddress
                      ? activeAddress.address
                      : "No address generated"}
                </div>
              </div>

              <div className="balance-actions">
                <button
                  className="button primary"
                  onClick={() => setView("send")}
                >
                  Send ZEC
                </button>

                <button
                  className="button secondary"
                  onClick={() => setView("receive")}
                >
                  Receive ZEC
                </button>
              </div>
            </section>

            <div className="dashboard-grid">
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <div className="section-label">WALLET</div>
                    <h2>Addresses</h2>
                  </div>

                  <button
                    className="button small"
                    onClick={createAddress}
                    disabled={creatingAddress}
                  >
                    {creatingAddress ? "Creating..." : "+ New Address"}
                  </button>
                </div>

                <div className="addresses">
                  {loading && (
                    <div className="empty">
                      <div className="empty-symbol">◌</div>
                      <h3>Loading wallet</h3>
                      <p>Preparing your shielded addresses.</p>
                    </div>
                  )}

                  {!loading && addresses.length === 0 && (
                    <div className="empty">
                      <div className="empty-symbol">Z</div>
                      <h3>No addresses yet</h3>
                      <p>
                        Create your first shielded address to start using the
                        wallet.
                      </p>
                    </div>
                  )}

                  {!loading &&
                    addresses.map((item) => (
                      <button
                        key={item.id}
                        className={`address ${
                          item.id === activeAddress?.id ? "selected" : ""
                        }`}
                        onClick={() => setActiveAddressId(item.id)}
                      >
                        <div className="address-number">
                          {item.id + 1}
                        </div>

                        <div className="address-details">
                          <strong>{item.alias}</strong>
                          <span>{item.address}</span>
                        </div>

                        <div className="address-balance">
                          {formatZec(item.balance_zatoshis)} ZEC
                        </div>
                      </button>
                    ))}
                </div>
              </section>

              <section className="panel">
                <div className="panel-header">
                  <div>
                    <div className="section-label">ACTIVITY</div>
                    <h2>Transactions</h2>
                  </div>
                </div>

                <div className="empty">
                  <div className="empty-symbol">↕</div>

                  <h3>No transactions yet</h3>

                  <p>
                    Transactions received or sent from your wallet will appear
                    here.
                  </p>
                </div>
              </section>
            </div>
          </>
        )}

        {view === "send" && (
          <section className="form-panel">
            <div className="form-header">
              <div className="form-icon">↑</div>

              <div>
                <div className="section-label">
                  SHIELDED TRANSACTION
                </div>
                <h2>Send ZEC</h2>
              </div>
            </div>

            <label>
              Recipient Address
              <input
                placeholder="Enter a Zcash address"
                type="text"
              />
            </label>

            <label>
              Amount
              <div className="amount-input">
                <input
                  placeholder="0.00000000"
                  type="number"
                  min="0"
                  step="0.00000001"
                />
                <span>ZEC</span>
              </div>
            </label>

            <label>
              Memo <span className="optional">Optional</span>
              <textarea placeholder="Add an encrypted memo..." />
            </label>

            <div className="available">
              Available balance
              <strong>{formatZec(balance)} ZEC</strong>
            </div>

            <button className="button primary full">
              Review Transaction
            </button>
          </section>
        )}

        {view === "receive" && (
          <section className="form-panel receive-panel">
            <div className="form-header">
              <div className="form-icon">↓</div>

              <div>
                <div className="section-label">SHIELDED ADDRESS</div>
                <h2>Receive ZEC</h2>
              </div>
            </div>

            <div className="qr-placeholder">QR</div>

            <div className="receive-address">
              <span>
                {activeAddress
                  ? `${activeAddress.alias} — receiving address`
                  : "Your receiving address"}
              </span>

              <strong>
                {activeAddress
                  ? activeAddress.address
                  : "No address available"}
              </strong>
            </div>

            <div className="receive-actions">
              <button
                className="button primary"
                onClick={copyAddress}
                disabled={!activeAddress}
              >
                Copy Address
              </button>

              <button className="button secondary">
                Share
              </button>
            </div>

            <p className="privacy-note">
              Your shielded address can be shared with anyone who needs to
              send you ZEC.
            </p>
          </section>
        )}

        <footer>
          <span>ZOERD Wallet</span>
          <span>Shielded Zcash Wallet</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
