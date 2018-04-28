import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

const NavBar = ({path, handleLogout, isLoggedIn, studentRedirect, ownerRedirect, buildRedirect}) => (
  <div>
    <AppBar
      zDepth={0}
      style={{"backgroundColor":'#D8E4EA'}}
      showMenuIconButton={false}
      iconElementRight={
        <div>
          {(path !== '/' && !isLoggedIn) 
            && <Link to='/'><FlatButton label="Login" style={{"color":"black"}}/></Link>}

          {(path !== '/registration' && !isLoggedIn) 
            && <Link to='/registration'><FlatButton label="Sign Up" style={{"color":"black"}}/></Link>}

          {(isLoggedIn && buildRedirect) 
            && <Link to='/owner/build'><FlatButton label="Build Series" style={{"color":"black"}}/></Link>}

          {(isLoggedIn && studentRedirect) 
            && <Link to='/student'><FlatButton label="All Videos" style={{"color":"black"}}/></Link>}

          {(isLoggedIn && ownerRedirect) 
            && <Link to='/owner'><FlatButton label="All Videos" style={{"color":"black"}}/></Link>}

          {(isLoggedIn) 
            && <FlatButton onClick={handleLogout} label="Log Out" style={{"color":"black"}}/>}
        </div>
      }
    />
  </div>
)

export default NavBar;