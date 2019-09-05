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
    IssueList,
    IssuePagination
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
        page: 1,
        loading: true
    };

    async componentDidMount() {
        const { match } = this.props;

        const repoName = decodeURIComponent(match.params.repositoryName);

        const { filters, page } = this.state;

        const [repository, issues] = await Promise.all([
            api.get(`/repos/${repoName}`),
            api.get(`/repos/${repoName}/issues`, {
                params: {
                    state: filters.find(f => f.active).state,
                    per_page: 5,
                    page
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
        const { filterIndex } = this.state;

        if (index === filterIndex) return;

        await this.setState({ filterIndex: index });

        this.handleIssuePaginate(index);
    }

    async previousPage() {
        const { page } = this.state;

        await this.setState({ page: page - 1 });
        this.handleIssuePaginate();
    }

    async nextPage() {
        const { page } = this.state;

        await this.setState({ page: page + 1 });
        this.handleIssuePaginate();
    }

    async handleIssuePaginate() {
        const { repoName, filters, filterIndex, page } = this.state;

        const issues = await api.get(`/repos/${repoName}/issues`, {
            params: {
                state: filters[filterIndex].state,
                per_page: 5,
                page
            }
        });

        this.setState({ issues: issues.data });
    }

    render() {
        const {
            repository,
            issues,
            hideIssueList,
            loading,
            filters,
            filterIndex,
            page
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

                <IssuePagination hide={hideIssueList}>
                    <button
                        type="button"
                        disabled={page < 2}
                        onClick={() => this.previousPage()}
                    >
                        Previous
                    </button>
                    <span>Page {page}</span>
                    <button type="button" onClick={() => this.nextPage()}>
                        Next
                    </button>
                </IssuePagination>
            </Container>
        );
    }
}
