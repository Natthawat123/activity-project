<<<<<<< HEAD

import CalendarFull from './components/Calendar'
import Layout from './components/Layout/Layout'

// import Loading from './components/Loading'

function App() {


  return (
    <div>
      <CalendarFull />
    </div>
  )
}

export default App
=======
import { BrowserRouter } from 'react-router-dom';
import { Router } from './Routes';


 function App() {
  return (
    <BrowserRouter>
      <Router />

    </BrowserRouter>
  );
}

export default App
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
