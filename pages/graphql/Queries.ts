import { gql } from "@apollo/client";

export const LOAD_TODOS = gql`
    query {
        getAllTodos {
            id,
            message,
            finished
        }
    }
`;