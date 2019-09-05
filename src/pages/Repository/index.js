import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';

import Container from '../../components/Container';
import {
    LoadingContainer,
    Loading,
    Owner,
    IssueFilters,
    IssueList
} from './styles';
import Colors from '../../styles/constants';

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
        repoName: '',
        repository: {},
        issues: [],
        filters: [
            { state: 'all', label: 'All', active: true },
            { state: 'open', label: 'Open', active: false },
            { state: 'closed', label: 'Closed', active: false }
        ],
        filterIndex: 0,
        hideIssueList: false,
        loading: true
    };

    async componentDidMount() {
        const { match } = this.props;

        const repoName = decodeURIComponent(match.params.repositoryName);

        const { filters } = this.state;

        const [repository, issues] = await Promise.all([
            api.get(`/repos/${repoName}`),
            api.get(`/repos/${repoName}/issues`, {
                params: {
                    state: filters.find(f => f.active).state,
                    per_page: 5
                }
            })
        ]);

        this.setState({
            repoName,
            repository: repository.data,
            issues: issues.data,
            hideIssueList: issues.data.length === 0,
            loading: false
        });
    }

    async handleIssueFilter(index) {
        const { filterIndex, filters } = this.state;

        if (index === filterIndex) return;

        const { repoName } = this.state;

        const issues = await api.get(`/repos/${repoName}/issues`, {
            params: {
                state: filters[index].state,
                per_page: 5
            }
        });

        this.setState({
            issues: issues.data,
            filterIndex: index
        });
    }

    render() {
        const {
            repository,
            issues,
            hideIssueList,
            loading,
            filters,
            filterIndex
        } = this.state;

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
                    <FaArrowLeft color={Colors.primaryColor} fontSize="20" />
                </Link>
                <Owner>
                    <img
                        src={repository.owner.avatar_url}
                        alt={repository.owner.login}
                    />

                    <h1>{repository.name}</h1>
                    <p>{repository.description}</p>
                </Owner>

                <IssueList hide={hideIssueList}>
                    <IssueFilters active={filterIndex}>
                        {filters.map((filter, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => this.handleIssueFilter(index)}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </IssueFilters>
                    {issues.map(issue => (
                        <li key={String(issue.id)}>
                            <img
                                src={issue.user.avatar_url}
                                alt={issue.user.login}
                            />
                            <div>
                                <strong>
                                    <a href={issue.html_url} target="blank">
                                        {issue.title}
                                    </a>
                                    {issue.labels.map(label => (
                                        <span key={String(label.id)}>
                                            {label.name}
                                        </span>
                                    ))}
                                </strong>
                                <p>{issue.user.login}</p>
                            </div>
                        </li>
                    ))}
                </IssueList>
            </Container>
        );
    }
}
