import { getByPlaceholderText, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event";
import Login from "../index.jsx"
import useAuth from '../../../services/useAuth.jsx';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../../../services/useAuth.jsx');

const mockSignIn = jest.fn();
const mockNavigate = jest.fn();

useAuth.mockReturnValue({
  isAuthenticated: false,
  signIn: mockSignIn
});


describe('Login Form', () => {
  it('should display elements', () => {
    render(
      <Router>
        <Login/>
      </Router>
      )
  })

  it('should display the login form and its elements', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/cadastre-se/i)).toBeInTheDocument();
  });

  it('should show validation errors on empty form submission', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );
  
    userEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(await screen.getByTestId('valid-form')).toBeValid()
  });
})