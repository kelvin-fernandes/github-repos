import styled, { keyframes, css } from 'styled-components';
import Colors from '../../styles/constants';

const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg)
    }
`;

export const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;

    svg {
        animation: ${rotate} 2s linear infinite;
        margin-bottom: 10px;
    }
`;

export const Loading = styled.div`
    color: #fff;
    font-size: 30px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Owner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
        width: 120px;
        border-radius: 50%;
        margin-top: 20px;
    }

    h1 {
        font-size: 24px;
        margin-top: 10px;
    }

    p {
        margin-top: 5px;
        font-size: 14px;
        color: #666;
        line-height: 1.4;
        text-align: center;
        max-width: 400px;
    }
`;

export const IssueFilters = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;

    button {
        height: 32px;
        background: white;
        border: 1px solid ${Colors.primaryColor};
        padding: 0 15px;
        border-radius: 4px;

        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
            background: #3a59ae;
            color: white;
        }

        & + button {
            margin-left: 2px;
        }

        &:nth-child(${props => props.active + 1}) {
            background: ${Colors.primaryColor};
            border: 1px solid ${Colors.primaryColor};
            color: white;
        }
    }
`;

export const IssueList = styled.ul`
    padding-top: 20px;
    margin-top: 20px;
    border-top: 1px solid #eee;
    list-style: none;

    ${props =>
        props.hide &&
        css`
            display: none;
        `}

    li {
        display: flex;
        padding: 15px 10px;
        border: 1px solid #eee;
        border-radius: 4px;

        & + li {
            margin-top: 10px;
        }

        img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 2px solid #eee;
        }

        div {
            flex: 1;
            margin-left: 15px;

            strong {
                font-size: 16px;
                line-height: 1.5;

                a {
                    text-decoration: none;
                    color: #333;

                    &:hover {
                        color: ${Colors.primaryColor};
                    }
                }

                span {
                    background: ${Colors.primaryColor};
                    color: #fff;
                    border-radius: 2px;
                    font-size: 12px;
                    font-weight: 600px;
                    height: 20px;
                    padding: 3px 4px;
                    margin-left: 10px;
                }
            }

            p {
                margin-top: 5px;
                font-size: 12px;
                color: #999;
            }
        }
    }
`;
