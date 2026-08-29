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
    label: "Address 1",
    address: "Not generated yet",
    balance: "0.00000000",
  },
];

function App() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [activeAddressId, setActiveAddressId] = useState(1);

  const activeAddress =
    addresses.find((address) => address.id === activeAddressId) ??
    addresses[0];

  const createAddress = () => {
    const id = addresses.length + 1;

    const newAddress: Address = {
      id,
      label: `Address ${id}`,
      address: "Not generated yet",
      balance: "0.00000000",
    };

    setAddresses([...addresses, newAddress]);
    setActiveAddressId(id);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">Z</div>
          <div>
            <h1>ZOERD</h1>
            <span>Wallet</span>
          </div>
        </div>

        <nav>
          <button className="nav-item active">Wallet</button>
          <button className="nav-item">Transactions</button>
          <button className="nav-item">Addresses</button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item">Settings</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">ZCASH WALLET</p>
            <h2>Welcome to ZOERD Wallet</h2>
          </div>

          <div className="network">
            <span className="network-dot" />
            Mainnet
          </div>
        </header>

        <section className="balance-card">
          <div>
            <p className="card-label">Total Balance</p>
            <div className="balance">
              {activeAddress.balance} <span>ZEC</span>
            </div>
            <p className="address-preview">
              {activeAddress.address}
            </p>
          </div>

          <div className="balance-actions">
            <button className="primary-button">Send ZEC</button>
            <button className="secondary-button">Receive ZEC</button>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">WALLET</p>
                <h3>Addresses</h3>
              </div>

              <button className="small-button" onClick={createAddress}>
                + New Address
              </button>
            </div>

            <div className="address-list">
              {addresses.map((address) => (
                <button
                  key={address.id}
                  className={`address-row ${
                    address.id === activeAddressId ? "selected" : ""
                  }`}
                  onClick={() => setActiveAddressId(address.id)}
                >
                  <div className="address-icon">
                    {address.id}
                  </div>

                  <div className="address-info">
                    <strong>{address.label}</strong>
                    <span>{address.address}</span>
                  </div>

                  <div className="address-balance">
                    {address.balance} ZEC
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">ACTIVITY</p>
                <h3>Transactions</h3>
              </div>
            </div>

            <div className="empty-state">
              <div className="empty-icon">↕</div>
              <h4>No transactions yet</h4>
              <p>
                Transactions received or sent from your wallet
                will appear here.
              </p>
            </div>
          </div>
        </section>

        <footer>
          <span>ZOERD Wallet</span>
          <span>Shielded Zcash Wallet</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
