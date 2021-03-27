import React from "react";
import gql from "graphql-tag";
import {useMutation, useQuery} from "@apollo/client";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Checkbox from "@material-ui/core/Checkbox";
import CommentIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import {From} from "./form";

const TodosQuery = gql`
    {
        todo {
            text
            id
            complete
        }
    }
`;
const updateMutation = gql`
    mutation($id: ID!, $complete: Boolean!) {
        updateTodo(id: $id, complete: $complete)
    }
`;

const deleteMutation = gql`
    mutation($id:ID!){
        removeTodo(id:$id)
    }
`;
const createTodoMutation = gql`
    mutation ($text:String!){
        createTodo (text:$text){
            id
            text
            complete
        }
    }
`;

function App() {
    const {loading, error, data} = useQuery(TodosQuery);
    const [deleteTodo] = useMutation(deleteMutation);
    const [updateTodos] = useMutation(updateMutation);
    const [createTodo] = useMutation(createTodoMutation);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error...</p>;

    const updateTodo = async (todo) => {
        await updateTodos({
            variables: {
                id: todo.id,
                complete: !todo.complete,
            },
            update: store => {
                const data = store.readQuery({query: TodosQuery});
                data.todo = data.todo.map(x => x.id === todo.id ? ({
                    ...todo,
                    complete: !todo.complete,
                }) : x)
                store.writeQuery({query: TodosQuery, data});
            }
        });
    };
    const removeTodo = async (todo) => {
        await deleteTodo({
            variables: {id: todo.id},
            update: store => {
                const data = store.readQuery({query: TodosQuery});
                data.todo = data.todo.filter(x => x.id !== todo.id);
                store.writeQuery({query: TodosQuery, data});
            }
        });
    };

    const createTodos = async (todo) => {
        await createTodo({
            variables: {
                text:todo
            },
            update: (store, {data: {createTodo}}) => {
                const data = store.readQuery({query: TodosQuery});
                data.todo.unshift(createTodo);
                store.writeQuery({query: TodosQuery, data});
            }
        });
    };
    return (
        <div style={{display: "flex"}}>
            <div style={{margin: "auto", width: 400}}>
                <Paper elevation={1}>
                    <From submit={createTodos}/>
                    <List>
                        {data.todo.map((todo) => (
                            <ListItem
                                key={todo.id}
                                role={undefined}
                                dense
                                button
                                onClick={() => updateTodo(todo)}
                            >
                                <Checkbox checked={todo.complete} tabIndex={-1} disableRipple/>
                                {/*{todo.text}*/}
                                <ListItemText primary={todo.text} />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => removeTodo(todo)}>
                                        <CommentIcon/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </div>
        </div>
    );
}

export default App;
