import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';

import Container from '../../components/Container';
import { LoadingContainer, Loading, Owner } from './styles';

import api from '../../services/api';

export default class Repository extends Component {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                repositoryName: PropTypes.string
            })
        }).isRequired
    };

    state = {
        repository: {},
        issues: [],
        loading: true
    };

    async componentDidMount() {
        const { match } = this.props;

        const repoName = decodeURIComponent(match.params.repositoryName);

        const [repository, issues] = await Promise.all([
            api.get(`/repos/${repoName}`),
            api.get(`/repos/${repoName}/issues`, {
                params: {
                    status: 'open',
                    per_page: 5
                }
            })
        ]);

        this.setState({
            repository: repository.data,
            issues: issues.data,
            loading: false
        });
    }

    render() {
        const { repository, issues, loading } = this.state;

        if (loading) {
            return (
                <LoadingContainer>
                    <FaSpinner color="#FFF" size={24} />
                    <Loading>Loading...</Loading>
                </LoadingContainer>
            );
        }

        return (
            <Container>
                <Link to="/">
                    <FaArrowLeft color="#042f4b" fontSize="20" />
                </Link>
                <Owner>
                    <img
                        src={repository.owner.avatar_url}
                        alt={repository.owner.login}
                    />

                    <h1>{repository.name}</h1>
                    <p>{repository.description}</p>
                </Owner>
            </Container>
        );
    }
}
