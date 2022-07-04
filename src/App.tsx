import React from 'react';
import 'styles/app.scss';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationContainer } from 'components/Notification';
import routes from 'routes';
import { useSelector } from 'react-redux';
import Loader from 'components/Loader';

function App() {
  const loading = useSelector<any, boolean>(state => state.viewState.loading);

  return (
    <div className="App">
      <Router>
        <Routes>
          {routes.map((e) => (
            <Route key={e.path} path={e.path} element={React.createElement(e.component)} />
          ))}
          <Route
            path="*"
            element={<Navigate to="/" />}
          />
        </Routes>
      </Router>
      <NotificationContainer />
      {loading && <Loader />};
    </div>
  );
}

export default App;
