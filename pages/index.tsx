import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { useState, useEffect } from "react";

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CachedIcon from '@material-ui/icons/Cached';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import { useMutation } from '@apollo/client';
import { useQuery } from '@apollo/client';

import GetAllTodos from './components/GetAllTodos';

import { Todo } from './graphql/types';
import { CREATE_TODO } from './graphql/Mutations';
import { LOAD_TODOS } from "./graphql/Queries";


const Home: NextPage = () => {
  const { error: load_error, loading, data } = useQuery(LOAD_TODOS);

  const [ todos, setTodos ] = useState< Todo[] >([]);
  const [ currentValue, setCurrentValue ] = useState("");

  const [createTodo, { error }] = useMutation(CREATE_TODO);

  const addTodo = async () => {
    if( currentValue.replace(/\s\W/g, '').length < 6 ) throw new Error("Todo Message too short! (at least 5 characters)");
    if( todos.some( (todo: Todo) => todo?.message === currentValue) ) throw new Error("Some todos already have this message");

    const newTodo = await createTodo({
      variables: {
        message: currentValue,
        finished: false
      },
    });
    
    if( newTodo?.data?.createTodo?.id ) {
      setTodos( [ newTodo.data.createTodo, ...todos] );
      setCurrentValue("");
    } else {
      alert(`Couldn't resolve new todo!`);
    }

    if (error) {
      console.error(error);
    }
  }

  const generateTodos = async () => {
    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer pretium porta condimentum. Mauris cursus enim.";
    const len = lorem.length;

    for( let i=0; i < 3000; i++ ) {
      await createTodo({
        variables: {
          message: lorem.slice(0, Math.ceil(Math.random() * len-1) ),
          finished: false
        },
      })
    }
  }

  useEffect( () => {
    if( data?.getAllTodos ) { 
      const filtered = [...data.getAllTodos].sort(( a:any, b:any ) => a.finished-b.finished);
      
      setTodos( filtered );
    }
  }, [data]);

  return (
      <div className={styles.container}>
        <Head>
          <title>TODO app</title>
          <meta name="description" content="TODO app made for interview" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>
            Todo APP
          </h1>

          <div style={{
            marginTop: '3rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '.8rem'
          }}>
            <TextField
              multiline
              autoFocus
              required
              label="Todo message"
              variant="filled"
              onChange={ (text) => setCurrentValue(text.target.value) }
              value={ currentValue }
            />
            <Fab color="primary" aria-label="add" onClick={ () => addTodo() }>
              <AddIcon />
            </Fab>
            <Fab color="secondary" aria-label="random" onClick={ () => generateTodos() }>
              <CachedIcon />
            </Fab>
          </div>

          <Grid item xs={12} md={12}>

            <GetAllTodos todos={ todos } setTodos={ setTodos } />

          </Grid>
        </main>
      </div>
  )
}

export default Home
