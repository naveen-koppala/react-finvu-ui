import logo from './logo.svg';
import './App.css';
import SelectAggActList from './Components/ifNoAccountIslinked/SelectAggActList1';
import EnterOtp from './Components/ifNoAccountIslinked/EnterOtp2';
import SelectForLinkBankAct from './Components/ifNoAccountIslinked/SelectForLinkBankAct3'
import LinkAccount from './Components/ifNoAccountIslinked/LinkAccount4';
import EnterBankOtp from './Components/ifNoAccountIslinked/EnterOtp5';
import ConsentAccepted from './Components/ifNoAccountIslinked/ConsentAccepted6'
import AccountAggregatorFailed from './Components/ifNoAccountIslinked/AccountAggregatorFailed7'
import { Route, Routes } from 'react-router-dom';
import DetailsOfAccess from './Components/DetailsOfAccess3';

import { BrowserRouter } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SelectAggActList />} />
        <Route path="otp" element={<EnterOtp />} />
        <Route path='select' element={<SelectForLinkBankAct />} />
        <Route path='linkaccount' element={<LinkAccount />} />
        <Route path="bankotp" element={<EnterBankOtp />} />
        <Route path='success' element={<ConsentAccepted />} />
        <Route path='failed' element={<AccountAggregatorFailed />} />
        <Route path='details' element={<DetailsOfAccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
