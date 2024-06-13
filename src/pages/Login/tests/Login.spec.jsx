import { render, screen, waitFor, fireEvent } from "@testing-library/react"
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
  beforeEach(() => {
    render(
      <Router>
        <Login />
      </Router>
    );
  });

  it('should display the login form and its elements', () => {
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/cadastre-se/i)).toBeInTheDocument();
  });

  it('should show validation errors on empty form submission', async () => {  
    userEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(await screen.getByTestId('valid-form')).toBeValid()
  });

  it("should render login button disabled", async () => {
    expect(screen.getByRole('button', { name: /login/i })).toBeDisabled();
  });

  it('should show errors in empty form fields', async () => {

    const emailInput = screen.getByPlaceholderText("Digite seu e-mail");
    const passwordInput = screen.getByPlaceholderText("Digite sua senha");

    emailInput.focus();
    emailInput.blur();

    passwordInput.focus();
    passwordInput.blur();

    await waitFor(() => {
      expect(screen.getByText(/O campo email é obrigatório./i)).toBeInTheDocument();
      expect(screen.getByText(/O campo senha é obrigatório./i)).toBeInTheDocument();
    });
  }); 

it('should call loginHandle when login button is clicked', async () => {
    const emailInput = screen.getByPlaceholderText("Digite seu e-mail");
    const passwordInput = screen.getByPlaceholderText("Digite sua senha");

    // Preencha os campos do formulário
    userEvent.type(emailInput, 'test@example.com');
    userEvent.type(passwordInput, 'password');

    // Simule o envio do formulário
    fireEvent.submit(screen.getByTestId('valid-form'));

    // Esperar que o handleSubmit seja chamado
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
    });

    // Verifique se o método loginHandle foi chamado com os valores corretos
    expect(mockSignIn).toHaveBeenCalledWith('test@mail.com', '12345678', expect.any(Function));
  });
  
})