import gql from "graphql-tag";

export const ADD_EDUCATION = gql`
    mutation AddEducation($input: education) {
        addEducation(input: $input) {
            education {
            isActive
            content
            createdAt
            id
            image
            title
            }
            message
            status
        }
    }
`;


export const UPDATE_EDUCATION = gql`
    mutation UpdateEducation($input: education) {
        updateEducation(input: $input) {
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

export const DELETE_EDUCATION = gql`
    mutation DeleteEducation($deleteEducationId: ID) {
        deleteEducation(id: $deleteEducationId)
    }
`;

