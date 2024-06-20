import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../images/logo-sevenpounds.webp'; // Import the logo image


function NavbarComponent() {
    return (
        <Navbar expand="lg" className='flex-column'>
            {/* <Nav className="mr-auto">
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Menu
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <LinkContainer to="/">
                            <Dropdown.Item>Home</Dropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/powerbi">
                            <Dropdown.Item>Power BI</Dropdown.Item>
                        </LinkContainer>
                    </Dropdown.Menu>
                    
                </Dropdown>
            </Nav> */}
            <div className="d-flex justify-content-center">
                <Navbar.Brand href="http://localhost:3000/">
                    <img
                        src={logo}
                        className="d-inline-block align-top"
                        alt="Logo"
                    />
                </Navbar.Brand>
            </div>
            <div className='w-100'>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-start">
                    <Nav className="mr-auto">
                        <NavDropdown title="Menu" id="basic-nav-dropdown">
                            <LinkContainer to="/">
                                <NavDropdown.Item>Setor Empresas</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to="/exposicaoEmpresas">
                                <NavDropdown.Item>Exposição Empresas</NavDropdown.Item>
                            </LinkContainer>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}

export default NavbarComponent;