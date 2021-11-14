import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import PrivateRoute from './components/routing/PrivateRoute';
import ForgotPasswordScreen from './components/screens/ForgotPasswordScreen';
import LoginScreen from './components/screens/LoginScreen';
// import PrivateScreen from './components/screens/PrivateScreen';
import RegisterScreen from './components/screens/RegisterScreen';
import ResetPasswordScreen from './components/screens/ResetPasswordScreen';

function App() {
  return (
    <Router>
      <div className='app'>
        <Routes>
          <Route exact path='/login' component={LoginScreen} />
          <Route exact path='/register' component={RegisterScreen} />
          <Route
            exact
            path='/forgotPassword'
            component={ForgotPasswordScreen}
          />
          <Route
            exact
            path='/passwordreset/:resetToken'
            component={ResetPasswordScreen}
          />
          {/* <PrivateRoute exact path='/' component={PrivateScreen} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
