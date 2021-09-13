import React from 'react'
import styles from '../../styles/Home.module.css'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';


import { Todo } from "../graphql/types";
import { useMutation } from '@apollo/client';
import { REMOVE_TODO, TOGGLE_TODO } from '../graphql/Mutations';

type Props = {
    todos: Todo[],
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

const GetAllTodos = ( { todos, setTodos } : Props ) => {
    const [deleteTodo, {error}] = useMutation(REMOVE_TODO);
    const [toggleTodo, {error: toggleErorr}] = useMutation(TOGGLE_TODO);

    const toggleFinished = async ( id: Number ) => {
        if( !id ) return console.log(`No id in toggleFinished!`);

        const todo: Todo | undefined = todos.find(t=> t.id === id);
        if( !todo ) return console.log(`Couldn't find todo with id: ${id}`);

        const newTodo = {
            ...todo,
            finished: !todo.finished
        };

        const newTodos = todos.filter( t => t.id !== id );
        toggleTodo({
            variables: {
                id, 
                finished: newTodo.finished
            }
        });

        const final = newTodo.finished === true ? [ ...newTodos, newTodo ] : [ newTodo, ...newTodos ];
        setTodos( final );

        console.log( final.filter(todo=> todo.finished === true) );
    }

    const removeTodo = async ( id: Number ) => {
        if( !id ) return console.log(`No id in toggleFinished!`);

        const todo: Todo | undefined = todos.find(t=> t.id === id);
        if( !todo ) return console.log(`Couldn't find todo with id: ${id}`);

        const result = await deleteTodo({
            variables: { id }
        });

        console.log(result);

        if( result ) {
            setTodos([ ...todos.filter(todo => todo.id !== id) ]);
        }
    }

    return (
        <List className={ styles.listContainer }>
            {
                todos && todos.map( (todo: Todo, id: number) => (
                    <ListItem key={ `todo-${id}` } className={ todo.finished === true ? styles.TodoFinished : styles.TodoNotFinished } >
                        <ListItemIcon>
                            <IconButton 
                                edge="start"
                                aria-label="changeState"
                                onClick={ () => toggleFinished(todo.id) }
                            >
                                {
                                    todo.finished === true?
                                        <CheckBoxIcon />
                                    :
                                        <CheckBoxOutlineBlankIcon />
                                }
                            </IconButton>
                        </ListItemIcon>
        
                        <ListItemText
                            primary={ todo.message }
                            secondary={ todo.finished === true ? "Finished!" : "Not finished!" }
                        />
        
                        <ListItemSecondaryAction>
                            <IconButton 
                                edge="end"
                                aria-label="delete"
                                onClick={ () => removeTodo(todo.id) }
                            >
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))
            }
      </List>
    )
}

export default GetAllTodos;
