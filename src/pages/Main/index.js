import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
    state = {
        newRepo: '',
        repositories: [],
        loading: false,
        invalid: false
    };

    // Load localStorage data
    componentDidMount() {
        const repositories = localStorage.getItem('repositories');

        if (repositories)
            this.setState({ repositories: JSON.parse(repositories) });
    }

    // Save the localStorage data
    componentDidUpdate(_, prevState) {
        const { repositories } = this.state;

        if (prevState.repositories !== repositories) {
            localStorage.setItem('repositories', JSON.stringify(repositories));
        }
    }

    handleSubmit = async e => {
        try {
            e.preventDefault();

            const { newRepo, repositories } = this.state;

            if (!newRepo) return;

            this.setState({ loading: true, invalid: false });

            const hasRepository = repositories.find(r => r.name === newRepo);

            if (hasRepository) throw new Error('Duplicated repository');

            const response = await api.get(`/repos/${newRepo}`);

            const data = {
                name: response.data.full_name
            };

            this.setState({
                repositories: [...repositories, data],
                newRepo: ''
            });
        } catch (err) {
            this.setState({ invalid: true });
        } finally {
            this.setState({ loading: false });
        }
    };

    handleInputChange = e => {
        this.setState({ newRepo: e.target.value, invalid: false });
    };

    render() {
        const { newRepo, loading, repositories, invalid } = this.state;

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositories
                </h1>
                <Form onSubmit={this.handleSubmit} invalid={invalid}>
                    <input
                        type="text"
                        placeholder="Add repository"
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />
                    <SubmitButton loading={loading || undefined}>
                        {loading ? (
                            <FaSpinner color="#FFF" size={14} />
                        ) : (
                            <FaPlus color="#FFF" size={14} />
                        )}
                    </SubmitButton>
                </Form>

                <List>
                    {repositories.map(repository => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>
                            <Link
                                to={`/repository/${encodeURIComponent(
                                    repository.name
                                )}`}
                            >
                                Details
                            </Link>
                        </li>
                    ))}
                </List>
            </Container>
        );
    }
}
