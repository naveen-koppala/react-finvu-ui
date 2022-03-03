import logo from './logo.svg';
import './App.css';
import SelectAggActList from './Components/SelectAggActList';
import LinkAccount from './Components/LinkAccount';
import { Route, Routes } from 'react-router-dom';
import EnterOtp from './Components/EnterOtp';
import DetailsOfAccess from './Components/DetailsOfAccess';
import ConsentAccepted from './Components/ConsentAccepted'
import AccountAggregatorFailed from './Components/AccountAggregatorFailed'
import SelectForLinkBankAct from './Components/SelectForLinkBankAct'
import { BrowserRouter } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SelectAggActList />} />
        <Route path="otp" element={<EnterOtp />} />
        <Route path='linkaccount' element={<LinkAccount />} />
        <Route path='success' element={<ConsentAccepted />} />
        <Route path='failed' element={<AccountAggregatorFailed />} />
        <Route path='details' element={<DetailsOfAccess />} />
        <Route path='select' element={<SelectForLinkBankAct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
