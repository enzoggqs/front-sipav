import { render, screen, waitFor } from "@testing-library/react";
import Dependents from "../index.jsx";
import DependentAPI from '../../../services/DependentAPI';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from "@testing-library/user-event";

// Mock DependentAPI
jest.mock('../../../services/DependentAPI');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockGetAllDependents = jest.fn();
const mockCreateDependent = jest.fn();
const mockUpdateDependent = jest.fn();
const mockDeleteDependent = jest.fn();

DependentAPI.mockReturnValue({
  getAllDependents: mockGetAllDependents,
  createDependent: mockCreateDependent,
  updateDependent: mockUpdateDependent,
  deleteDependent: mockDeleteDependent,
});

describe('Dependents Form', () => {
  beforeEach(() => {
    const mockUser = {
      "id": 1,
      "email": "teste@mail.com",
      "name": "testeee",
      "cpf": "12341234123",
      "phoneNumber": "61985575759",
      "dependents": [
        { "id": 13, "email": null, "name": "José Luiz Datena Santana", "cpf": "12345652135799", "password": null, "birthdate": "2024-01-10T00:00:00.000Z", "phoneNumber": null, "isResponsible": true, "telegram": null, "responsible_id": 1 },
        { "id": 14, "email": null, "name": "Josel", "cpf": "123123123132", "password": null, "birthdate": "2022-10-10T00:00:00.000Z", "phoneNumber": null, "isResponsible": true, "telegram": null, "responsible_id": 1 }
      ]
    };

    localStorage.setItem('@sipavUser', JSON.stringify(mockUser));

    mockGetAllDependents.mockResolvedValue({
      data: {
        dependents: mockUser.dependents
      }
    });
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should display the add Dependents form and its elements', async () => {
    render(
      <Router>
        <Dependents />
      </Router>
    );

    // Wait for the spinner to be removed and the form to be displayed
    await waitFor(() => {
      expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: /adicionar dependente/i }));

    // Verify the form elements are present
    await waitFor(() => {
      expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Data de Nascimento/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    });
  });

  it('should show errors in empty form fields', async () => {
    render(
      <Router>
        <Dependents />
      </Router>
    );

    await waitFor(() => {
      expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: /adicionar dependente/i }));

    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText("Digite seu nome completo");
      const cpfInput = screen.getByPlaceholderText("Digite CPF para cadastro");
      const birthdateInput = screen.getByPlaceholderText("Selecione sua data de nascimento");

      nameInput.focus();
      nameInput.blur();

      cpfInput.focus();
      cpfInput.blur();

      birthdateInput.focus();
      birthdateInput.blur();
    })


    await waitFor(() => {
      expect(screen.getByText(/O campo nome é obrigatório./i)).toBeInTheDocument();
      expect(screen.getByText(/O campo CPF é obrigatório./i)).toBeInTheDocument();
      expect(screen.getByText(/O campo data de nascimento é obrigatório./i)).toBeInTheDocument();
    });
  });

  it('should add a new dependent', async () => {
    render(
      <Router>
        <Dependents />
      </Router>
    );
  
    await waitFor(() => {
      expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
    });
  
    userEvent.click(screen.getByRole('button', { name: /adicionar dependente/i }));
  
    const nameInput = screen.getByPlaceholderText("Digite seu nome completo");
    const cpfInput = screen.getByPlaceholderText("Digite CPF para cadastro");
    const birthdateInput = screen.getByPlaceholderText("Selecione sua data de nascimento");
  
    userEvent.type(nameInput, "Novo Dependente");
    userEvent.type(cpfInput, "12345678901");
    userEvent.type(birthdateInput, "2000-01-01");
  
    userEvent.click(screen.getByRole('button', { name: /salvar/i }));
  
    await waitFor(() => {
      expect(mockCreateDependent).toHaveBeenCalledWith({
        name: "Novo Dependente",
        cpf: "12345678901",
        birthdate: "2000-01-01",
        isResponsible: false,
        responsible_id: 1
      });
    });
  });
});
