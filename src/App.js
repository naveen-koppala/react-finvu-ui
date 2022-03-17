import './App.css';
import { Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css'
import EnterOtp from './Components/EnterOtp';
import LinkAccount from './Components/LinkAccount';
import EnterBankOtp from './Components/NewAcAddOtp';
import ConsentAccepted from './Components/ConsentAccepted'
import AccountAggregatorFailed from './Components/AccountAggregatorFailed'
import DetailsOfAccess from './Components/DetailsOfAccess';
import NewBanksSelect from './Components/NewBanksSelect';
import  NewAcAddEnterOtp from './Components/NewAcAddOtp'
import ConsentRequestEncrypt from './Components/ConsentRequestEncrypt'
import { BrowserRouter } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ConsentRequestEncrypt />} />
        <Route path="otp/:name" element={<EnterOtp />} />
        <Route path='linkaccount/:fipid' element={<LinkAccount />} />
        <Route path="bankotp" element={<EnterBankOtp />} />
        <Route path='details' element={<DetailsOfAccess />} />
        <Route path='newbanksselect' element={<NewBanksSelect />} />
        <Route path='newacaddenterotp/:name' element={<NewAcAddEnterOtp />} />
        <Route path='success' element={<ConsentAccepted />} />
        <Route path='failed' element={<AccountAggregatorFailed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
