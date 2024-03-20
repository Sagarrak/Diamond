import gql from "graphql-tag";

export const GET_ALL_EDUCATIONS = gql`
    query GetEducations($page: Int, $limit: Int) {
        getEducations(page: $page, limit: $limit) {
            count
            data {
            id
            title
            image
            content
            isActive
            createdAt
            }
        }
    }
`;

export const GET_EDUCATION = gql`
    query GetEducation($getEducationId: ID) {
        getEducation(id: $getEducationId) {
            status
            message
            education {
            id
            title
            image
            content
            isActive
            createdAt
            }
        }
    }
`;