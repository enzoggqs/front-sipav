import { act, getByPlaceholderText, getByTestId, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event";
import Register from "../index.jsx"
import useAuth from '../../../services/useAuth.jsx';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../../../services/useAuth.jsx');

const mockSignIn = jest.fn();
const mockNavigate = jest.fn();

useAuth.mockReturnValue({
  isAuthenticated: false,
  signIn: mockSignIn
});


describe('Register Form Form', () => {
  it('should display elements', () => {
    render(
      <Router>
        <Register />
      </Router>
    )
  })

  it('should display the register form and its elements', () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data de Nascimento/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
  });

  it('should show errors in empty form fields', async () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    const nameInput = screen.getByPlaceholderText("Digite seu nome completo");
    const emailInput = screen.getByPlaceholderText("Digite seu e-mail");
    const cpfInput = screen.getByPlaceholderText("Digite seu CPF");
    const passwordInput = screen.getByPlaceholderText("Digite sua senha");
    const birthdateInput = screen.getByPlaceholderText("Selecione sua data de nascimento");

    nameInput.focus();
    nameInput.blur();

    emailInput.focus();
    emailInput.blur();

    cpfInput.focus();
    cpfInput.blur();

    passwordInput.focus();
    passwordInput.blur();

    birthdateInput.focus();
    birthdateInput.blur();

    await waitFor(() => {
      expect(screen.getByText(/O campo nome é obrigatório./i)).toBeInTheDocument();
      expect(screen.getByText(/O campo email é obrigatório./i)).toBeInTheDocument();
      expect(screen.getByText(/O campo CPF é obrigatório./i)).toBeInTheDocument();
      expect(screen.getByText(/O campo senha é obrigatório./i)).toBeInTheDocument();
      expect(screen.getByText(/O campo data de nascimento é obrigatório./i)).toBeInTheDocument();
    });
  });

  it('should show errors invalid email field', async () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    const emailInput = screen.getByPlaceholderText("Digite seu e-mail");

    emailInput.focus();

    userEvent.type(emailInput, 'hello')

    emailInput.blur();

    await waitFor(() => {
      expect(screen.getByText(/E-mail inválido./i)).toBeInTheDocument();
    });
  });
})