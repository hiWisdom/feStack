
import './index.css';
import HeaderLayout from './components/layout/Header';
import DashboardMetrics from './components/layout/Layout';
import TransactionsTable from './components/transactions/THistory';
function App() {
  return (
    <>
      <HeaderLayout/>
      <DashboardMetrics/>
      <TransactionsTable/>
    </>
      
  );
}

export default App;
