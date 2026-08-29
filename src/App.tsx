import { useState } from "react";
import "./App.css";

type Address = {
  id: number;
  label: string;
  address: string;
  balance: string;
};

const initialAddresses: Address[] = [
  {
    id: 1,
    label: "Main Address",
    address: "No address generated yet",
    balance: "0.00000000",
  },
];

function App() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [activeAddressId, setActiveAddressId] = useState(1);
  const [view, setView] = useState<"wallet" | "send" | "receive">("wallet");

  const activeAddress =
    addresses.find((item) => item.id === activeAddressId) ??
    addresses[0];

  function createAddress() {
    const id = addresses.length + 1;

    const address: Address = {
      id,
      label: `Address ${id}`,
      address: "No address generated yet",
      balance: "0.00000000",
    };

    setAddresses((current) => [...current, address]);
    setActiveAddressId(id);
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
              <small>Connected</small>
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

        {view === "wallet" && (
          <>
            <section className="balance-card">
              <div>
                <div className="section-label">TOTAL BALANCE</div>

                <div className="balance">
                  0.00000000
                  <span>ZEC</span>
                </div>

                <div className="active-address">
                  {activeAddress.address}
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
                  >
                    + New Address
                  </button>
                </div>

                <div className="addresses">
                  {addresses.map((item) => (
                    <button
                      key={item.id}
                      className={`address ${item.id === activeAddressId ? "selected" : ""}`}
                      onClick={() => setActiveAddressId(item.id)}
                    >
                      <div className="address-number">
                        {item.id}
                      </div>

                      <div className="address-details">
                        <strong>{item.label}</strong>
                        <span>{item.address}</span>
                      </div>

                      <div className="address-balance">
                        {item.balance} ZEC
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
                    Transactions received or sent from this
                    address will appear here.
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
                <div className="section-label">SHIELDED TRANSACTION</div>
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
                <input placeholder="0.00000000" type="number" />
                <span>ZEC</span>
              </div>
            </label>

            <label>
              Memo <span className="optional">Optional</span>
              <textarea placeholder="Add an encrypted memo..." />
            </label>

            <div className="available">
              Available balance
              <strong>0.00000000 ZEC</strong>
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

            <div className="qr-placeholder">
              QR
            </div>

            <div className="receive-address">
              <span>Your receiving address</span>

              <strong>
                {activeAddress.address}
              </strong>
            </div>

            <div className="receive-actions">
              <button className="button primary">
                Copy Address
              </button>

              <button className="button secondary">
                Share
              </button>
            </div>

            <p className="privacy-note">
              Your shielded address can be shared with anyone
              who needs to send you ZEC.
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