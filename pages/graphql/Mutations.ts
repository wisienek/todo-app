import { gql } from "@apollo/client";

export const CREATE_TODO = gql`
    mutation createTodo( $message: String!, $finished: Boolean! ) {
        createTodo( message: $message, finished: $finished ) {
            id,
            message,
            finished
        }
    }
`;

export const TOGGLE_TODO = gql`
    mutation editTodoState( $id: Int!, $finished: Boolean! ) {
        editTodoState( id: $id, finished: $finished ) {
            id,
            message,
            finished
        }
    }
`;

export const REMOVE_TODO = gql`
    mutation removeTodo( $id: Int! ) {
        removeTodo( id: $id ) {
            id,
            message,
            finished
        }
    }
`;